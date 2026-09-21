import { Package, Boxes, AlertTriangle } from "lucide-react";

function SummaryCards({ items }) {
  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const itemTypes = items.length;

  const lowStock = items.filter(
    (item) => Number(item.quantity) <= 2
  ).length;

  const cards = [
    {
      title: "Total Items",
      value: totalQuantity,
      icon: Package,
      description: "Total quantity",
    },
    {
      title: "Item Types",
      value: itemTypes,
      icon: Boxes,
      description: "Different items",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      description: "2 or fewer remaining",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 p-2.5">
                <Icon size={19} className="text-slate-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;