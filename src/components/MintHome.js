import React, { useEffect, useState } from 'react';
import './MintHome.css';
import Giraffe from '../artifacts/contracts/GiraffesAtTheBar.sol/GiraffesAtTheBar.json';
import { ethers } from 'ethers';
import pattern from '../images/pattern.png';
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

    const giraffeAddress = "0x04fDD29676A4bD63738EBaB7c13d893a86dD9b34";

    useEffect( () => { 
        signIn()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function signIn() { 
        if (typeof window.ethereum !== 'undefined') {
            window.ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await window.ethersProvider.getNetwork();
            //CHANGE TO 1 ON SENDING LIVE 
            if (network.chainId === 4){
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
                        alert("Sign in to Mint a Giraffe!");
                    } else { 
                        console.error(error)
                    }
                })
            } else { 
                setSignedIn(false)
                alert("Switch network to Ethereum Network before continuing.")
            }
        } else {
            alert("No Ethereum interface injected into browser. Read-only access.");
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

                try {
                    const txHash = await giraffeWithSigner.mint(howManyGiraffes, overrides);
                    setMintingSuccess(txHash);
                } catch (error) {
                    setMintingError(error);
                }

            } else {
                alert("Sale is not active yet.  Try again later!");
            }
        
        } else {
            alert("Wallet not connected! Connect to mint a Giraffe.");
        }
    }

    const setMintingSuccess = (txHash) => {
        //THROW MODAL WITH LINK
        console.log(txHash);
    }

    const setMintingError = (error) => {
        // Throw modal with error
        console.log(error);
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

    const paraText = signedIn ? "Input number of Giraffes to mint: " : "Sign in above to mint Giraffes!"

    return (
        <div id="#home">
            <div className="minthomeBg" />
            <div className="minthome__container">
                <div className="minthome__info">
                    <div className="minthome__signIn">
                        {!signedIn ? <button onClick={signIn}>Connect Wallet</button>
                            : <button onClick={signOut}>Wallet Connected<br />Click to sign out</button>
                        }
                    </div>
                    
                    <p>{paraText}</p>

                    <input 
                        type="number" 
                        min="1"
                        max={presaleMintMax}
                        value={howManyGiraffes}
                        onChange={ e => checkHowMany(e.target.value) }
                        name="" 
                    />
                    <br/>

                    <div className="minthome__mint">
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
            ></Modal>
        </div>
    );
}