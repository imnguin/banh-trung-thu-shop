export const CATEGORIES = [
    {
        id: "truyen-thong",
        name: "Bánh nướng truyền thống",
        theme: "from-amber-700 to-amber-900",
    },
    { id: "deo", name: "Bánh dẻo", theme: "from-orange-200 to-amber-400" },
    {
        id: "cao-cap",
        name: "Hộp quà cao cấp",
        theme: "from-red-800 to-amber-900",
    },
    {
        id: "it-duong",
        name: "Ít đường - Eat clean",
        theme: "from-lime-700 to-emerald-800",
    },
    {
        id: "qua-tang",
        name: "Quà tặng doanh nghiệp",
        theme: "from-yellow-600 to-red-800",
    },
];

export function getCategoryName(id) {
    return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function getCategoryTheme(id) {
    return (
        CATEGORIES.find((c) => c.id === id)?.theme ??
        "from-amber-700 to-amber-900"
    );
}
