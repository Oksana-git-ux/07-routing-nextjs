import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { NOTES_QUERY_KEY, fetchNotesByTag } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilteredNotesPage({ params }: FilteredNotesPageProps) {

  const awaitedParams = await params;
  const tag = awaitedParams?.slug?.[0] ?? "all";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [NOTES_QUERY_KEY, tag],
    queryFn: () => fetchNotesByTag(tag),
    staleTime: 1000 * 60 * 5,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
