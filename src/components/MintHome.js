import React, { useEffect, useState } from 'react';
import './MintHome.css';
import Giraffe from '../artifacts/contracts/GiraffesAtTheBar.sol/GiraffesAtTheBar.json';
import { ethers } from 'ethers';
import Modal from './Modal.js';

export default function MintHome () { 
    const [signedIn, setSignedIn] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [giraffeContract, setGiraffeContract] = useState(null);
    const [giraffeWithSigner, setGiraffeWithSigner] = useState(null);
    const [paused, togglePause] = useState(true);
    const [totalMinted, setTotalMinted] = useState(0);
    const [giraffePrice, setGiraffePrice] = useState(0);
    const [howManyGiraffes, setHowManyGiraffes] = useState(10)

    const presaleMintMax = 10;
    const saleMintMax = 20;
    
    const [modalShown, toggleModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const giraffeAddress = "0xccb754b5d99f41397b13bec72e0015d7bb2ab63e";

    useEffect( () => { 
        //signIn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function signIn() { 
        if (typeof window.ethereum !== 'undefined') {
            window.ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await window.ethersProvider.getNetwork();
            if (network.chainId === 1){
                await window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(async function (accounts) {
                    if (accounts.length > 0) {
                        let wallet = accounts[0]
                        setWalletAddress(wallet)
                        setSignedIn(true)
                        loadContractData()
                    } else {
                        setSignedIn(false)
                    }
                })
                .catch(function (error) {
                    if (error.code === 4001) {
                        setErrorMessage("Sign in to mint Giraffes!")
                        toggleModal(true);
                    } else { 
                        setErrorMessage(error)
                        toggleModal(true);
                    }
                })
            } else { 
                setErrorMessage("Switch network to the Ethereum Mainnet before continuing.")
                toggleModal(true);
            }
        } else {
            setErrorMessage("No Ethereum interface injected into browser. Read-only access.")
            toggleModal(true);
        }
    }

    async function signOut() {
        setSignedIn(false)
    }

    async function loadContractData () { 
        const giraffeContract = new ethers.Contract(giraffeAddress, Giraffe.abi, window.ethersProvider);
        setGiraffeContract(giraffeContract);

        const signer = window.ethersProvider.getSigner()
        const giraffeWithSigner = giraffeContract.connect(signer)
        setGiraffeWithSigner(giraffeWithSigner);

        const salebool = await giraffeContract.paused();
        togglePause(salebool);

        const totalMinted = String(await giraffeContract.totalSupply());
        setTotalMinted(totalMinted);

        const giraffePrice = await giraffeContract.price();
        setGiraffePrice(giraffePrice);
    }

    async function mintGiraffe () { 
        if (signedIn) {
            if (!paused && giraffeWithSigner) {
                const price = String(giraffePrice  * howManyGiraffes)
                
                let overrides = {
                    from: walletAddress, 
                    value: price,
                }
                
                await giraffeWithSigner.mint(howManyGiraffes, overrides)
                .then(() => {
                    setMintingSuccess(howManyGiraffes)
                })
                .catch ((error) => {
                    if (error.error) {
                        if (error.error.message === "execution reverted: Wallet is not whitelisted") {
                            console.log("here")
                            setMintingError("Wallet is not approved for presale.  Change wallets or come back during the sale to mint a Giraffe!")
                        } else { 
                            setMintingError(error.error.message)
                        }
                    } 
                })

            } else {
                setErrorMessage("Sale is not active yet.  Try again later!")
                toggleModal(true);
            }
        } 
    }

    const setMintingSuccess = (howManyGiraffes) => {
        setErrorMessage("Congrats on minting " + howManyGiraffes + " Giraffes!!");
        toggleModal(true);
    }

    const setMintingError = (error) => {
        setErrorMessage(error);
        toggleModal(true);
    }

    function checkHowMany (newNumber) { 
        if (newNumber > 10) {
            setHowManyGiraffes(10)
        } else if (newNumber < 1) { 
            setHowManyGiraffes("")
        } else { 
            setHowManyGiraffes(newNumber) 
        }
    }

    //const paraText = signedIn ? "Input number of Giraffes to mint (max 10): " : "Sign in above to mint Giraffes!"
    const paraText = "GIRAFFES PRESALE CLOSED!"

    return (
        <div id="#home">
            <div className="minthomeBg" />
            <div className="minthome__container">
                <div className="minthome__info">
                    <div className="minthome__signIn-false">
                        {!signedIn ? <button>Connect Wallet</button>
                            : <button onClick={signOut}>Wallet Connected<br />Click to sign out</button>
                        }
                    </div>
                    
                    <p>{paraText}</p>
                    
                    <div className="minthome__signIn-input-false">
                        <input 
                            type="number" 
                            min="1"
                            max={presaleMintMax}
                            value={howManyGiraffes}
                            onChange={ e => checkHowMany(e.target.value) }
                            name="" 
                        />
                    </div>
                    
                    <br/>
                    
                    <div className="minthome__mint-false">
                        {howManyGiraffes > 0 ? <button onClick={() => mintGiraffe()}>MINT {howManyGiraffes} GIRAFFES!</button>
                            : <button onClick={() => alert("Must mint atleast 1 Giraffe")}>MINT {howManyGiraffes} GIRAFFES!</button>
                        }
                    </div>
                </div>
            </div>

            <Modal
                shown={modalShown}
                close={() => {
                toggleModal(false);
                }}
                message={errorMessage}
            ></Modal>
        </div>
    );
}