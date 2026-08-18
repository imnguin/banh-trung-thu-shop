import { useEffect } from "react";
import { X } from "@phosphor-icons/react";

export default function Modal({
    open,
    title,
    onClose,
    children,
    maxWidthClass = "max-w-lg",
}) {
    useEffect(() => {
        if (!open) return;
        function handleKey(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className={`max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-xl bg-surface p-6 shadow-xl`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
