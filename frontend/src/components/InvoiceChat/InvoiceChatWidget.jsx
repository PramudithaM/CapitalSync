import { useState } from "react";
import ChatPanel   from "./ChatPanel";
import UploadModal from "./UploadModal";

export default function InvoiceChatWidget() {
  const [open,      setOpen]      = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [step,      setStep]      = useState("idle");
  const [visible, setVisible] = useState(false);

  const handleTabChange = (tab) => {
    if (tab === "invoice") {
      setStep("upload");
      setActiveTab("chat");  // always chat tab — invoice tab = upload trigger only
      if (!open) setOpen(true);
    } else {
      setActiveTab("chat");
      if (!open) setOpen(true);
    }
  };

  return (
    <>
      {open && (
        <ChatPanel
          activeTab={activeTab}
          step={step}
          setStep={setStep}
          onClose={() => setOpen(false)}
        />
      )}

      {step === "upload" && !open && (
        <UploadModal
          onClose={() => setStep("idle")}
          onFileSelect={() => {
            setStep("idle");
            setOpen(true);
            setActiveTab("chat");
          }}
        />
      )}

      {/* Bottom right controls */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <div className="flex flex-col items-end gap-1.5 mr-2"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        >
          <button
            onClick={() => handleTabChange("invoice")}
            className={`py-1.5 px-5 rounded-full text-sm font-medium shadow-sm active:scale-95 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200
        transition-all duration-300
        ${visible
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 translate-x-4 pointer-events-none"
        }`}>
          {/* //   className="py-1.5 px-5 rounded-full text-sm font-medium shadow-sm transition-all active:scale-95 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          // > */}
            Invoice Data Extract
          </button>
          <button
            onClick={() => handleTabChange("chat")}
                className={`py-1.5 px-5 rounded-full text-sm font-medium shadow-sm active:scale-95 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200
        transition-all duration-300
        ${visible
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 translate-x-4 pointer-events-none"
        }`}>
            Chat With AI
          </button>
        </div>

        {/* Circle */}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}