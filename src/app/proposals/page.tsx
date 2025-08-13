'use client';

import { useState, useEffect } from 'react';
import { initializeContract } from './contract';
import Link from 'next/link';

interface Proposal {
  title: string;
  description: string;
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setError('');
        const contract = await initializeContract();
        const fetchedProposals = await contract.getProposals();
        // The contract returns an array of structs, which need to be mapped to plain objects
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
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proposals</h1>
        <Link href="/proposals/create" className="p-2 bg-blue-500 text-white rounded">
          Create Proposal
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((proposal, index) => (
            <div key={index} className="p-4 border rounded">
              <h2 className="text-xl font-bold">{proposal.title}</h2>
              <p>{proposal.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}