'use client';

import { ethers, Signer, Provider } from 'ethers';
import contractAbi from '../../../contracts/Proposals.json';

// Export the ABI and address for flexibility
export const proposalsContractAbi = contractAbi.abi;
export const proposalsContractAddress = contractAbi.address;

/**
 * Returns a contract instance
 * @param providerOrSigner - The provider or signer to connect the contract to.
 * @returns A contract instance.
 */
export const getProposalsContract = (providerOrSigner: Provider | Signer) => {
    return new ethers.Contract(proposalsContractAddress, proposalsContractAbi, providerOrSigner);
};

// The original function can be kept for reference or legacy use if needed, 
// but the new approach is to use getProposalsContract with a provider/signer from the context.
async function initializeContract() {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // This is the line that always prompts the user
        const signer = await provider.getSigner();
        return new ethers.Contract(proposalsContractAddress, proposalsContractAbi, signer);
    } else {
        console.log('MetaMask not detected. Using local read-only provider.');
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        return new ethers.Contract(proposalsContractAddress, proposalsContractAbi, provider);
    }
}

export { initializeContract };