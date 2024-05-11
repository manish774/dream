import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./Modal.scss";
interface ModalState<T extends ReactNode> {
  isDialogOpen: boolean;
  onCloseAction?: () => any;
  submitClick?: (d: any) => any;
  component: T;
  dialogSize?: "FULL" | "MEDIUM" | "SMALL";
  closeLabel?: string;
  submitLabel?: string;
  enableFooter?: boolean;
}

const Modal = <T extends ReactNode>({
  isDialogOpen,
  onCloseAction,
  component,
  dialogSize = "MEDIUM",
  submitClick,
  closeLabel = "Close",
  submitLabel = "Ok",
  enableFooter = true,
}: ModalState<T>) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isDialogOpen) {
      ref?.current?.showModal();
    } else {
      ref?.current?.close();
    }
  }, [isDialogOpen]);

  const closeModal = () => {
    if (onCloseAction) {
      onCloseAction();
    }
  };

  const onSubmitClick = (d: any) => {
    submitClick && submitClick(d);
  };

  return (
    <dialog ref={ref} className={dialogSize}>
      <button className="close-top-button" onClick={closeModal}>
        x
      </button>
      <div>
        {component}
        {enableFooter && (
          <div className="footer">
            <button onClick={onSubmitClick} className="submit-button">
              {submitLabel}
            </button>
            <button onClick={closeModal} className="close-button">
              {closeLabel}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
