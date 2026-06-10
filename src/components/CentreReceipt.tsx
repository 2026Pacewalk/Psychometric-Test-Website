import { ORG } from "@/lib/site";
import PrintButton from "@/components/PrintButton";

export interface ReceiptData {
  receiptNo: string;
  centreName: string;
  ownerName: string;
  code: string;
  amount: number;
  mode: string;
  reference: string;
  date: string;
  approvedBy: string;
}

export default function CentreReceipt({
  data, backHref, heading = "JOINING FEE RECEIPT", nameLabel = "Study Centre Name", codeLabel = "Centre Code",
}: {
  data: ReceiptData; backHref?: string; heading?: string; nameLabel?: string; codeLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
      <div className="no-print container-page mb-4 flex items-center justify-between">
        {backHref ? <a href={backHref} className="btn-ghost text-sm">← Back</a> : <span />}
        <PrintButton />
      </div>

      <div className="print-page avoid-break">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-brand-700 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-800">{ORG.operator}</h1>
            <p className="text-xs text-slate-500">{ORG.address}</p>
            <p className="text-xs text-slate-500">DARPAN ID: {ORG.darpanId} · Reg. No: {ORG.registrationNo}</p>
          </div>
          <div className="text-right">
            <span className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">{heading}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-6 flex justify-between text-sm">
          <div><span className="text-slate-500">Receipt No:</span> <span className="font-mono font-bold text-slate-900">{data.receiptNo}</span></div>
          <div><span className="text-slate-500">Date:</span> <span className="font-semibold text-slate-900">{data.date}</span></div>
        </div>

        {/* Body */}
        <table className="mt-6 w-full text-sm">
          <tbody>
            {([
              [nameLabel, data.centreName],
              [codeLabel, data.code],
              ["Owner Name", data.ownerName || "—"],
              ["Payment Mode", data.mode.toUpperCase()],
              ["Transaction / Cash Receipt No.", data.reference || "—"],
              ["Approved By", data.approvedBy || "Administrator"],
            ] as [string, string][]).map(([k, v]) => (
              <tr key={k} className="border-b border-slate-100">
                <td className="py-2.5 font-medium text-slate-500">{k}</td>
                <td className="py-2.5 text-right text-slate-900">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-brand-700 px-6 py-4 text-white">
          <span className="text-sm font-semibold uppercase tracking-wide">Amount Received</span>
          <span className="text-2xl font-extrabold">₹{data.amount}/-</span>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          This is a system-generated receipt for the one-time Authorised Study Centre joining fee paid to {ORG.operator}.
        </p>

        <div className="mt-12 flex items-end justify-between">
          <div className="text-xs text-slate-400">{ORG.domain} · {ORG.email}</div>
          <div className="text-center">
            <div className="h-12 w-44 border-b border-slate-300" />
            <p className="mt-1 text-xs text-slate-500">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
