/* Clean line-icon set (Lucide-style) for dashboard navigation & stat cards.
   Strokes use currentColor so they inherit text colour. Unknown names fall
   back to rendering the raw string (keeps emoji working if ever passed). */

const P: Record<string, JSX.Element> = {
  overview: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>),
  school: (<><path d="m3 8 9-4 9 4-9 4-9-4Z" /><path d="M6 10v5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-5" /><path d="M21 8v5" /></>),
  company: (<><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-3a2 2 0 0 1 4 0v3" /></>),
  centre: (<><path d="M3 9 4.5 4h15L21 9" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M3 9h18" /></>),
  receipt: (<><path d="M4 3v18l2-1.2L8 21l2-1.2L12 21l2-1.2L16 21l2-1.2L20 21V3l-2 1.2L16 3l-2 1.2L12 3l-2 1.2L8 3 6 4.2 4 3Z" /><path d="M8 8h8M8 12h8M8 16h5" /></>),
  settlements: (<><circle cx="8" cy="8" r="5" /><path d="M18.09 10.37A5 5 0 1 1 12.6 18.5" /><path d="M7 6h1.5a1.5 1.5 0 0 1 0 3H7m1 0v1.5M8 5v1" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.3a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.7 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 0 1 4 0v.1A1.6 1.6 0 0 0 17 2.7a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 16 0v1" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M3 20v-1a6 6 0 0 1 12 0v1" /><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M21 20v-1a6 6 0 0 0-4-5.7" /></>),
  report: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>),
  verify: (<><path d="M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></>),
  card: (<><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20M6 15h4" /></>),
  pricing: (<><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8Z" /><path d="M7.5 7.5h.01" /></>),
  questions: (<><circle cx="12" cy="12" r="9" /><path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.8 2.8-2.8 2.8M12 17h.01" /></>),
  careers: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>),
  content: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  email: (<><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="m22 7-10 6L2 7" /></>),
  leads: (<><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="M2 12h6l2 3h4l2-3h6" /></>),
  audit: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 8v4l3 2" /></>),
  admins: (<><path d="M12 2 4 5v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V5l-8-3Z" /><circle cx="12" cy="10" r="2.2" /><path d="M8.5 16a3.6 3.6 0 0 1 7 0" /></>),
  wallet: (<><path d="M3 7a2 2 0 0 1 2-2h12.5a1.5 1.5 0 0 1 0 3H5" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5" /><path d="M16 13h.01" /></>),
  test: (<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3h6v3H9z" /><path d="m9 12 1.5 1.5L13 11M9 17h5" /></>),
  revenue: (<><path d="M12 2v20" /><path d="M17 6.5a4 4 0 0 0-4-2.5h-1.5a3.5 3.5 0 0 0 0 7H13a3.5 3.5 0 0 1 0 7h-1.5a4 4 0 0 1-4-2.5" /></>),
  cash: (<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" /></>),
  check: (<><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>),
  pending: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  bank: (<><path d="M3 21h18M4 10h16M12 3 4 7h16l-8-4ZM6 10v8M10 10v8M14 10v8M18 10v8" /></>),
  pin: (<><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>),
  refund: (<><path d="M3 7a9 9 0 1 1-1.5 5" /><path d="M3 3v4h4" /><path d="M12 8v4l3 2" /></>),
};

export default function NavIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const path = P[name];
  if (!path) return <span className={className}>{name}</span>;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  );
}

export const NAV_ICON_NAMES = Object.keys(P);
