'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/app/context/WalletContext';
import { useRouter } from 'next/navigation';

export default function CreateProposal() {
  const { contract } = useWallet();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If the user navigates here directly without being connected, redirect them.
    if (!contract) {
      router.replace('/proposals');
    }
  }, [contract, router]);

  const handleCreateProposal = async () => {
    if (!contract) {
        setError('Not connected to wallet.');
        return;
    }
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const tx = await contract.createProposal(title, description);
      setMessage('Transaction sent, waiting for confirmation...');
      await tx.wait();
      setMessage('Proposal created successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/proposals');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating proposal');
      setLoading(false);
    } 
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Create a New Proposal</h1>
        <div className="flex flex-col space-y-4 p-6 border rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
            disabled={loading}
          />
          <textarea
            placeholder="Describe your proposal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
            rows={5}
            disabled={loading}
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/proposals')}
              className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProposal}
              disabled={loading}
              className="p-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}