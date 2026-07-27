"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Dark-themed confirm modal, used in place of window.confirm()/alert() for
 * destructive dashboard actions (delete table, delete category/item) --
 * native browser dialogs can't be styled and break the rest of the app's
 * visual language. Dashboard-only for now: every current call site is a
 * dashboard action, so this doesn't need a light variant yet.
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="card-dash-static w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{body}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancel} className="btn-link-dash">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-soft transition duration-200 hover:scale-[1.03] ${
                  danger ? "bg-rose-500 hover:bg-rose-600" : "bg-accent-gradient"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
