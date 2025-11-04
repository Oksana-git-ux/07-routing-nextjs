import React from 'react';
import css from '../LayoutNotes.module.css';

interface NotesFilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function NotesFilterLayout({ children, sidebar }: NotesFilterLayoutProps) {
  return (
    <div className={css.mainContainer}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      
      <main className={css.contentArea}>
        {children}
      </main>
    </div>
  );
}
