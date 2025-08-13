'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { initializeContract } from '../proposals/contract';

interface WalletContextType {
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  loading: boolean;
  error: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const contractInstance = await initializeContract();
      setContract(contractInstance);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to wallet.');
      // Re-throw the error if you want calling components to be able to catch it
      throw err;
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider value={{ contract, connectWallet, loading, error }}>
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
