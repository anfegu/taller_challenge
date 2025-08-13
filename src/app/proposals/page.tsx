'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/app/context/WalletContext';

interface Proposal {
  title: string;
  description: string;
  voteCount: number;
}

const WalletInfo = () => {
    const { 
        address, 
        connectWallet, 
        loading, 
        error, 
        isSepolia, 
        networkName, 
        switchToSepolia,
        contract 
    } = useWallet();

    // Main container with dark background
    const containerClasses = "p-4 bg-gray-900/50 rounded-lg shadow-lg mb-6 border border-gray-700";

    if (loading) {
        return (
            <div className={`${containerClasses} text-center`}>
                <p className="text-gray-300">Initializing wallet connection...</p>
            </div>
        );
    }

    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold mb-4 text-white">Welcome to the Governance dApp</h1>
                <p className="mb-4 text-gray-400">Please connect your wallet to continue.</p>
                <button 
                    onClick={connectWallet}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Connect Wallet
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        );
    }

    // The button should only show if the contract is NOT loaded (meaning an error state)
    // and the user is not already on Sepolia.
    const shouldShowSwitchButton = !contract && !isSepolia;

    return (
        <div className={containerClasses}>
            <div className="flex flex-wrap justify-between items-center">
                <div className='mb-2 md:mb-0'>
                    <p className="text-sm text-gray-400">Connected as:</p>
                    <p className="font-mono text-sm md:text-base break-all text-gray-200">{address}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Network:</p>
                    <p className={`font-bold ${contract ? 'text-green-400' : 'text-yellow-400'}`}>{networkName || 'Unknown'}</p>
                </div>
            </div>
            {error && <p className="text-red-400 mt-2">{error}</p>}
            {shouldShowSwitchButton && (
                <div className="mt-4 text-center">
                    <p className="text-yellow-500 bg-yellow-900/50 p-2 rounded border border-yellow-700">
                        This dApp is primarily tested on Sepolia.
                    </p>
                    <button 
                        onClick={switchToSepolia}
                        className="mt-2 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Switch to Sepolia
                    </button>
                </div>
            )}
        </div>
    );
};


export default function Proposals() {
  const { contract, address } = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      if (!contract) {
        setProposals([]);
        return;
      }
      setLoadingProposals(true);
      setFetchError('');
      try {
        const fetchedProposals = await contract.getProposals();
        const formattedProposals = fetchedProposals.map((p: any) => ({
          title: p.title,
          description: p.description,
          voteCount: Number(p.voteCount)
        }));
        setProposals(formattedProposals);
      } catch (err: any) {
        console.error(err);
        setFetchError('Could not fetch proposals. Please ensure you are on a supported network.');
      } finally {
        setLoadingProposals(false);
      }
    };

    fetchProposals();
  }, [contract]);

  return (
    <div className="container mx-auto p-4">
        <WalletInfo />

        {address && (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white">Proposals</h1>
                    <Link 
                        href="/proposals/create" 
                        className={`p-2 bg-blue-600 text-white rounded ${!contract ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        aria-disabled={!contract}
                        onClick={(e) => !contract && e.preventDefault()}
                    >
                        Create Proposal
                    </Link>
                </div>

                {loadingProposals && <p className="text-gray-400">Loading proposals...</p>}
                {fetchError && <p className="text-red-400">{fetchError}</p>}

                {contract && !loadingProposals && !fetchError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proposals.length > 0 ? (
                        proposals.map((proposal, index) => (
                            <div key={index} className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg hover:shadow-blue-900/50 transition-shadow">
                            <h2 className="text-xl font-bold text-gray-200">{proposal.title}</h2>
                            <p className="mt-2 text-gray-400">{proposal.description}</p>
                            <p className="mt-2 font-bold text-gray-200">Votes: {proposal.voteCount}</p>
                            </div>
                        ))
                        ) : (
                        <div className="col-span-full text-center py-10 bg-gray-900/50 border border-gray-700 rounded-lg">
                            <h2 className="text-xl text-gray-400">No proposals yet.</h2>
                            <p className="text-gray-500 mt-2">Why not be the first to create one?</p>
                        </div>
                        )}
                    </div>
                )}
            </div>
        )}
    </div>
  );
}