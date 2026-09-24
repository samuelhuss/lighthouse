"use client";

import { CheckInMode } from "@/components/admin/CheckInMode";

export default function CheckInPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">Check-in de Acesso</h1>
        <p className="mt-2 text-sm text-slate-500">
          Escaneie o QR Code do passaporte ou digite o código manualmente.
        </p>
      </div>
      
      <CheckInMode />
    </div>
  );
}
