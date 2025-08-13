'use client';

import { useState } from 'react';
import { initializeContract } from '../contract';

export default function CreateProposal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateProposal = async () => {
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const contract = await initializeContract();
      const tx = await contract.createProposal(title, description);
      await tx.wait();
      setMessage('Proposal created successfully!');
      setTitle('');
      setDescription('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Proposal</h1>
      <div className="flex flex-col space-y-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
          rows={4}
        />
        <button
          onClick={handleCreateProposal}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Proposal'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
}