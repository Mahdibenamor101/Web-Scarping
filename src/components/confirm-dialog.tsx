"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="card-dash-static w-full max-w-sm"
            initial={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-muted">{body}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onCancel} className="btn-link-dash">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 ${
                  danger ? "bg-danger hover:brightness-95" : "bg-brand-gradient"
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
