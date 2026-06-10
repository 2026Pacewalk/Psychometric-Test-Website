import type { Metadata } from "next";
import { Section, PageHeader } from "@/components/site/ui";
import LeadForm from "@/components/site/LeadForm";
import { whatsappLink, ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team for enrollment, pricing or any questions about psychometric testing.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Questions about enrollment, pricing or the report? We're here to help."
      />

      <Section>
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reach us directly</h2>
            <p className="mt-1 text-sm text-slate-500">Operated by {ORG.operator}</p>
            <div className="mt-6 space-y-4">
              {[
                ["📞", "Phone", ORG.phone],
                ["📧", "Email", ORG.email],
                ["📍", "Registered Office", ORG.address],
              ].map(([icon, label, value]) => (
                <div key={label} className="flex items-start gap-4 rounded-xl border border-slate-200 p-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-400">{label}</p>
                    <p className="text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={whatsappLink("Hello! I have a question about your psychometric test service.")}
              target="_blank"
              className="btn-accent mt-6 w-full sm:w-auto"
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Send us a message</h2>
            <LeadForm type="contact" />
          </div>
        </div>
      </Section>
    </>
  );
}
