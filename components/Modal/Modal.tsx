import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const root = document.getElementById('modal-root');
        if (root) {
            setModalRoot(root);
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!modalRoot) {
        return null; 
    }

    return createPortal(
        <div 
            className={css.backdrop} 
            role="dialog" 
            aria-modal="true" 
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                {children}
            </div>
        </div>,
        modalRoot 
    );
};
export default Modal;