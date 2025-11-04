import NotesClient from '@/app/notes/Notes.client';
import NotesPageCSS from '@/app/notes/NotesPage.module.css';

interface FilterPageProps {
    params: {
        slug: string[];
    };
}

export default function FilterPage({ params }: FilterPageProps) {
    
    const urlTag = params.slug?.[0] || ''; 

    return (
        <div className={NotesPageCSS.container}>
            <NotesClient />
        </div>
    );
}
