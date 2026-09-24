"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, AlertTriangle, QrCode, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type ScanResult = {
  success: boolean;
  message: string;
  registration?: {
    name: string;
    code: string;
    batchName: string;
    phone?: string | null;
    gender?: string | null;
    medications?: string | null;
    allergies?: string | null;
  };
};

export function CheckInMode() {
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Avoid scanning the same code multiple times rapidly
  const lastScannedCode = useRef<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-start scanner
    const timer = setTimeout(() => {
      initScanner();
    }, 500); // small delay to let DOM mount properly

    // Cleanup scanner on unmount
    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const initScanner = async () => {
    if (scannerRef.current || scannerActive) return;

    setScannerActive(true);
    setLastResult(null);
    setCameraError(null);

    scannerRef.current = new Html5Qrcode("qr-reader");

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      console.error("Camera start error", err);
      setCameraError("Permissão de câmera negada ou ambiente não seguro (HTTPS/localhost).");
      setScannerActive(false);
      scannerRef.current = null;
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
        scannerRef.current = null;
      }).catch(console.error);
    } else if (scannerRef.current) {
        scannerRef.current?.clear();
        scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const onScanSuccess = (decodedText: string) => {
    // Debounce to prevent multiple API calls for the same QR code in less than 3 seconds
    if (lastScannedCode.current === decodedText) return;
    
    lastScannedCode.current = decodedText;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      lastScannedCode.current = null;
    }, 3000);

    // Stop scanner temporarily to show result? Actually better to keep it running for fast flow, but we can pause UI.
    processCheckIn(decodedText);
  };

  const onScanFailure = (error: any) => {
    // html5-qrcode calls this constantly when no QR is in frame. Ignore.
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processCheckIn(manualCode.trim());
    setManualCode("");
  };

  const processCheckIn = async (code: string) => {
    setLoading(true);
    setLastResult(null);

    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationCode: code }),
      });

      const data = await res.json();

      if (res.ok) {
        // Sucesso
        new Audio('/sounds/success.mp3').play().catch(() => {}); // Optional sound feedback
        setLastResult({ success: true, message: data.message, registration: data.registration });
      } else {
        // Erro (já bipado, não pago, não encontrado)
        new Audio('/sounds/error.mp3').play().catch(() => {}); // Optional sound feedback
        setLastResult({ success: false, message: data.error || "Erro desconhecido." });
      }
    } catch (err) {
      setLastResult({ success: false, message: "Falha de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Scanner Section */}
      <div className="bg-[#0e2043] rounded-3xl p-6 shadow-2xl border border-slate-800/50 flex flex-col items-center">
        
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5 text-emerald-400" />
            <h2 className="font-serif font-bold text-lg">Câmera de Acesso</h2>
          </div>
          {scannerActive ? (
            <button 
              onClick={stopScanner}
              className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30 hover:bg-rose-500/30 transition"
            >
              Parar Leitor
            </button>
          ) : (
            <button 
              onClick={initScanner}
              className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 hover:bg-emerald-500/30 transition"
            >
              Iniciar Leitor
            </button>
          )}
        </div>

        {/* The div where html5-qrcode renders its UI */}
        <div className="w-full max-w-sm aspect-square bg-slate-900/50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 relative flex items-center justify-center">
          <div id="qr-reader" className="w-full h-full" />
          
          {!scannerActive && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
              <QrCode className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm font-medium">Câmera desativada</p>
            </div>
          )}
          
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-500 bg-slate-900/90 text-center p-6 z-10">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="text-xs font-bold">{cameraError}</p>
            </div>
          )}
        </div>

        <div className="mt-8 w-full border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-400 mb-3 text-center uppercase tracking-widest font-bold">Ou digite o código</p>
          <form onSubmit={handleManualSubmit} className="flex gap-2 w-full max-w-sm mx-auto">
            <input 
              type="text" 
              placeholder="Ex: LH-A1B2C3D4" 
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
            />
            <button 
              type="submit"
              disabled={loading || !manualCode.trim()}
              className="bg-[var(--gold)] text-[#0e2043] px-5 rounded-xl font-bold hover:bg-amber-400 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? "..." : <Search className="h-4 w-4" />}
            </button>
          </form>
        </div>

      </div>

      {/* Result Section (Overlay on mobile, sidebar on desktop) */}
      <div className={cn(
        "flex flex-col transition-all duration-300",
        lastResult 
          ? "fixed inset-0 z-50 bg-[#0e2043]/90 backdrop-blur-md p-6 lg:relative lg:p-0 lg:bg-transparent lg:z-auto lg:backdrop-blur-none" 
          : "hidden lg:flex"
      )}>
        <h3 className="font-bold text-slate-900 mb-4 items-center gap-2 hidden lg:flex">
          Monitor de Status
        </h3>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl lg:shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-full lg:h-auto">
          
          {lastResult && (
            <button 
              onClick={() => setLastResult(null)}
              className="lg:hidden absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition"
            >
              <XCircle className="h-6 w-6" />
            </button>
          )}

          {!lastResult && !loading && (
            <div className="flex flex-col items-center text-slate-400">
              <QrCode className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-sm font-medium">Aguardando leitura do ingresso...</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center text-[var(--gold)]">
              <div className="h-12 w-12 rounded-full border-4 border-[var(--gold)]/20 border-t-[var(--gold)] animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Verificando banco de dados...</p>
            </div>
          )}

          {lastResult && !loading && (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
              {lastResult.success ? (
                <>
                  <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 ring-8 ring-emerald-50">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 border border-emerald-200">
                    Acesso Liberado
                  </span>
                  <h4 className="text-3xl font-serif font-extrabold text-slate-900 mb-2">
                    {lastResult.registration?.name}
                  </h4>
                  <div className="flex gap-4 text-sm text-slate-500 font-medium mb-6">
                    <p>Passaporte: <span className="font-mono text-slate-700">{lastResult.registration?.code}</span></p>
                    <p>Lote: <span className="text-[var(--gold)] font-bold">{lastResult.registration?.batchName}</span></p>
                  </div>
                  
                  {/* Informações Adicionais */}
                  <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-100 p-4 text-left grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Telefone</p>
                      <p className="text-sm text-slate-700 font-medium">{lastResult.registration?.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sexo</p>
                      <p className="text-sm text-slate-700 font-medium">{lastResult.registration?.gender || "-"}</p>
                    </div>
                    
                    {(lastResult.registration?.allergies || lastResult.registration?.medications) && (
                      <div className="col-span-2 border-t border-slate-200 pt-3 mt-1">
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Atenção Médica
                        </p>
                        {lastResult.registration.allergies && (
                          <p className="text-xs text-slate-600 mb-1"><strong>Alergias:</strong> {lastResult.registration.allergies}</p>
                        )}
                        {lastResult.registration.medications && (
                          <p className="text-xs text-slate-600"><strong>Medicamentos:</strong> {lastResult.registration.medications}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
                </>
              ) : (
                <>
                  <div className="h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center mb-6 ring-8 ring-rose-50">
                    <XCircle className="h-12 w-12 text-rose-500" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4 border border-rose-200">
                    Acesso Negado
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 max-w-sm">
                    {lastResult.message}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Peça para o campista procurar a tenda de suporte financeiro.
                  </p>
                  
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500 animate-pulse" />
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
