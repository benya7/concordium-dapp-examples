//! A tool for indexing event data from the track and trace contract.
use anyhow::Context;
use clap::Parser;
use concordium_rust_sdk::{
    indexer,
    smart_contracts::common::OwnedEntrypointName,
    types::{hashes::TransactionHash, queries::BlockInfo, AbsoluteBlockHeight, ContractAddress},
    v2 as sdk,
};
use contract::ItemStatusChangedEvent;
use indicatif::{ProgressBar, ProgressStyle};
use track_and_trace as contract;

mod db;
use crate::db::*;

/// Command line configuration of the application.
#[derive(Debug, clap::Parser)]
#[command(author, version, about)]
struct Args {
    #[arg(
        long = "node",
        short = 'n',
        help = "The node endpoint.",
        default_value = "https://grpc.testnet.concordium.com:20000",
        global = true,
        env = "CCD_INDEXER_NODE"
    )]
    node_endpoint:    concordium_rust_sdk::v2::Endpoint,
    #[arg(
        long = "start",
        short = 's',
        help = "The start time when the track and trace contract was initialized. The format is \
                ISO-8601, e.g. 2024-01-23T12:13:14Z.",
        env = "CCD_INDEXER_START"
    )]
    start:            chrono::DateTime<chrono::Utc>,
    #[arg(
        long = "contract",
        short = 'c',
        help = "The track and trace contract address.",
        env = "CCD_INDEXER_CONTRACT"
    )]
    contract_address: ContractAddress,
    /// Database connection string.
    #[arg(
        long = "db-connection",
        default_value = "host=localhost dbname=indexer3 user=postgres password=password port=5432",
        help = "A connection string detailing the connection to the database used by the \
                application.",
        env = "CCD_INDEXER_DB_CONNECTION"
    )]
    db_connection:    tokio_postgres::config::Config,
    /// Maximum log level
    #[clap(
        long = "log-level",
        default_value = "info",
        help = "The maximum log level. Possible values are: `trace`, `debug`, `info`, `warn`, and \
                `debug`.",
        env = "CCD_INDEXER_LOG_LEVEL"
    )]
    log_level:        tracing_subscriber::filter::LevelFilter,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app: Args = Args::parse();

    {
        use tracing_subscriber::prelude::*;
        let log_filter = tracing_subscriber::filter::Targets::new()
            .with_target(module_path!(), app.log_level)
            .with_target("indexer", app.log_level);

        tracing_subscriber::registry()
            .with(tracing_subscriber::fmt::layer())
            .with(log_filter)
            .init();
    }

    // Establish connection to the node.
    let endpoint = if app
        .node_endpoint
        .uri()
        .scheme()
        .map_or(false, |x| x == &sdk::Scheme::HTTPS)
    {
        app.node_endpoint
            .tls_config(tonic::transport::channel::ClientTlsConfig::new())
            .context("Unable to construct TLS configuration for the Concordium API.")?
    } else {
        app.node_endpoint
    }
    .connect_timeout(std::time::Duration::from_secs(5))
    .timeout(std::time::Duration::from_secs(10));

    // Establish connection to the postgres database.
    let db_pool = DatabasePool::create(app.db_connection.clone(), 2, true)
        .await
        .context("Could not create database pool")?;
    let db = db_pool
        .get()
        .await
        .context("Could not get database connection from pool")?;
    db.init_settings(&app.contract_address)
        .await
        .context("Could not init settings for database")?;
    let settings = db
        .get_settings()
        .await
        .context("Could not get settings from database")?;

    anyhow::ensure!(
        settings.contract_address == app.contract_address,
        "Contract address does not match the contract address found in the database"
    );
    eprintln!("Settings: {:?}", settings);

    handle_indexing(db, db_pool, endpoint, app.start, app.contract_address).await
}

/// Figure out which block to use as start block given the start time.
/// The return block is the first block no earlier than the start time.
async fn get_first_block(
    client: &mut sdk::Client,
    start: chrono::DateTime<chrono::Utc>,
) -> anyhow::Result<BlockInfo> {
    let first_block = client
        .find_first_finalized_block_no_earlier_than(.., start)
        .await?;

    eprintln!(
        "Indexing from block {} at {}.",
        first_block.block_hash, first_block.block_slot_time,
    );
    Ok(first_block)
}

// enum TrackAndTraceContract {}

