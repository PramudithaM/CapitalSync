import { useState, useRef, useEffect } from "react";
import UploadModal  from "./UploadModal";
import ExtractModal from "./ExtractModal";
import { useInvoiceStorage } from "../../hooks/useInvoiceStorage";

const WELCOME = {
  id:   0,
  role: "bot",
  text: "Hi! Upload an invoice and I'll extract the data for you.",
};

const API_URL     = "http://127.0.0.1:8000/extract/invoice";
const CHAT_URL    = "http://127.0.0.1:8000/chat";

export default function ChatPanel({ activeTab, step, setStep, onClose }) {
  const [messages,      setMessages]      = useState([WELCOME]);
  const [extractedData, setExtractedData] = useState(null);
  const [showExtract,   setShowExtract]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [inputText,     setInputText]     = useState("");
  const bottomRef = useRef(null);
  const storage   = useInvoiceStorage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMessage = (msg) =>
    setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);

  // ── Send text message ─────────────────────────────────────
  const handleSendText = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");
    addMessage({ role: "user", text: userText });
    setLoading(true);

    try {
      const systemPrompt = extractedData
        ? `You are an invoice assistant. The user has uploaded an invoice with this data:
${JSON.stringify(extractedData, null, 2)}
Answer questions about this invoice clearly and concisely in the same language the user uses.`
        : `You are an invoice assistant. Help users upload and understand their invoices.`;

      const conversationHistory = messages
        .filter((m) => m.id !== 0)
        .map((m) => ({
          role: m.role === "bot" ? "model" : "user",
          content: m.invoice
            ? `${m.text} - ${m.invoice.invoice_type} - ${m.invoice.currency || "LKR"} ${m.invoice.amount}`
            : m.text,
        }));

      const form = new FormData();
      form.append("text",    userText);
      form.append("system",  systemPrompt);
      form.append("history", JSON.stringify(conversationHistory));

      const res = await fetch(CHAT_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      addMessage({ role: "bot", text: data.reply });
    } catch (e) {
      addMessage({ role: "bot", text: `❌ ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // ── Upload & extract invoice ──────────────────────────────
  const handleFileSelect = async (f) => {
    if (!f) return;
    setStep("idle");
    setLoading(true);
    addMessage({ role: "user", text: `📎 ${f.name}` });

    try {
      const form = new FormData();
      form.append("file", f);
      const res  = await fetch(API_URL, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      setExtractedData(data);
      setShowExtract(true);
      addMessage({
        role:    "bot",
        text:    "Extracted successfully!",
        invoice: data,
      });
    } catch (e) {
      addMessage({ role: "bot", text: `❌ ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // ── Save extracted invoice ────────────────────────────────
  const handleSave = () => {
    if (!extractedData) return;
    storage.save(extractedData);
    setShowExtract(false);
    addMessage({
      role: "bot",
      text: `✓ Saved — ${extractedData.invoice_type === "income" ? "▲ Income" : "▼ Expense"} · ${extractedData.currency || "LKR"} ${Number(extractedData.amount).toLocaleString()}`,
    });
  };

  // ── Clear history ─────────────────────────────────────────
  const handleClear = () => {
    storage.clear();
    setMessages([WELCOME]);
    setExtractedData(null);
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 w-80 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">AI</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-tight">Invoice AI</p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {storage.getAll().length} invoice{storage.getAll().length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50">

          {/* Chat messages */}
          {activeTab !== "invoice" && (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs
                    ${msg.role === "bot"
                      ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                      : "bg-sky-500 text-white rounded-tr-sm"}`}
                  >
                    {msg.invoice ? (
                      <div className="flex flex-col gap-1.5">
                        <p className="font-medium">{msg.text}</p>
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full w-fit
                          ${msg.invoice.invoice_type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                        >
                          {msg.invoice.invoice_type === "income" ? "▲ Income" : "▼ Expense"}
                          {" · "}
                          {msg.invoice.currency || "LKR"} {Number(msg.invoice.amount).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {msg.invoice.title} · {msg.invoice.date}
                        </p>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[8px] font-bold">AI</span>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}

          {/* Invoice history tab */}
          {activeTab === "invoice" && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-1">
                Saved Invoices ({storage.getAll().length})
              </p>
              {storage.getAll().length === 0 ? (
                <div className="flex flex-col items-center gap-2 mt-8 text-slate-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <p className="text-xs">No invoices saved yet</p>
                </div>
              ) : (
                storage.getAll().map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${inv.invoice_type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}`}
                      >
                        {inv.invoice_type === "income" ? "▲ Income" : "▼ Expense"}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {inv.currency || "LKR"} {Number(inv.amount).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate">{inv.title}</p>
                    <p className="text-[10px] text-slate-400">{inv.date} · {inv.category}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom — upload + input + clear */}
        <div className="flex flex-col gap-2 px-3 py-3 border-t border-slate-100 flex-shrink-0 bg-white">

          {/* Upload + text input + send */}
          <div className="flex items-center gap-2">

            {/* Upload button */}
            <button
              onClick={() => setStep("upload")}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-all"
              title="Upload invoice"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              placeholder="Type a message..."
              className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-200 bg-slate-50 outline-none focus:border-sky-400 focus:bg-white transition-all"
            />

            {/* Send button */}
            <button
              onClick={handleSendText}
              disabled={!inputText.trim() || loading}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95
                ${inputText.trim() && !loading
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
          </div>

          {/* Saved count + clear */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400">
              {storage.getAll().length} saved
            </p>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-500 transition-all"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      {step === "upload" && (
        <UploadModal
          onClose={() => setStep("idle")}
          onFileSelect={handleFileSelect}
        />
      )}

      {/* Extract modal */}
      {showExtract && extractedData && (
        <ExtractModal
          data={extractedData}
          onSave={handleSave}
          onClose={() => setShowExtract(false)}
        />
      )}
    </>
  );
}
// import { useState, useRef, useEffect } from "react";
// import UploadModal  from "./UploadModal";
// import ExtractModal from "./ExtractModal";
// import { useInvoiceStorage } from "../../hooks/useInvoiceStorage";

// const WELCOME = {
//   id:   0,
//   role: "bot",
//   text: "Hi! Upload an invoice and I'll extract the data for you.",
// };

// const API_URL = "http://127.0.0.1:8000/extract/invoice";

// export default function ChatPanel({ activeTab, step, setStep, onClose }) {
//   const [messages,      setMessages]      = useState([WELCOME]);
//   const [extractedData, setExtractedData] = useState(null);
//   const [showExtract,   setShowExtract]   = useState(false);
//   const [loading,       setLoading]       = useState(false);
//   const [inputText,     setInputText]     = useState("");
//   const bottomRef = useRef(null);
//   const storage   = useInvoiceStorage();

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const addMessage = (msg) =>
//     setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);

//   const handleSendText = async () => {
//     if (!inputText.trim()) return;

//     const userText = inputText.trim();
//     setInputText("");
//     addMessage({ role: "user", text: userText });
//     setLoading(true);

//     try {
//       const systemPrompt = extractedData
//         ? `You are an invoice assistant. The user has uploaded an invoice with this data:
// ${JSON.stringify(extractedData, null, 2)}
// Answer questions about this invoice clearly and concisely in the same language the user uses.`
//         : `You are an invoice assistant. Help users upload and understand their invoices.`;

//       const conversationHistory = messages
//         .filter((m) => m.id !== 0)
//         .map((m) => ({
//           role: m.role === "bot" ? "model" : "user",
//           content: m.invoice
//             ? `${m.text} - ${m.invoice.invoice_type} - ${m.invoice.currency || "LKR"} ${m.invoice.amount}`
//             : m.text,
//         }));

//       const form = new FormData();
//       form.append("text", userText);
//       form.append("system", systemPrompt);
//       form.append("history", JSON.stringify(conversationHistory));

//       const res = await fetch("http://127.0.0.1:8000/chat", {
//         method: "POST",
//         body: form,
//       });

//       if (!res.ok) throw new Error(`Error ${res.status}`);
//       const data = await res.json();
//       addMessage({ role: "bot", text: data.reply });
//     } catch (e) {
//       addMessage({ role: "bot", text: `❌ ${e.message}` });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = async (f) => {
//     if (!f) return;
//     setStep("idle");
//     setLoading(true);
//     addMessage({ role: "user", text: `📎 ${f.name}` });

//     try {
//       const form = new FormData();
//       form.append("file", f);
//       const res  = await fetch(API_URL, { method: "POST", body: form });
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || `Error ${res.status}`);
//       }
//       const data = await res.json();
//       setExtractedData(data);
//       setShowExtract(true);
//       addMessage({
//         role:    "bot",
//         text:    "Extracted successfully!",
//         invoice: data,
//       });
//     } catch (e) {
//       addMessage({ role: "bot", text: `❌ ${e.message}` });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = () => {
//     if (!extractedData) return;
//     storage.save(extractedData);
//     setShowExtract(false);
//     addMessage({
//       role: "bot",
//       text: `✓ Saved — ${extractedData.invoice_type === "income" ? "▲ Income" : "▼ Expense"} · ${extractedData.currency || "LKR"} ${Number(extractedData.amount).toLocaleString()}`,
//     });
//   };

//   const handleClear = () => {
//     storage.clear();
//     setMessages([WELCOME]);
//   };

//   return (
//     <>
//       <div className="fixed bottom-24 right-6 z-50 w-80 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center">
//               <span className="text-white text-[9px] font-bold">AI</span>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-800 leading-tight">Invoice AI</p>
//               <p className="text-[10px] text-slate-400 leading-tight">
//                 {storage.getAll().length} invoice{storage.getAll().length !== 1 ? "s" : ""} saved
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-slate-400 hover:text-slate-600 text-xl leading-none"
//           >
//             ×
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-slate-50">

//           {/* Chat messages */}
//           {activeTab !== "invoice" && (
//             <>
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex gap-2 ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
//                 >
//                   {msg.role === "bot" && (
//                     <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <span className="text-white text-[8px] font-bold">AI</span>
//                     </div>
//                   )}
//                   <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs
//                     ${msg.role === "bot"
//                       ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
//                       : "bg-sky-500 text-white rounded-tr-sm"}`}
//                   >
//                     {msg.invoice ? (
//                       <div className="flex flex-col gap-1.5">
//                         <p className="font-medium">{msg.text}</p>
//                         <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full w-fit
//                           ${msg.invoice.invoice_type === "income"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"}`}
//                         >
//                           {msg.invoice.invoice_type === "income" ? "▲ Income" : "▼ Expense"}
//                           {" · "}
//                           {msg.invoice.currency || "LKR"} {Number(msg.invoice.amount).toLocaleString()}
//                         </span>
//                         <p className="text-[10px] text-slate-400">
//                           {msg.invoice.title} · {msg.invoice.date}
//                         </p>
//                       </div>
//                     ) : (
//                       <p>{msg.text}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Loading dots */}
//               {loading && (
//                 <div className="flex gap-2">
//                   <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-[8px] font-bold">AI</span>
//                   </div>
//                   <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2.5">
//                     <div className="flex gap-1 items-center">
//                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
//                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
//                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </>
//           )}

//           {/* Invoice history tab */}
//           {activeTab === "invoice" && (
//             <div className="flex flex-col gap-2">
//               <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 px-1">
//                 Saved Invoices ({storage.getAll().length})
//               </p>
//               {storage.getAll().length === 0 ? (
//                 <div className="flex flex-col items-center gap-2 mt-8 text-slate-400">
//                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//                     <polyline points="14 2 14 8 20 8"/>
//                   </svg>
//                   <p className="text-xs">No invoices saved yet</p>
//                 </div>
//               ) : (
//                 storage.getAll().map((inv) => (
//                   <div
//                     key={inv.id}
//                     className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col gap-1.5"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
//                         ${inv.invoice_type === "income"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"}`}
//                       >
//                         {inv.invoice_type === "income" ? "▲ Income" : "▼ Expense"}
//                       </span>
//                       <span className="text-xs font-semibold text-slate-700">
//                         {inv.currency || "LKR"} {Number(inv.amount).toLocaleString()}
//                       </span>
//                     </div>
//                     <p className="text-xs font-medium text-slate-700 truncate">{inv.title}</p>
//                     <p className="text-[10px] text-slate-400">{inv.date} · {inv.category}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* Bottom — input + clear */}
//         <div className="flex flex-col gap-2 px-3 py-3 border-t border-slate-100 flex-shrink-0 bg-white">

//           {/* Text input + send */}
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSendText()}
//               placeholder="Type a message..."
//               className="flex-1 text-xs px-3 py-2 rounded-full border border-slate-200 bg-slate-50 outline-none focus:border-sky-400 focus:bg-white transition-all"
//             />
//             <button
//               onClick={handleSendText}
//               disabled={!inputText.trim() || loading}
//               className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95
//                 ${inputText.trim() && !loading
//                   ? "bg-sky-500 text-white hover:bg-sky-600"
//                   : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
//             >
//               {loading ? (
//                 <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
//               ) : (
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <line x1="22" y1="2" x2="11" y2="13"/>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//                 </svg>
//               )}
//             </button>
//           </div>

//           {/* Saved count + clear */}
//           <div className="flex items-center justify-between">
//             <p className="text-[10px] text-slate-400">
//               {storage.getAll().length} saved
//             </p>
//             <button
//               onClick={handleClear}
//               className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-500 transition-all"
//             >
//               <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <polyline points="3 6 5 6 21 6"/>
//                 <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//               </svg>
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Upload modal */}
//       {step === "upload" && (
//         <UploadModal
//           onClose={() => setStep("idle")}
//           onFileSelect={handleFileSelect}
//         />
//       )}

//       {/* Extract modal */}
//       {showExtract && extractedData && (
//         <ExtractModal
//           data={extractedData}
//           onSave={handleSave}
//           onClose={() => setShowExtract(false)}
//         />
//       )}
//     </>
//   );
// }