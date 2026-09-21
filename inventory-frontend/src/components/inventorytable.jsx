import {
  Edit3,
  Trash2,
  Minus,
  Plus,
  PackageOpen,
} from "lucide-react";

function InventoryTable({
  items,
  onEdit,
  onDelete,
  onQuantityChange,
}) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <PackageOpen size={28} className="text-slate-500" />
        </div>

        <h3 className="text-base font-semibold text-slate-900">
          No items found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try changing your search or add a new item to your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Item
              </th>

              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quantity
              </th>

              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>

              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </th>

              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.name}
                    </p>

                    {item.description && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <QuantityControl
                    item={item}
                    onQuantityChange={onQuantityChange}
                  />
                </td>

                <td className="px-6 py-4">
                  {item.category ? (
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.category}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.location || "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      title="Edit"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {items.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {item.name}
                </p>

                {item.description && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <Edit3 size={17} />
                </button>

                <button
                  onClick={() => onDelete(item)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <QuantityControl
                item={item}
                onQuantityChange={onQuantityChange}
              />

              {item.category && (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {item.category}
                </span>
              )}

              {item.location && (
                <span className="text-xs text-slate-500">
                  {item.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuantityControl({ item, onQuantityChange }) {
  const quantity = Number(item.quantity || 0);

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
      <button
        onClick={() =>
          onQuantityChange(item, Math.max(0, quantity - 1))
        }
        disabled={quantity === 0}
        className="p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} />
      </button>

      <span
        className={`min-w-[38px] text-center text-sm font-semibold ${
          quantity <= 2 ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {quantity}
      </span>

      <button
        onClick={() =>
          onQuantityChange(item, quantity + 1)
        }
        className="p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default InventoryTable;