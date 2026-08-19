import { useState } from "react";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import Modal from "../../components/Modal";
import ProductImage from "../../components/ProductImage";
import { useCategoryContext } from "../../context/CategoryContext";
import { saveCategory, deleteCategory } from "../../services/categoryService";
import { notify } from "../../lib/notify";

const emptyForm = () => ({ _id: null, name: "", theme: "" });

export default function SellerCategoriesPage() {
    const { categories, loading, refetch } = useCategoryContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm());
    const [saving, setSaving] = useState(false);

    function openCreate() {
        setForm(emptyForm());
        setIsModalOpen(true);
    }

    function openEdit(category) {
        setForm({
            _id: category._id,
            name: category.name,
            theme: category.theme,
        });
        setIsModalOpen(true);
    }

    async function handleDelete(category) {
        if (!window.confirm(`Xóa danh mục "${category.name}"?`)) return;
        const res = await deleteCategory(category._id);
        if (res.isError) {
            notify("error", res.message);
            return;
        }
        notify("success", res.message);
        refetch();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) {
            notify("error", "Vui lòng nhập tên danh mục");
            return;
        }
        if (!form.theme.trim()) {
            notify("error", "Vui lòng nhập theme cho danh mục");
            return;
        }

        setSaving(true);
        try {
            const res = await saveCategory({
                _id: form._id,
                name: form.name.trim(),
                theme: form.theme.trim(),
            });
            if (res.isError) {
                notify("error", res.message);
                return;
            }
            notify("success", res.message);
            setIsModalOpen(false);
            refetch();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Quản lý danh mục
                </h1>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                    <Plus size={18} /> Thêm danh mục
                </button>
            </div>

            {loading ? (
                <p className="mt-8 text-center text-muted-foreground">
                    Đang tải...
                </p>
            ) : categories.length === 0 ? (
                <p className="mt-8 text-center text-muted-foreground">
                    Chưa có danh mục nào, hãy thêm danh mục đầu tiên.
                </p>
            ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
                    <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b border-border text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Ảnh minh họa</th>
                                <th className="px-4 py-3">Tên danh mục</th>
                                <th className="px-4 py-3">Mã (id)</th>
                                <th className="px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr
                                    key={c._id}
                                    className="border-b border-border last:border-0 hover:bg-muted"
                                >
                                    <td className="px-4 py-3">
                                        <ProductImage
                                            category={c._id}
                                            className="h-10 w-10"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {c.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {c._id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(c)}
                                                aria-label={`Sửa ${c.name}`}
                                                className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                                            >
                                                <PencilSimple size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(c)
                                                }
                                                aria-label={`Xóa ${c.name}`}
                                                className="cursor-pointer rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={form._id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-foreground">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                            required
                        />
                    </div>

                    {form._id && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Mã (id)
                            </label>
                            <input
                                type="text"
                                value={form._id}
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-foreground">
                            Theme (class gradient Tailwind)
                        </label>
                        <input
                            type="text"
                            value={form.theme}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    theme: e.target.value,
                                }))
                            }
                            placeholder="from-amber-700 to-amber-900"
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                            required
                        />
                    </div>

                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70"
                        >
                            {saving
                                ? "Đang lưu..."
                                : form._id
                                  ? "Lưu thay đổi"
                                  : "Thêm danh mục"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
