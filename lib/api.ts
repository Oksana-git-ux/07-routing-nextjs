import axios from 'axios';
import { type Note, type NewNote } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface FetchNotesResponse {
  notes: any[]; // тимчасово any, бо API може мати _id
  perPage: number;
  total: number;
  totalPages: number;
}

export interface NotesQueryResult {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Трансформація даних API → відповідність типу Note
function transformNote(raw: any): Note {
  return {
    id: raw.id ?? raw._id ?? '', // якщо API повертає _id
    title: raw.title ?? '',
    content: raw.content ?? '',
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
    tag: raw.tag ?? undefined,
  };
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
  tag = '',
}: FetchNotesParams): Promise<NotesQueryResult> {
  if (!TOKEN) throw new Error('API Token is missing.');

  const params: Record<string, string | number> = { page, perPage };
  if (search.trim() !== '') params.search = search;
  if (tag?.trim() !== '') params.tag = tag;

  const response = await axiosInstance.get<FetchNotesResponse>('/notes', { params });

  const notes = response.data.notes.map(transformNote);

  console.log('Fetched notes:', notes); // лог для перевірки

  return {
    notes,
    totalPages: response.data.totalPages,
    totalNotes: response.data.total,
  };
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  if (!noteId) throw new Error('Note ID is required');
  if (!TOKEN) throw new Error('API Token is missing.');

  const response = await axiosInstance.get(`/notes/${noteId}`);
  const note = transformNote(response.data);

  console.log('Fetched note by id:', noteId, note); // лог

  return note;
}

export async function createNote(noteData: NewNote): Promise<Note> {
  if (!TOKEN) throw new Error('API Token is missing.');

  const response = await axiosInstance.post('/notes', noteData);
  return transformNote(response.data);
}

export async function deleteNote(noteId: string): Promise<Note> {
  if (!TOKEN) throw new Error('API Token is missing.');

  const response = await axiosInstance.delete(`/notes/${noteId}`);
  return transformNote(response.data);
}