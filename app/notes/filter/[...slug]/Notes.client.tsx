'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import { fetchNotes, type NotesQueryResult } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import css from '@/app/notes/Notes.module.css';

const PER_PAGE = 12;

const NotesClient: React.FC = () => {
  const pathname = usePathname();

  const initialSearch = useMemo(() => {
    const rawTag = pathname.split('/').pop() || '';

    const isAllNotes =
      rawTag === 'all' || rawTag === 'notes' || rawTag.trim() === '';
    return isAllNotes ? '' : rawTag;
  }, [pathname]);

  const [manualSearchInput, setManualSearchInput] = useState('');
  const [debouncedManualSearch] = useDebounce(manualSearchInput, 500);

  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const finalFilterTerm = debouncedManualSearch || initialSearch;

  useEffect(() => {
    setPage(0);
  }, [finalFilterTerm]);

  const { data, isError, isFetching, error } = useQuery<NotesQueryResult>({
    queryKey: ['notes', page, finalFilterTerm],
    queryFn: () =>
      fetchNotes({
        page: page + 1,
        perPage: PER_PAGE,
        search: finalFilterTerm,
      }),
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load notes.';
      toast.error(`Error loading notes: ${errorMessage}`);
    }
  }, [isError, error]);

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;
  const showPagination = totalPages > 1;
  const shouldRenderList = notes.length > 0 && !isError;

  const handleSearchChange = useCallback((value: string) => {
    setManualSearchInput(value);
  }, []);

  const handlePageChange = useCallback((selected: number) => {
    setPage(selected);
  }, []);

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
        {isFetching && <Loader />}
        {isError && (
          <ErrorMessage
            message={error instanceof Error ? error.message : undefined}
          />
        )}

        {shouldRenderList && <NoteList notes={notes} currentPage={page} />}

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