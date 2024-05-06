// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { contractABI, contractAddress } from '../../../utils/constants';
import { ethers } from "ethers";

const Wallet_meta = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect to Wallet');

    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setDefaultAccount(accounts[0]);
                setConnButtonText('Wallet Connected');
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('install MetaMask browser extension for interaction');
        }
    };

    return (
        
<div className='flex items-center justify-center min-h-screen bg-gradient-to-white from-white via-white to-white'>

           <div className='rounded-tl-3xl rounded-br-3xl shadow-xl p-8 max-w-lg w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'>

            <h4 className="text-5xl font-bold text-blue-200 text-center mb-8 hover:text-yellow-400" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>Create your own fashion story!</h4>


                <div className="grid grid-cols-3 gap-4">
                    <button onClick={connectWalletHandler}
                            className={`font-bold py-2 px-4 rounded ${defaultAccount ? 'bg-purple-500 hover:bg-purple-400' : 'bg-purple-500 hover:bg-purple-400'} text-white shadow-lg focus:shadow-outline focus:outline-none transition duration-150 ease-in-out`}>
                        Connect To wallet
                    </button>
                        <Link href="/list_stuff" passHref className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150 ease-in-out text-center flex items-center justify-center">
                            List your items here
                        </Link>
                        <Link href="/item_buy" passHref className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150 ease-in-out text-center">
                        We've got some funky finds for you!!
                        </Link>
                </div>
                {defaultAccount && <p className="text-green-600 mt-4 text-center">Connected to {defaultAccount}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default Wallet_meta;

