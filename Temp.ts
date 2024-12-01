import React, { useRef } from 'react';

interface ModalRef {
  open: () => void;
  close: () => void;
}

const Component = () => {
  // Use null instead of undefined
  const modalRef = useRef<ModalRef | null>(null);

  return <Modal ref={modalRef} />;
};