'use client';
import Link from 'next/link';
import React from 'react';

import css from './SidebarNotes.module.css';

const TAGS = ['Work', 'Personal', 'Ideas', 'Learning'];

const SidebarNotes: React.FC = () => {
  return (
    <nav className={css.nav}>
        <h3 className={css.title}>Filter by Tag</h3>
        <ul className={css.menuList}>
            <li className={css.menuItem} key="all">
                <Link href={`/notes/filter/all`} className={css.menuLink}>
                    All notes
                </Link>
            </li>
            
            {TAGS.map(tag => (
                <li className={css.menuItem} key={tag}>
                    <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                        {tag}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
  );
};

export default SidebarNotes;
