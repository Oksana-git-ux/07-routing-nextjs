import NotePreviewPage from "./NotePreview.client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <NotePreviewPage id={id} />;
}