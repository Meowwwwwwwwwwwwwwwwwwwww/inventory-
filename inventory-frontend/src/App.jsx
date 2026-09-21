import { useEffect, useMemo, useState } from "react";

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

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-slate-900">
        No inventory items
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Add your first item to start tracking your inventory.
      </p>

      <button
        onClick={onAdd}
        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Add Item
      </button>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [deleteItemData, setDeleteItemData] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [items]);

  const filteredItems = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.name?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.location?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        const updated = await updateItem(editingItem.id, formData);

        setItems((current) =>
          current.map((item) =>
            item.id === updated.id ? updated : item
          )
        );

        showToast("Item updated successfully");
      } else {
        const created = await createItem(formData);

        setItems((current) => [created, ...current]);

        showToast("Item added successfully");
      }

      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Something went wrong", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteItemData) return;

    try {
      await deleteItem(deleteItemData.id);

      setItems((current) =>
        current.filter((item) => item.id !== deleteItemData.id)
      );

      showToast("Item deleted successfully");
      setDeleteItemData(null);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Could not delete item", "error");
    }
  };

  const handleQuantityChange = async (item, change) => {
    const newQuantity = Math.max(0, item.quantity + change);

    if (newQuantity === item.quantity) return;

    try {
      const updated = await updateItem(item.id, {
        name: item.name,
        quantity: newQuantity,
        category: item.category,
        description: item.description,
        location: item.location,
      });

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === updated.id ? updated : currentItem
        )
      );
    } catch (err) {
      console.error(err);
      showToast("Could not update quantity", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAdd={handleAdd} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SummaryCards items={items} />

        <div className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:max-w-sm"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {categories.map((itemCategory) => (
                  <option key={itemCategory} value={itemCategory}>
                    {itemCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          ) : loading ? (
            <LoadingState />
          ) : filteredItems.length === 0 ? (
            <EmptyState onAdd={handleAdd} />
          ) : (
            <InventoryTable
              items={filteredItems}
              onEdit={handleEdit}
              onDelete={setDeleteItemData}
              onQuantityChange={handleQuantityChange}
            />
          )}
        </div>
      </main>

      {modalOpen && (
        <AddEditModal
          item={editingItem}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleteItemData && (
        <DeleteModal
          item={deleteItemData}
          onClose={() => setDeleteItemData(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;