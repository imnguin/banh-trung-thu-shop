import { Minus, Plus } from "@phosphor-icons/react";

export default function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 20,
    size = "md",
}) {
    const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";

    function decrease() {
        onChange(Math.max(min, value - 1));
    }
    function increase() {
        onChange(Math.min(max, value + 1));
    }

    return (
        <div className="inline-flex items-center rounded-lg border border-border">
            <button
                type="button"
                onClick={decrease}
                disabled={value <= min}
                aria-label="Giảm số lượng"
                className={`flex ${dim} cursor-pointer items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Minus size={16} />
            </button>
            <span
                className="min-w-[2.5rem] text-center text-sm font-semibold"
                aria-live="polite"
            >
                {value}
            </span>
            <button
                type="button"
                onClick={increase}
                disabled={value >= max}
                aria-label="Tăng số lượng"
                className={`flex ${dim} cursor-pointer items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Plus size={16} />
            </button>
        </div>
    );
}
