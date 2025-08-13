'use client';

import { ethers } from 'ethers';
import contractAbi from '../../../contracts/Proposals.json';

const { abi, address: contractAddress } = contractAbi;

let contract: ethers.Contract | null = null;

async function initializeContract() {
    if (contract) return contract;

    let provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
    let signer: ethers.Signer | undefined;

    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        console.log('MetaMask not detected. Using local read-only provider.');
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        contract = new ethers.Contract(contractAddress, abi, provider);
    }
    return contract;
}

export { initializeContract };
