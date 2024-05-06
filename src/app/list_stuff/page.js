"use client"
import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../../../utils/constants';
import axios from 'axios';

const Listing_pro = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); 
    const [transaction, setTransaction]=useState('');

    const onImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImageToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'pinata_api_key': 'bc3d0472f0fafff5568b',
                  'pinata_secret_api_key': '95c661f622e2f0cc3b7b5e55c21b73c06c7328bcf8b467da8abec64a1a510336',
                },
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading, please check: ', error);
            setErrorMessage('Error uploading, please check:');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('MetaMask not found.');
            return;
        }

        setIsLoading(true);
        const ipfsHash = await uploadImageToPinata(image);
        if (!ipfsHash) {
            setIsLoading(false);
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
            const transaction = await marketplaceContract.listItem(title, description, ipfsHash, ethers.utils.parseUnits(price, 'ether'));
            await transaction.wait();
            const receipt =await transaction.wait();
            setTransaction(receipt.transactionHash);
            setSuccessMessage('fashion item added');
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
            setTimeout(() => { setSuccessMessage(''); }, 3000);
        } catch (error) {
            console.error('Error processing transaction: ', error);
            setErrorMessage('Transaction not successful: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-white from-white via-white to-white pl-20'>
<div className='bg-gradient-to-r from-purple-600 to-pink-400 rounded-lg shadow-xl p-10 max-w-lg w-full'>

                {successMessage && (
                    <div className="success bg-green-500 text-white p-4 mb-4 text-center font-bold rounded">
                        {successMessage}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Display your fasion piece here!</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="image-upload" className="block text-gray-800 font-bold mb-2">Upload you piece here </label>
                        <input type="file" ref={fileInputRef} onChange={onImageChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-title">Name</label>
                        <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Title" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-description">Craft your Style Description</label>
                        <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Description" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-price">Price(ETH)</label>
                        <input type="text" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Price in ETH" required />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit"
                                disabled={isLoading}
                                className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${isLoading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-400 text-white'}`}>
                            {isLoading ? 'Submitting' : 'List Item'}
                        </button>
                        { <p className="text-indigo-500 text-center mt-4">{transaction}</p>}
                    </div>
                    {errorMessage && <p className="error text-indigo-500 text-center mt-4">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Listing_pro;
