"use client";

import { whatsappLink } from "@/lib/site";

export default function WhatsAppButton({
  message = "Hello! I would like to know more about enrolling my school for the psychometric test.",
}: {
  message?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 font-semibold text-white shadow-soft transition hover:bg-green-600"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-xl">🟢</span>
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
