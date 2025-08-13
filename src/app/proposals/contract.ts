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
