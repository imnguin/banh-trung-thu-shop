import { MoonStars } from "@phosphor-icons/react";
import { useCategoryContext } from "../context/CategoryContext";

export default function ProductImage({
    category,
    image,
    alt = "",
    className = "",
}) {
    const { getCategoryTheme } = useCategoryContext();

    if (image) {
        return (
            <div className={`relative overflow-hidden rounded-xl ${className}`}>
                <img
                    src={image}
                    alt={alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${getCategoryTheme(category)} ${className}`}
        >
            <MoonStars
                className="h-1/2 w-1/2 text-white/25"
                weight="fill"
                aria-hidden="true"
            />
        </div>
    );
}
