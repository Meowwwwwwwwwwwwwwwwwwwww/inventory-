import { Package, Plus } from "lucide-react";

function Header({ onAddItem }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
            <Package size={21} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              My Inventory
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Keep track of your belongings
            </p>
          </div>
        </div>

        <button
          onClick={onAddItem}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Plus size={17} />
          <span>Add Item</span>
        </button>
      </div>
    </header>
  );
}

export default Header;