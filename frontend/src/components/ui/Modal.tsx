import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  showHeaderCloseButton?: boolean;
  children: React.ReactNode;
};

export default function Modal({
  open,
  title,
  onClose,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  showHeaderCloseButton = true,
  children
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
      <div
        className="absolute inset-0"
        onClick={closeOnBackdropClick ? onClose : undefined}
        role={closeOnBackdropClick ? "button" : undefined}
        tabIndex={closeOnBackdropClick ? -1 : undefined}
        aria-label={closeOnBackdropClick ? "Fechar modal" : undefined}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {showHeaderCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Fechar
            </button>
          ) : null}
        </div>
        <div className="max-h-[78vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
