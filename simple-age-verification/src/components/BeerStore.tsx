import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import { Dialog, DialogTitle, DialogActions, Typography, Alert, Button } from "@mui/material";
import { useEffect, useState } from "react";
import beers from './../image/beers.png';
import {
    IdStatementBuilder
} from '@concordium/web-sdk';

export default function BeerStore() {

    const [isVerified, setVerified] = useState(false);
    const [isFailed, setFailed] = useState(false);

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isVerified) {
            document.body.style.backgroundColor = "white";
        } else {
            document.body.style.backgroundColor = "#016a3a";
        }
    }, [isVerified]);

    async function ageCheck()   {
        const provider = await detectConcordiumProvider();
        try {
            const account = await provider.connect() as string;

            const statementBuilder = new IdStatementBuilder().addMinimumAge(18);
            const statement = statementBuilder.getStatement();
            // In a production scenario the challenge should not be hardcoded, in order to avoid accepting proofs created for other contexts.
            const challenge = "BBBBBBBB"

            // Requesting ID proof to check if user is 18 years old
            provider.requestIdProof(account, statement, challenge)
                    .then(() => {
                        // User is 18 year old, show something
                        setVerified(true)
                        setFailed(false)
                    })
                    .catch(() => {
                        setFailed(true)
                        setOpen(true)
                        // User is not 18 years old
                        // alert("Age verification was not completed. Please complete the verification")
                    })
        } catch (error) {
            console.error(error) // from creation or business logic
            alert("Please connect");
        }
    }
    return (
        <div className="App">
            <h1 className={isVerified ? "header white" : "header"}>Welcome to beer store</h1>
            <div className="main">
                { !isVerified &&
                  <div className="verify-page">
                      <h4 className="verify-title">
                          Click to verify your age
                      </h4>
                      <Typography variant="h4" component="div" sx={{ flexGrow: 1, mt: 1 }}>
                      </Typography>
                      <button color="inherit" onClick={ageCheck} className="button green-text">
                          VERIFY
                      </button>
                      <a
                          className="read-more green-text"
                          href="https://www.concordium.com"
                      >
                          Read more
                      </a>
                  </div>
                }
                {
                    isVerified &&
                    <div className="beer-page white">
                        <img src={beers} alt="beers" />
                        <a
                            className="read-more"
                            href="https://www.concordium.com"
                        >
                            Read more!
                        </a>
                    </div>
                }
                {
                    isFailed &&
                    <Dialog open={open}
                            onClose={handleClose}>
                        <DialogTitle>Age Verification Failed</DialogTitle>
                        <Alert severity="warning" sx={{ ml: "50" }}>
                            Age verification is not complete. You are not allowed to access beer store!
                        </Alert>
                        <DialogActions>
                            <Button onClick={handleClose}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </div>
        </div >
    );
}