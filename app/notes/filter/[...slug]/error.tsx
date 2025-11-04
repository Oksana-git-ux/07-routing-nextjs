'use client'; 

import { useEffect } from 'react';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 style={{ padding: '20px', textAlign: 'center' }}>
        Something went wrong in the filter view!
      </h2>
      <ErrorMessage 
        message={error.message || 'An unexpected error occurred while loading notes for this filter.'} 
      />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={
            () => reset()
          }
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
