"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function FetchData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array, so it runs once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-white mb-4">Data:</h1>
  
        {loading ? (
          <div className="text-lg text-gray-400 text-center">Loading...</div>
        ) : error ? (
          <div className="text-lg text-red-500 text-center">Error: {error}</div>
        ) : (
          <pre className="bg-gray-700 text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
  
        <div className="mt-6 text-center">
          <Link
            href="/auth"
            className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-lg transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
  
}

export default FetchData;
