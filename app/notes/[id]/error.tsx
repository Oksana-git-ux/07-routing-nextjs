'use client';

export default function NoteDetailsError({ error, reset }: { error: Error, reset: () => void }) {
  
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
      {<button onClick={() => reset()}>Try again</button>}
    </div>
  );
}