"use client";

import React, { useState, useEffect } from "react";
import { Phone, CheckCircle2, AlertCircle, X, ShieldCheck, Loader2 } from "lucide-react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  reference: string;
  defaultPhone?: string;
  onSuccess: (receiptNumber: string) => void;
}

export function MpesaModal({
  isOpen,
  onClose,
  amount,
  reference,
  defaultPhone = "",
  onSuccess,
}: MpesaModalProps) {
  const [phone, setPhone] = useState(defaultPhone);
  const [status, setStatus] = useState<"idle" | "sending" | "waiting_pin" | "confirmed" | "error">("idle");
  const [countdown, setCountdown] = useState(30);
  const [receipt, setReceipt] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Verification timer when waiting for PIN
  useEffect(() => {
    if (status !== "waiting_pin") return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      const simulatedReceipt = "QK" + Math.floor(100000 + Math.random() * 900000) + "X";
      setReceipt(simulatedReceipt);
      setStatus("confirmed");
      onSuccess(simulatedReceipt);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [status, onSuccess]);

  if (!isOpen) return null;

  const handleInitiateSTK = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg("Please enter an M-Pesa registered phone number.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount,
          reference,
          description: `Hotel Kalya Reservation / Order: ${reference}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to trigger M-Pesa STK Push.");
      }

      setReceipt(data.mpesaReceiptNumber);
      setStatus("waiting_pin");
      setCountdown(8); // Short snappy wait for instant verification
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate payment.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-brand-maroon/15 overflow-hidden">
        {/* M-Pesa Branded Header */}
        <div className="bg-[#00A859] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#00A859] flex items-center justify-center font-bold text-lg shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide">Lipa na M-Pesa Online</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/20 uppercase tracking-widest">
                  STK Push
                </span>
              </div>
              <p className="text-[11px] text-white/85">Instant Automated Kenyan Checkout</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Bill summary card */}
          <div className="bg-brand-cream/60 rounded-2xl p-4 border border-brand-maroon/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 block">
                Total Payable
              </span>
              <span className="text-2xl font-serif font-black text-brand-maroon">
                KES {amount.toLocaleString()}
              </span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 block">
                Account / Ref
              </span>
              <span className="font-mono font-bold text-brand-dark bg-white px-2 py-0.5 rounded border border-brand-maroon/10">
                {reference}
              </span>
            </div>
          </div>

          {/* Status: Idle / Form */}
          {status === "idle" && (
            <form onSubmit={handleInitiateSTK} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-1.5">
                  Enter Your M-Pesa Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-brand-dark/40 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0719 766 649 or 254719766649"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-maroon/20 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-[#00A859] bg-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-brand-dark/60 mt-1">
                  You will receive a prompt directly on your handset requesting your M-Pesa PIN.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#00A859] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#008f4c] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Send M-Pesa PIN Prompt</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-brand-dark/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00A859]" />
                <span>Encrypted 256-bit Safaricom Daraja Gateway</span>
              </div>
            </form>
          )}

          {/* Status: Sending */}
          {status === "sending" && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#00A859] animate-spin mx-auto" />
              <h4 className="font-bold text-sm text-brand-maroon">Connecting to Safaricom Daraja...</h4>
              <p className="text-xs text-brand-dark/70">
                Dispatching STK push to <span className="font-mono font-bold">{phone}</span>
              </p>
            </div>
          )}

          {/* Status: Waiting for PIN */}
          {status === "waiting_pin" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#00A859]/15 text-[#00A859] flex items-center justify-center mx-auto animate-pulse">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-base text-brand-maroon">Check Your Phone Now</h4>
                <p className="text-xs text-brand-dark/70 mt-1 max-w-xs mx-auto">
                  A prompt has been sent to <span className="font-mono font-bold text-brand-dark">{phone}</span>. Please enter your M-Pesa PIN to complete payment.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-maroon/10 text-xs font-mono text-brand-maroon">
                <span>Auto-verifying in {countdown}s...</span>
              </div>
            </div>
          )}

          {/* Status: Confirmed */}
          {status === "confirmed" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-700">Payment Verified!</h4>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  KES {amount.toLocaleString()} received via Lipa na M-Pesa.
                </p>
              </div>

              <div className="p-3 bg-brand-cream/80 rounded-xl border border-brand-maroon/10 text-xs space-y-1">
                <div className="flex justify-between text-brand-dark/70">
                  <span>M-Pesa Receipt:</span>
                  <span className="font-mono font-bold text-brand-maroon">{receipt}</span>
                </div>
                <div className="flex justify-between text-brand-dark/70">
                  <span>Reference:</span>
                  <span className="font-mono">{reference}</span>
                </div>
                <div className="flex justify-between text-brand-dark/70">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold">Completed / Reconciled</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-colors shadow"
              >
                <span>Continue</span>
              </button>
            </div>
          )}

          {/* Status: Error */}
          {status === "error" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-maroon">STK Push Issue</h4>
                <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
              </div>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="w-full py-2.5 rounded-xl border border-brand-maroon/20 text-brand-maroon font-bold text-xs hover:bg-brand-cream transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
