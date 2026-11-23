import { useAuth } from "@/context/AuthContext";
import {
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const columns = [
  { key: "username", label: "Username" },
  { key: "software", label: "Software" },
  { key: "folder_name", label: "Folder" },
  { key: "security_key", label: "Security Key" },
  { key: "pdfFiles", label: "PDF Manual" },
  { key: "software_download", label: "Action" },
];

export default function LicenseTable({ data }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const { token } = useAuth();
  const handleViewPdf = async (id, fileName, idx) => {
    setLoading({ idx, id });
    try {
      const res = await fetch(
        `${BASE_URL}/orders/software-credential/${id}/pdf/${fileName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to fetch PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-['Outfit',sans-serif] text-sm font-bold text-slate-900 tracking-tight">
                Active Licenses &amp; Credentials
              </h2>
              <p className="text-[11px] text-slate-400">
                {data?.length || 0} product{" "}
                {data?.length === 1 ? "entry" : "entries"} available
              </p>
            </div>
          </div>
        </div>

        {/* Desktop View: Clean Table */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-190">
            {/* Head */}
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-12 text-center">#</th>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {data?.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  {/* Row number */}
                  <td className="px-4 py-3.5 text-center text-xs font-mono font-medium text-slate-400">
                    {i + 1}
                  </td>

                  {/* Username */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-['Outfit',sans-serif] text-[13px] font-bold text-slate-900">
                      {row.username}
                    </span>
                  </td>

                  {/* Software */}
                  <td className="px-4 py-3.5 min-w-65">
                    <span className="block text-xs font-medium text-slate-800 whitespace-normal wrap-break-word">
                      {row.software}
                    </span>
                  </td>

                  {/* Folder */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 bg-slate-100/90 text-slate-700 text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-slate-200/70">
                      <Folder size={12} className="text-slate-400" />
                      {row.folder_name}
                    </span>
                  </td>

                  {/* Security Key */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1">
                      <span
                        className="font-mono text-xs font-semibold text-slate-700 select-all"
                        title={row.security_key}
                      >
                        {row.security_key?.length > 14
                          ? `${row.security_key.slice(0, 12)}...`
                          : row.security_key}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(row?.security_key, i)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-0.5 rounded hover:bg-slate-100"
                        title="Copy Key"
                      >
                        {copied === i ? (
                          <Check
                            size={14}
                            className="text-emerald-600 stroke-[2.5]"
                          />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* PDF Files */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                      {row.pdf_files && row.pdf_files.length > 0 ? (
                        row.pdf_files.map((pdf, j) => (
                          <button
                            key={j}
                            onClick={() => handleViewPdf(row.id, pdf, j)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-600 bg-red-50/80 hover:bg-red-100/80 border border-red-200/70 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer max-w-50 truncate"
                            title={pdf}
                          >
                            <FileText
                              size={13}
                              className="shrink-0 text-red-600"
                            />
                            <span className="truncate">{pdf}</span>
                            {loading?.idx === j && loading?.id === row.id && (
                              <Loader2
                                size={12}
                                className="animate-spin shrink-0 text-red-600"
                              />
                            )}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-300 italic">—</span>
                      )}
                    </div>
                  </td>

                  {/* Download Software */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {row.software_download ? (
                      <Link
                        href={row.software_download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-sm shadow-red-600/20 px-4 py-1.5 rounded-full transition-all"
                      >
                        <Download size={14} strokeWidth={2.5} />
                        Download
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-300 italic">
                        No link
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Responsive Card List */}
        <div className="block md:hidden divide-y divide-slate-100">
          {data?.map((row, i) => (
            <div key={i} className="p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-['Outfit',sans-serif] text-sm font-bold text-slate-900">
                    {row.username}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-slate-200">
                  <Folder size={11} className="text-slate-400" />
                  {row.folder_name}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Software
                </p>
                <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
                  {row.software}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Security Key
                  </span>
                  {copied === i && (
                    <span className="text-[10px] font-bold text-emerald-600">
                      Copied!
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="font-mono text-xs font-semibold text-slate-800 select-all truncate pr-2">
                    {row.security_key}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(row?.security_key, i)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-slate-200/60 shrink-0"
                    title="Copy Key"
                  >
                    {copied === i ? (
                      <Check
                        size={14}
                        className="text-emerald-600 stroke-[2.5]"
                      />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {row.pdf_files && row.pdf_files.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Documentation Manual
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.pdf_files.map((pdf, j) => (
                      <button
                        key={j}
                        onClick={() => handleViewPdf(row.id, pdf, j)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full px-3 py-1 transition-colors cursor-pointer max-w-full truncate"
                      >
                        <FileText size={13} className="shrink-0 text-red-600" />
                        <span className="truncate">{pdf}</span>
                        {loading?.idx === j && loading?.id === row.id && (
                          <Loader2
                            size={12}
                            className="animate-spin shrink-0 text-red-600"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {row.software_download && (
                <div className="pt-1">
                  <Link
                    href={row.software_download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] shadow-sm shadow-red-600/20 py-2.5 rounded-full transition-all"
                  >
                    <Download size={14} strokeWidth={2.5} />
                    Download Software Package
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
