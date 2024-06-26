import { ethers } from 'ethers';

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.JsonRpcProvider(); // Use JsonRpcProvider instead of Web3Provider
            const signer = provider.getSigner();
            console.log("The Connected Account is:", await signer.getAddress());
            return signer;
        } catch (error) {
            console.error("OOPS!! Error connecting to MetaMask:", error);
            throw error;
        }
    } else {
        console.log('Please install MetaMask!');
        alert('Please install MetaMask!');
    }
};
