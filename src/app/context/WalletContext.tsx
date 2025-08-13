'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getProposalsContract } from '../proposals/contract';

const SEPOLIA_CHAIN_ID = '11155111';
const LOCAL_CHAIN_ID = '31337'; // Default for Anvil/Hardhat
const SEPOLIA_HEX_CHAIN_ID = '0xaa36a7';

interface WalletContextType {
  contract: ethers.Contract | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  loading: boolean;
  error: string;
  isSepolia: boolean;
  networkName: string | null;
  switchToSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSepolia, setIsSepolia] = useState(false);
  const [networkName, setNetworkName] = useState<string | null>(null);

  const handleChainChanged = () => {
    window.location.reload();
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed.');
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_HEX_CHAIN_ID }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        setError('Sepolia network is not added to your MetaMask. Please add it manually.');
      } else {
        setError('Failed to switch network.');
      }
    }
  };

  const setupState = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const network = await provider.getNetwork();

        setAddress(userAddress);
        setNetworkName(network.name);
        
        const chainId = network.chainId.toString();
        setIsSepolia(chainId === SEPOLIA_CHAIN_ID);

        if (chainId === SEPOLIA_CHAIN_ID || chainId === LOCAL_CHAIN_ID) {
            const contractInstance = getProposalsContract(signer);
            setContract(contractInstance);
            setError('');
        } else {
            setContract(null);
            setError(`Unsupported network. Please switch to Sepolia.`);
        }
    } catch (err) {
        setError("An error occurred while setting up the wallet state.");
        console.error(err);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    if (!window.ethereum) {
      setError('MetaMask is not installed.');
      setLoading(false);
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      await setupState(provider);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet.');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingConnection = useCallback(async () => {
    if (!window.ethereum) {
        setLoading(false);
        return;
    }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            await setupState(provider);
        }
    } catch (err) {
        console.error("Could not check for existing connection", err);
    }
    setLoading(false);
  }, [setupState]);

  useEffect(() => {
    checkExistingConnection();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleChainChanged); // Reload on account change is simple and effective
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleChainChanged);
      }
    };
  }, [checkExistingConnection]);

  return (
    <WalletContext.Provider value={{ contract, address, connectWallet, loading, error, isSepolia, networkName, switchToSepolia }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
