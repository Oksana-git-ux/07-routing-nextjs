'use client';

import Modal from '@/components/Modal/Modal';
import NotePreview from './NotePreview.client';
import { useRouter } from 'next/navigation';

export default function NotePreviewModal({ noteId }: { noteId: string }) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <Modal onClose={close}>
      <NotePreview id={noteId} />
    </Modal>
  );
}