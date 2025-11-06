'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

import { fetchNotes, type NotesQueryResult } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from '@/app/notes/Notes.module.css';

const PER_PAGE = 12;
const DEBUG = false;

const DynamicErrorMessage = dynamic(
  () => import('@/components/ErrorMessage/ErrorMessage'),
  { ssr: false }
);
const DynamicLoader = dynamic(() => import('@/components/Loader/Loader'), {
  ssr: false,
});

interface NotesClientProps {
  initialSearch: string;
}

const NotesClient: React.FC<NotesClientProps> = ({ initialSearch }) => {
  const [manualSearchInput, setManualSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedManualSearch] = useDebounce(manualSearchInput, 500);

  const querySearch = debouncedManualSearch.trim();
  const queryTag = querySearch ? '' : initialSearch.trim();

  const activeFilterKey = `${queryTag}|${querySearch}`;
  const prevFilterKeyRef = useRef(activeFilterKey);

  useEffect(() => {
    if (prevFilterKeyRef.current !== activeFilterKey) {
      prevFilterKeyRef.current = activeFilterKey;
      setPage(0);
      if (DEBUG) console.log('[DEBUG] Filter changed, reset page → 0');
    }
  }, [activeFilterKey]);

  const { data, isError, isFetching, error } = useQuery<NotesQueryResult>({
    queryKey: ['notes', queryTag, querySearch, page],
    queryFn: () =>
      fetchNotes({
        page: page + 1,
        perPage: PER_PAGE,
        tag: queryTag,
        search: querySearch,
      }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error ? error.message : 'Failed to load notes.';
      toast.error(`Error loading notes: ${message}`);
    }
  }, [isError, error]);

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const handleSearchChange = useCallback((value: string) => {
    setManualSearchInput(value);
  }, []);

  const handlePageChange = useCallback((selected: number) => {
    setPage(selected);
  }, []);

  const showPagination = totalPages > 1;
  const shouldRenderList = notes.length > 0 && !isError;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} value={manualSearchInput} />

        {showPagination && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isFetching && <DynamicLoader />}

        {isError && (
          <DynamicErrorMessage
            message={
              error instanceof Error ? error.message : 'Error loading notes.'
            }
          />
        )}

        {shouldRenderList && <NoteList notes={notes} />}

        {!isFetching && !isError && notes.length === 0 && (
          <p className={css.noResults}>
            No notes found. Try changing your search query or creating a new
            note.
          </p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default NotesClient;