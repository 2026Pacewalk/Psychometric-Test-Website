"use client";

import { useEffect, useState } from "react";

export default function PWA() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      if (!sessionStorage.getItem("tp-install-dismissed")) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
    setShow(false);
  }
  function dismiss() {
    setShow(false);
    sessionStorage.setItem("tp-install-dismissed", "1");
  }

  if (!show) return null;
  return (
    <div className="no-print fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:left-auto sm:right-4 sm:w-80 lg:bottom-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="App" className="h-10 w-10 flex-shrink-0 rounded-xl object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">Install TestPsychometric</p>
          <p className="text-xs text-slate-500">Add to your home screen for an app experience.</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={install} className="btn-primary flex-1 py-2 text-sm">Install App</button>
        <button onClick={dismiss} className="btn-outline px-3 py-2 text-sm">Later</button>
      </div>
    </div>
  );
}