/// Handle indexing events.
async fn handle_indexing(
    mut db: Database,
    db_pool: DatabasePool,
    endpoint: sdk::Endpoint,
    start: chrono::DateTime<chrono::Utc>,
    contract_address: ContractAddress,
) -> anyhow::Result<()> {
    let mut client = sdk::Client::new(endpoint.clone())
        .await
        .context("Unable to connect.")?;
    let first_block = get_first_block(&mut client, start).await?;

    // TODO: FIX PROGRESS BAR
    let bar = ProgressBar::new(100000000 - first_block.block_height.height).with_style(
        ProgressStyle::with_template("{spinner} {msg} {wide_bar} {pos}/{len}")?,
    );

    let traverse_config = indexer::TraverseConfig::new_single(endpoint, first_block.block_height);
    let (sender, mut receiver) = tokio::sync::mpsc::channel(20);
    let cancel_handle = tokio::spawn(traverse_config.traverse(
        indexer::ContractUpdateIndexer {
            target_address: contract_address,
            entrypoint:     OwnedEntrypointName::new_unchecked(
                "changeItemStatusByAdmin".to_string(),
            ),
        },
        sender,
    ));

    while let Some((block, contract_update_infos)) = receiver.recv().await {
        bar.set_message(block.block_slot_time.to_string());
        bar.inc(1);

        for tx in contract_update_infos {
            for (contract_invoked, _entry_point_name, events) in tx.execution_tree.events() {
                anyhow::ensure!(
                    contract_invoked == contract_address,
                    "The contract entry point `changeItemStatus` can only be invoke by an account \
                     and the entry point does not invoke other contracts. 
                    As a result, the event picked up by the indexer should be from contract `{}` \
                     but following contract address was found while indexing `{}`.",
                    contract_address,
                    contract_invoked
                );

                // anyhow::ensure!(
                //     entry_point_name == "changeItemStatus",
                //     "The contract entry point `changeItemStatus` can only be invoke by an \
                //      account and the entry point does not invoke other contracts.
                //     As a result, the event picked up by the indexer should be from entrypoint
                // \      `changeItemStatus` but following entrypoint was found
                // while indexing \      `{}`.",
                //     entry_point_name
                // );

                anyhow::ensure!(
                    events.len() == 1,
                    "The contract entry point `changeItemStatus` can only be invoke by an \
                     account. As a result, only one event at max can be logged by the contract."
                );

                // We know exactly one event is logged.
                let event = events[0].clone();

                let parsed_event: contract::Event = event.parse()?;

                if let contract::Event::ItemStatusChanged(item_status_changed_event) = parsed_event
                {
                    // In case of DB errors, we will reconnect and retry to insert the event into
                    // the database.
                    let mut retry = true;
                    // How many successive insertion errors were encountered.
                    // This is used to slow down attempts to not spam the database.
                    let mut reconnecting_db_errors_count = 0;

                    while retry {
                        retry = match db_insert_item_status_changed_event(
                            &mut db,
                            tx.transaction_hash,
                            item_status_changed_event.clone(),
                            block.block_height,
                        )
                        .await
                        {
                            Ok(time) => {
                                reconnecting_db_errors_count = 0;
                                tracing::info!(
                                    "Processed item_status_changed_event at index {} in transaction {} in block {} \
                                     transactions in {}ms",
                                    // TODO: add event indexes
                                    1,
                                    tx.transaction_hash,
                                    block.block_hash,
                                    time.num_milliseconds()
                                );
                                false
                            }
                            Err(e) => {
                                reconnecting_db_errors_count += 1;
                                // wait for 500 * 2^(min(successive_errors - 1, 8))
                                // seconds before attempting.
                                // The reason for the min is that we bound the
                                // time between reconnects.
                                let delay = std::time::Duration::from_millis(
                                    500 * (1 << std::cmp::min(reconnecting_db_errors_count, 8)),
                                );
                                tracing::warn!(
                                    "Database connection lost due to {:#}. Will
                            attempt to reconnect in {}ms. Reconnecting database error count: {}",
                                    e,
                                    delay.as_millis(),
                                    reconnecting_db_errors_count
                                );
                                tokio::time::sleep(delay).await;

                                // Get new db connection from the pool
                                db = match db_pool.get().await.context(
                                    "Failed to get new database
                            connection from pool",
                                ) {
                                    Ok(db) => db,
                                    Err(e) => {
                                        receiver.close();
                                        return Err(e);
                                    }
                                };
                                true
                            }
                        };
                    }
                } else {
                    anyhow::bail!("Wrong event")
                }
            }
        }
    }

    // Indexer will not stop after finishing syncing but instead continue to
    // listening for new blocks.
    cancel_handle.abort();
    bar.finish_and_clear();

    Ok(())
}

/// Inserts data related to the `ItemStatusChangedEvent` into the database.
///  Everything is commited as a single transactions allowing
/// for easy restoration from the last recorded block (by height) inserted into
/// the database. Returns the duration it took to process the transaction.
#[tracing::instrument(skip(db))]
async fn db_insert_item_status_changed_event<'a>(
    db: &mut Database,
    tx_hash: TransactionHash,
    event: ItemStatusChangedEvent,
    block_height: AbsoluteBlockHeight,
) -> anyhow::Result<chrono::Duration> {
    let start = chrono::Utc::now();
    let transaction = db
        .client
        .transaction()
        .await
        .context("Failed to build DB transaction")?;

    let transaction = Transaction::from(transaction);
    transaction
        .set_latest_height(block_height, tx_hash, 1)
        .await?;

    transaction
        .insert_event(
            tx_hash,
            event.item_id,
            event.new_status,
            event.additional_data,
        )
        .await?;

    let now = tokio::time::Instant::now();
    transaction
        .inner
        .commit()
        .await
        .context("Failed to commit DB transaction.")?;

    tracing::debug!("Commit completed in {}ms.", now.elapsed().as_millis());

    let end = chrono::Utc::now().signed_duration_since(start);
    Ok(end)
}