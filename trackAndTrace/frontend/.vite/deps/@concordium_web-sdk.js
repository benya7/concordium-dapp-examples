import {
    AccountAddress_exports,
    AccountInfoType,
    AccountStatementBuild,
    AccountTransactionType,
    AtomicStatementBuilder,
    AttributeKeyString,
    AttributesKeys,
    AuthorizationKeysUpdateType,
    BakerPoolPendingChangeType,
    BlockHash_exports,
    BlockItemKind,
    CIS0,
    CIS2Contract,
    CIS4,
    CIS4Contract,
    CcdAmount_exports,
    ConcordiumGRPCClient,
    ConcordiumGRPCWebClient,
    ConcordiumHdWallet,
    ConfigureBakerHandler,
    ConfigureDelegationHandler,
    Contract,
    ContractAddress_exports,
    ContractDryRun,
    ContractEvent_exports,
    ContractName_exports,
    ContractVersion,
    CredentialRegistrationId_exports,
    DataBlob,
    DelegationTargetType,
    DeployModuleHandler,
    Duration_exports,
    EU_MEMBERS,
    Energy_exports,
    EntrypointName_exports,
    HigherLevelKeyUpdateType,
    IDENTITY_SUBJECT_SCHEMA,
    IdDocType,
    IdStatementBuilder,
    InitContractHandler,
    InitName_exports,
    KeyUpdateEntryStatus,
    MAX_DATE,
    MAX_DATE_ISO,
    MAX_DATE_TIMESTAMP,
    MAX_STRING_BYTE_LENGTH,
    MAX_U64,
    MIN_DATE,
    MIN_DATE_ISO,
    MIN_DATE_TIMESTAMP,
    ModuleClient_exports,
    ModuleReference_exports,
    NodeCatchupStatus,
    OpenStatus,
    OpenStatusText,
    Parameter_exports,
    PassiveCommitteeInfo,
    PoolStatusType,
    ReceiveName_exports,
    RegisterDataHandler,
    RejectReasonTag,
    ReturnValue_exports,
    RpcError,
    SchemaVersion,
    SequenceNumber_exports,
    Sex,
    SimpleTransferHandler,
    SimpleTransferWithMemoHandler,
    StakePendingChangeType,
    StatementTypes,
    Timestamp_exports,
    TransactionEventTag,
    TransactionExpiry_exports,
    TransactionHash_exports,
    TransactionKindString,
    TransactionStatusEnum,
    TransactionSummaryType,
    TypedJsonParseError,
    TypedJsonParseErrorCode,
    UpdateContractHandler,
    UpdateCredentialsHandler,
    UpdateType,
    VerifiablePresentation,
    Web3IdSigner,
    Web3StatementBuilder,
    affectedAccounts,
    affectedContracts,
    attributesWithRange,
    attributesWithSet,
    buildAccountSigner,
    buildBasicAccountSigner,
    buildSignedCredentialForExistingAccount,
    calculateEnergyCost,
    calculateModuleReference,
    canProveAtomicStatement,
    canProveCredentialStatement,
    cis0Supports,
    compareStringAttributes,
    constantA,
    constantB,
    convertEnergyToMicroCcd,
    createAccountCommitmentInput,
    createAccountCommitmentInputWithHdWallet,
    createAccountDID,
    createCredentialDeploymentTransaction,
    createCredentialTransaction,
    createCredentialTransactionNoSeed,
    createIdentityRecoveryRequest,
    createIdentityRecoveryRequestWithKeys,
    createIdentityRequest,
    createIdentityRequestWithKeys,
    createUnsignedCredentialForExistingAccount,
    createWeb3CommitmentInput,
    createWeb3CommitmentInputWithHdWallet,
    createWeb3IdDID,
    dateToTimestampAttribute,
    deserializeAccountTransaction,
    deserializeContractState,
    deserializeInitError,
    deserializeReceiveError,
    deserializeReceiveReturnValue,
    deserializeSchemaType,
    deserializeTransaction,
    deserializeTypeValue,
    deserializeUnversionedSchemaModule,
    deserializeVersionedSchemaModule,
    displayTypeSchemaTemplate,
    encodeHexString,
    generateBakerKeys,
    getAccountAddress,
    getAccountIdentifierInput,
    getAccountTransactionHandler,
    getAccountTransactionHash,
    getAccountTransactionSignDigest,
    getBlockHashInput,
    getCredentialDeploymentSignDigest,
    getCredentialDeploymentTransactionHash,
    getCredentialForExistingAccountSignDigest,
    getEmbeddedModuleSchema,
    getEnergyCost,
    getExchangeRate,
    getIdProof,
    getInitContractParameterSchema,
    getPastDate,
    getReceiverAccount,
    getSignature,
    getSummaryContractUpdateLogs,
    getTransactionKindString,
    getTransactionRejectReason,
    getUpdateContractParameterSchema,
    getVerifiablePresentation,
    isAccountCredentialStatement,
    isAccountTransactionType,
    isAuthorizationsV1,
    isBakerAccount,
    isBlockInfoV0,
    isBlockInfoV1,
    isChainParametersV0,
    isChainParametersV1,
    isChainParametersV2,
    isConsensusStatusV0,
    isConsensusStatusV1,
    isDelegatorAccount,
    isElectionInfoV0,
    isElectionInfoV1,
    isHex,
    isInitContractSummary,
    isInstanceInfoV0,
    isInstanceInfoV1,
    isReduceStakePendingChange,
    isRejectTransaction,
    isRemovalPendingChange,
    isRewardStatusV1,
    isRpcError,
    isStringAttributeInRange,
    isSuccessTransaction,
    isTimestampAttribute,
    isTransferLikeSummary,
    isUpdateContractSummary,
    isVerifiableCredentialRequestStatement,
    isVerifiableCredentialStatement,
    jsonParse,
    jsonStringify,
    jsonUnwrapStringify,
    parseModuleInterface,
    parseRawModuleSchema,
    parseWallet,
    replaceDateWithTimeStampAttribute,
    reviveDateFromTimeStampAttribute,
    serializeAccountTransaction,
    serializeAccountTransactionForSubmission,
    serializeAccountTransactionPayload,
    serializeCredentialDeploymentPayload,
    serializeCredentialDeploymentTransactionForSubmission,
    serializeInitContractParameters,
    serializeSchemaType,
    serializeTypeValue,
    serializeUpdateContractParameters,
    sha256,
    signCredentialTransaction,
    signMessage,
    signTransaction,
    specialEventAffectedAccounts,
    statementAttributeTypeToAttributeType,
    streamToList,
    timestampToDate,
    toBuffer,
    toOptionJson,
    tokenAddressFromBase58,
    tokenAddressToBase58,
    uleb128Decode,
    uleb128DecodeWithIndex,
    uleb128Encode,
    unwrap,
    verifyAtomicStatements,
    verifyIdstatement,
    verifyMessageSignature,
    verifyWeb3IdCredentialSignature,
    versionedModuleSourceFromBuffer,
    versionedModuleSourceToBuffer,
    wasmToSchema,
} from './chunk-UJRN4I3W.js';
import './chunk-C3Y62267.js';
import './chunk-GNSLCM6O.js';
import './chunk-ANIWD3T6.js';
export {
    AccountAddress_exports as AccountAddress,
    AccountInfoType,
    AccountStatementBuild,
    AccountTransactionType,
    AtomicStatementBuilder,
    AttributeKeyString,
    AttributesKeys,
    AuthorizationKeysUpdateType,
    BakerPoolPendingChangeType,
    BlockHash_exports as BlockHash,
    BlockItemKind,
    CIS0,
    CIS2Contract,
    CIS4,
    CIS4Contract,
    CcdAmount_exports as CcdAmount,
    ConcordiumGRPCClient,
    ConcordiumGRPCWebClient,
    ConcordiumHdWallet,
    ConfigureBakerHandler,
    ConfigureDelegationHandler,
    Contract,
    ContractAddress_exports as ContractAddress,
    ContractDryRun,
    ContractEvent_exports as ContractEvent,
    ContractName_exports as ContractName,
    ContractVersion,
    CredentialRegistrationId_exports as CredentialRegistrationId,
    DataBlob,
    DelegationTargetType,
    DeployModuleHandler,
    Duration_exports as Duration,
    EU_MEMBERS,
    Energy_exports as Energy,
    EntrypointName_exports as EntrypointName,
    HigherLevelKeyUpdateType,
    IDENTITY_SUBJECT_SCHEMA,
    IdDocType,
    IdStatementBuilder,
    InitContractHandler,
    InitName_exports as InitName,
    KeyUpdateEntryStatus,
    MAX_DATE,
    MAX_DATE_ISO,
    MAX_DATE_TIMESTAMP,
    MAX_STRING_BYTE_LENGTH,
    MAX_U64,
    MIN_DATE,
    MIN_DATE_ISO,
    MIN_DATE_TIMESTAMP,
    ModuleClient_exports as ModuleClient,
    ModuleReference_exports as ModuleReference,
    NodeCatchupStatus,
    OpenStatus,
    OpenStatusText,
    Parameter_exports as Parameter,
    PassiveCommitteeInfo,
    PoolStatusType,
    ReceiveName_exports as ReceiveName,
    RegisterDataHandler,
    RejectReasonTag,
    ReturnValue_exports as ReturnValue,
    RpcError,
    SchemaVersion,
    SequenceNumber_exports as SequenceNumber,
    Sex,
    SimpleTransferHandler,
    SimpleTransferWithMemoHandler,
    StakePendingChangeType,
    StatementTypes,
    Timestamp_exports as Timestamp,
    TransactionEventTag,
    TransactionExpiry_exports as TransactionExpiry,
    TransactionHash_exports as TransactionHash,
    TransactionKindString,
    TransactionStatusEnum,
    TransactionSummaryType,
    TypedJsonParseError,
    TypedJsonParseErrorCode,
    UpdateContractHandler,
    UpdateCredentialsHandler,
    UpdateType,
    VerifiablePresentation,
    Web3IdSigner,
    Web3StatementBuilder,
    affectedAccounts,
    affectedContracts,
    attributesWithRange,
    attributesWithSet,
    buildAccountSigner,
    buildBasicAccountSigner,
    buildSignedCredentialForExistingAccount,
    calculateEnergyCost,
    calculateModuleReference,
    canProveAtomicStatement,
    canProveCredentialStatement,
    cis0Supports,
    compareStringAttributes,
    constantA,
    constantB,
    convertEnergyToMicroCcd,
    createAccountCommitmentInput,
    createAccountCommitmentInputWithHdWallet,
    createAccountDID,
    createCredentialDeploymentTransaction,
    createCredentialTransaction,
    createCredentialTransactionNoSeed,
    createIdentityRecoveryRequest,
    createIdentityRecoveryRequestWithKeys,
    createIdentityRequest,
    createIdentityRequestWithKeys,
    createUnsignedCredentialForExistingAccount,
    createWeb3CommitmentInput,
    createWeb3CommitmentInputWithHdWallet,
    createWeb3IdDID,
    dateToTimestampAttribute,
    deserializeAccountTransaction,
    deserializeContractState,
    deserializeInitError,
    deserializeReceiveError,
    deserializeReceiveReturnValue,
    deserializeSchemaType,
    deserializeTransaction,
    deserializeTypeValue,
    deserializeUnversionedSchemaModule,
    deserializeVersionedSchemaModule,
    displayTypeSchemaTemplate,
    encodeHexString,
    generateBakerKeys,
    getAccountAddress,
    getAccountIdentifierInput,
    getAccountTransactionHandler,
    getAccountTransactionHash,
    getAccountTransactionSignDigest,
    getBlockHashInput,
    getCredentialDeploymentSignDigest,
    getCredentialDeploymentTransactionHash,
    getCredentialForExistingAccountSignDigest,
    getEmbeddedModuleSchema,
    getEnergyCost,
    getExchangeRate,
    getIdProof,
    getInitContractParameterSchema,
    getPastDate,
    getReceiverAccount,
    getSignature,
    getSummaryContractUpdateLogs,
    getTransactionKindString,
    getTransactionRejectReason,
    getUpdateContractParameterSchema,
    getVerifiablePresentation,
    isAccountCredentialStatement,
    isAccountTransactionType,
    isAuthorizationsV1,
    isBakerAccount,
    isBlockInfoV0,
    isBlockInfoV1,
    isChainParametersV0,
    isChainParametersV1,
    isChainParametersV2,
    isConsensusStatusV0,
    isConsensusStatusV1,
    isDelegatorAccount,
    isElectionInfoV0,
    isElectionInfoV1,
    isHex,
    isInitContractSummary,
    isInstanceInfoV0,
    isInstanceInfoV1,
    isReduceStakePendingChange,
    isRejectTransaction,
    isRemovalPendingChange,
    isRewardStatusV1,
    isRpcError,
    isStringAttributeInRange,
    isSuccessTransaction,
    isTimestampAttribute,
    isTransferLikeSummary,
    isUpdateContractSummary,
    isVerifiableCredentialRequestStatement,
    isVerifiableCredentialStatement,
    jsonParse,
    jsonStringify,
    jsonUnwrapStringify,
    parseModuleInterface,
    parseRawModuleSchema,
    parseWallet,
    replaceDateWithTimeStampAttribute,
    reviveDateFromTimeStampAttribute,
    serializeAccountTransaction,
    serializeAccountTransactionForSubmission,
    serializeAccountTransactionPayload,
    serializeCredentialDeploymentPayload,
    serializeCredentialDeploymentTransactionForSubmission,
    serializeInitContractParameters,
    serializeSchemaType,
    serializeTypeValue,
    serializeUpdateContractParameters,
    sha256,
    signCredentialTransaction,
    signMessage,
    signTransaction,
    specialEventAffectedAccounts,
    statementAttributeTypeToAttributeType,
    streamToList,
    timestampToDate,
    toBuffer,
    toOptionJson,
    tokenAddressFromBase58,
    tokenAddressToBase58,
    uleb128Decode,
    uleb128DecodeWithIndex,
    uleb128Encode,
    unwrap,
    verifyAtomicStatements,
    verifyIdstatement,
    verifyMessageSignature,
    verifyWeb3IdCredentialSignature,
    versionedModuleSourceFromBuffer,
    versionedModuleSourceToBuffer,
    wasmToSchema,
};
//# sourceMappingURL=@concordium_web-sdk.js.map
