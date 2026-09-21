import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import InventoryTable from "./components/InventoryTable";
import AddEditModal from "./components/AddEditModal";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "./services/api";

function App() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [deletingItem, setDeletingItem] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [toast, setToast] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const data = await getItems();

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const uniqueCategories = items
      .map((item) => item.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name?.toLowerCase().includes(searchValue) ||
        item.category?.toLowerCase().includes(searchValue) ||
        item.location?.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  function openAddModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  async function handleSave(itemData) {
    try {
      setError("");

      if (editingItem) {
        const updatedItem = await updateItem(
          editingItem.id,
          itemData
        );

        setItems((current) =>
          current.map((item) =>
            item.id === editingItem.id ? updatedItem : item
          )
        );

        setToast("Item updated successfully.");
      } else {
        const newItem = await createItem(itemData);

        setItems((current) => [newItem, ...current]);

        setToast("Item added successfully.");
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save item.");
    }
  }

  function openDeleteModal(item) {
    setDeletingItem(item);
  }

  function closeDeleteModal() {
    if (!deleting) {
      setDeletingItem(null);
    }
  }

  async function handleDelete() {
    if (!deletingItem) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteItem(deletingItem.id);

      setItems((current) =>
        current.filter((item) => item.id !== deletingItem.id)
      );

      setToast("Item deleted successfully.");

      setDeletingItem(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete item.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleQuantityChange(item, quantity) {
    try {
      const updatedItem = await updateItem(item.id, {
        ...item,
        quantity,
      });

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? updatedItem
            : currentItem
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not update quantity.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAddItem={openAddModal} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage and keep track of everything you own.
          </p>
        </div>

        {/* Summary */}
        <SummaryCards items={items} />

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={loadItems}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {/* Search / filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search items..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-48"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-3 mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {loading
              ? "Loading..."
              : `${filteredItems.length} ${
                  filteredItems.length === 1
                    ? "item"
                    : "items"
                }`}
          </p>

          {(search || category !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Inventory */}
        {loading ? (
          <LoadingState />
        ) : (
          <InventoryTable
            items={filteredItems}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onQuantityChange={handleQuantityChange}
          />
        )}
      </main>

      {/* Add/Edit */}
      <AddEditModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={closeModal}
        onSave={handleSave}
      />

      {/* Delete */}
      <DeleteModal
        isOpen={Boolean(deletingItem)}
        item={deletingItem}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast("")}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="space-y-4 p-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-12 animate-pulse rounded-lg bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}

export default App;