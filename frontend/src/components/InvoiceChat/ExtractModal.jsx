const FIELDS = {
  title:          "Vendor / Client",
  amount:         "Amount",
  category:       "Category",
  date:           "Date",
  payment_method: "Payment Method",
  invoice_number: "Invoice No.",
  tax_amount:     "Tax Amount",
  description:    "Description",
  confidence:     "Confidence",
};

export default function ExtractModal({ data, onSave, onClose }) {
  const isIncome = data.invoice_type === "income";

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `invoice_${data.invoice_number || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-slate-800 text-sm">Extracted Data</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isIncome ? "▲ Income" : "▼ Expense"}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full
              ${data.confidence === "high"   ? "bg-green-100 text-green-600"
              : data.confidence === "medium" ? "bg-yellow-100 text-yellow-600"
              :                               "bg-red-100 text-red-600"}`}>
              {data.confidence}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none ml-2"
          >
            ×
          </button>
        </div>

        {/* Fields */}
        <div className="overflow-y-auto p-4 flex-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {Object.entries(FIELDS).map(([key, label]) => {
              const val = data[key];
              if (val === null || val === undefined || val === "") return null;
              const display =
                key === "amount" || key === "tax_amount"
                  ? `${data.currency || "LKR"} ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`
                  : String(val);
              return (
                <div key={key} className="flex flex-col gap-0.5 pb-2 border-b border-slate-100">
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </span>
                  <span className="text-xs font-medium text-slate-800 break-words">
                    {display}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 py-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 active:scale-95 transition-all"
          >
            Save to History
          </button>
        </div>
      </div>
    </div>
  );
}