import { ORG } from "@/lib/site";

// Compact trust block for the homepage.
export function TrustSection() {
  const items = [
    { label: "DARPAN ID", value: ORG.darpanId, sub: `Status: ${ORG.darpanStatus}` },
    { label: "Society Reg. No.", value: ORG.registrationNo, sub: ORG.actName },
    { label: "Registered District", value: ORG.registeredDistrict, sub: `Since ${ORG.registrationYear}` },
    { label: "Office Bearer", value: ORG.president, sub: "President" },
  ];
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="text-center">
          <p className="section-eyebrow">Trust &amp; Transparency</p>
          <h2 className="h-section mt-2">A Registered Non-Profit Initiative</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            This portal is operated by <strong>{ORG.operator}</strong>, a society registered under{" "}
            {ORG.actName} and listed on the NITI Aayog DARPAN portal.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{i.label}</p>
              <p className="mt-1 text-lg font-extrabold text-brand-700">{i.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{i.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <span>✔ Registrar of Societies, {ORG.stateOfRegistration}</span>
          <span>✔ NPO Type: {ORG.npoType}</span>
          <span>✔ Operational Area: {ORG.operationalArea}</span>
          <span>✔ Sector: {ORG.primarySector}</span>
        </div>
      </div>
    </section>
  );
}

// Full statutory details table for the About / Trust page.
export function RegistrationDetails() {
  const rows: [string, string][] = [
    ["Operated By", ORG.operator],
    ["Website", ORG.domain],
    ["Registered With", ORG.registeredWith],
    ["Type of NPO", ORG.npoType],
    ["Registration No.", ORG.registrationNo],
    ["Act Name", ORG.actName],
    ["Date of Registration", ORG.dateOfRegistration],
    ["City / State of Registration", `${ORG.cityOfRegistration}, ${ORG.stateOfRegistration}`],
    ["Registered District", ORG.registeredDistrict],
    ["DARPAN ID", ORG.darpanId],
    ["DARPAN Status", ORG.darpanStatus],
    ["DARPAN Registration Date", ORG.darpanDate],
    ["President", ORG.president],
    ["Primary Sector", ORG.primarySector],
    ["Secondary Sector", ORG.secondarySector],
    ["Operational Area", `${ORG.operationalArea} (District: ${ORG.district})`],
    ["Registered Office", ORG.address],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="bg-brand-700 px-6 py-4 text-white">
        <h3 className="text-lg font-bold">Organisation &amp; Registration Details</h3>
        <p className="text-sm text-brand-100">{ORG.operator}</p>
      </div>
      <dl className="divide-y divide-slate-100">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 gap-1 px-6 py-3 text-sm sm:grid-cols-3">
            <dt className="font-medium text-slate-500">{k}</dt>
            <dd className="text-slate-800 sm:col-span-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
