'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/app/context/WalletContext';

interface Proposal {
  title: string;
  description: string;
}

export default function Proposals() {
  const { contract, connectWallet, loading: walletLoading, error: walletError } = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      if (!contract) return;
      setLoading(true);
      setError('');
      try {
        const fetchedProposals = await contract.getProposals();
        const formattedProposals = fetchedProposals.map((p: any) => ({
          title: p.title,
          description: p.description,
        }));
        setProposals(formattedProposals);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error fetching proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [contract]);

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Governance Proposals</h1>
        <button 
            onClick={connectWallet}
            disabled={walletLoading}
            className="p-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 text-lg"
        >
            {walletLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {walletError && <p className="text-red-500 mt-4">{walletError}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Proposals</h1>
          <Link href="/proposals/create" className="p-2 bg-blue-500 text-white rounded">
            Create Proposal
          </Link>
        </div>
        {loading && <p>Loading proposals...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((proposal, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md">
                <h2 className="text-xl font-bold">{proposal.title}</h2>
                <p className="mt-2 text-gray-700">{proposal.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
