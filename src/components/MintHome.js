
import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector }    from "@web3-react/walletlink-connector";

import './MintHome.css';
import Giraffe from '../artifacts/contracts/GiraffesAtTheBar.sol/GiraffesAtTheBar.json';
import { ethers } from 'ethers';
import Modal from './Modal.js';

import EthereumSession from '../lib/eth-session.js';


//mainnet
//const giraffeAddress = "0xccb754b5d99f41397b13bec72e0015d7bb2ab63e";

//rinkeby
const giraffeAddress = "0x3f2a3678F8b818dA8888F1dF0c4FE7d5C3AA5dc5";

const mainnetConfig = {
    'CONTRACT': '0xccb754b5d99f41397b13bec72e0015d7bb2ab63e',
    'CHAIN_ID':  1,
    'RPC_URL':   'https://mainnet.infura.io/v3/e08f25d6cba1481a8ea2cd2eb30fd267',
    'ABI':       Giraffe.abi
}

const rinkebyConfig = {
    'CONTRACT': '0x3f2a3678F8b818dA8888F1dF0c4FE7d5C3AA5dc5',
    'CHAIN_ID':  4,
    'RPC_URL':   'https://rinkeby.infura.io/v3/e08f25d6cba1481a8ea2cd2eb30fd267',
    'ABI':       Giraffe.abi
}

const config = rinkebyConfig;

const CONNECTORS = {};
CONNECTORS.Walletlink = new WalletLinkConnector({
    url: config.RPC_URL,
    appLogoUrl: null,
    appName: "Giraffes At The Bar",
});

CONNECTORS.WalletConnect = new WalletConnectConnector({
    supportedChainIds: [config.CHAIN_ID],
    rpc: config.RPC_URL,
});

export default function MintHome () {
    const context = useWeb3React();

    const [signedIn, setSignedIn] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [giraffeContract, setGiraffeContract] = useState(null);
    const [giraffeWithSigner, setGiraffeWithSigner] = useState(null);
    const [paused, togglePause] = useState(true);
    const [totalMinted, setTotalMinted] = useState(0);
    const [giraffePrice, setGiraffePrice] = useState(0);
    const [howManyGiraffes, setHowManyGiraffes] = useState(20)

    const saleMintMax = 20;
    
    const [modalShown, toggleModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect( () => { 
        //signIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ethereumSession = useMemo(() => {
        if( window.ethereum ){
            const session = new EthereumSession({
                chain:           EthereumSession.COMMON_CHAINS[ config.CHAIN_ID ],
                contractAddress: config.CONTRACT,
                contractABI:     config.ABI
            });
            //session.connectEthers();
            return session;
        }
        else{
            return null;
        }
    },[]);

    async function connectProvider( connector ){
        context.activate( connector, async (err) => {
          //other connectors
          if( err.code === 4001 ){
            //WalletLink: User denied account authorization
            console.debug( err.message );
            return;
          }
          else if( err.name === 'UserRejectedRequestError' ){
            //WalletConnect: The user rejected the request
            console.debug( err.message );
            return;
          }
          else{
            console.warn( err.message );
          }
        });
    }
    

    async function signIn() { 
        if (typeof window.ethereum !== 'undefined') {
            window.ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            //const network = await window.ethersProvider.getNetwork();
            //if (network.chainId === config.CHAIN_ID){

            const isConnected = await ethereumSession.connectChain( true )
            .then(async function (isConnected) { 
                if( isConnected ){
                    //if( await ethereumSession.connectAccounts( true ) ){
                    //    ethereumSession.wallet.accounts;
                    //}
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
                    const chain = EthereumSession.getChain( config.CHAIN_ID )
                    setErrorMessage( `Switch network to the ${chain.name} before continuing.`)
                    toggleModal(true);
                }
            })
            .catch(function (error) { 
                setErrorMessage( error )
                toggleModal(true);
            })
        } else {
            setErrorMessage(<div style={{margin: 0, padding: 0}}>
                <p>No Ethereum interface injected into browser.<br />Other providers:</p>
                <ul>
                    <li style={{ cursor: 'pointer' }} onClick={() => connectProvider( CONNECTORS.Walletlink )}>Coinbase Wallet</li>
                    <li style={{ cursor: 'pointer' }} onClick={() => connectProvider( CONNECTORS.WalletConnect )}>WalletConnect</li>
                </ul>
            </div>)
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
        if (newNumber > 20) {
            setHowManyGiraffes(20)
        } else if (newNumber < 1) { 
            setHowManyGiraffes("")
        } else { 
            setHowManyGiraffes(newNumber) 
        }
    }

    const paraText = signedIn ? "Input number of Giraffes to mint (max 20): " : "Sign in above to mint Giraffes!"

    return (
        <div id="#home">
            <div className="minthomeBg" />
            <div className="minthome__container">
                <div className="minthome__info">
                    <div className="minthome__signIn"> 
                        {!signedIn ? <button onClick={signIn}>Connect Wallet</button>
                            : <button onClick={signOut}>Wallet Connected<br /> Click to sign out</button>
                        }
                    </div>
                    
                    <p>{paraText}</p>
                    
                    <div className={signedIn ? "minthome__signIn-input" : "minthome__signIn-input-false"}>
                        <input 
                            type="number" 
                            min="1"
                            max={saleMintMax}
                            value={howManyGiraffes}
                            onChange={ e => checkHowMany(e.target.value) }
                            name="" 
                        />
                    </div>
                    
                    <br/>
                    
                    <div className={signedIn ? "minthome__mint" : "minthome__mint-false"}>
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