export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "TestPsychometric";
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919041997889";

// Operating organisation & statutory registration details.
export const ORG = {
  operator: "AMG Educational Charitable Society",
  short: "AMG Educational Charitable Society",
  domain: "testpsychometric.com",
  reference: "https://amgeducations.in/",
  president: "Mandeep Singh Sran",
  registeredDistrict: "Faridkot, Punjab",
  registrationYear: "2013",
  darpanId: "PB/2026/0976115",
  darpanStatus: "Active",
  darpanDate: "30-01-2026",
  registeredWith: "Registrar of Societies",
  npoType: "Society",
  registrationNo: "160",
  actName: "The Societies Registration Act, 1860",
  cityOfRegistration: "Faridkot",
  stateOfRegistration: "Punjab",
  dateOfRegistration: "08-08-2013",
  address: "Arvind Nagar, Bathinda Road, Kotkapura, Faridkot, Punjab – 151204",
  primarySector: "Education & Literacy, Skill Development",
  secondarySector: "Information & Communication Technology",
  operationalArea: "Punjab",
  district: "Faridkot",
  email: "info@testpsychometric.com",
  phone: "+91 90419 97889",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "For Schools", href: "/for-schools" },
  { label: "For Companies", href: "/for-companies" },
  { label: "Individual Test", href: "/individual" },
  { label: "Study Centre", href: "/become-study-centre" },
  { label: "About", href: "/about" },
  { label: "Why It Is Important", href: "/why-psychometric" },
  { label: "Govt Career Guidance", href: "/government-awareness" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Sample Reports", href: "/sample-report" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const LOGIN_LINKS = [
  { label: "School Login", href: "/school-login" },
  { label: "Company Login", href: "/company-login" },
  { label: "Study Centre Login", href: "/centre-login" },
  { label: "Individual Login", href: "/individual/login" },
  { label: "Super Admin", href: "/admin/login" },
];
