"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Bell, LogOut, Check, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettingsPage() {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || newPassword.length < 6) return;
    setSavedPassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setSavedPassword(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account" },
          { label: "Account Settings" },
        ]}
      />

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account Overview</span>
            </Link>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-maroon">
              Account Security &amp; Settings
            </h1>
            <p className="text-xs text-brand-dark/70 mt-1">
              Manage your login credentials, reservation notifications, and active session.
            </p>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl shadow-md border border-brand-maroon/10 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-cream pb-3">
              <Lock className="w-5 h-5 text-brand-amber" />
              <h3 className="font-serif font-bold text-lg text-brand-maroon">
                Update Security Password
              </h3>
            </div>

            {savedPassword && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-maroon mb-1">
                  New Password (min. 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-brand-maroon/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-brand-cream/30 text-brand-dark"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-maroon text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-maroon-dark transition-all shadow"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-2xl shadow-md border border-brand-maroon/10 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-cream pb-3">
              <Bell className="w-5 h-5 text-brand-amber" />
              <h3 className="font-serif font-bold text-lg text-brand-maroon">
                Communication Preferences
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-brand-cream/40 cursor-pointer">
                <div>
                  <span className="font-bold text-brand-maroon block">Email Confirmations</span>
                  <span className="text-[11px] text-brand-dark/70">
                    Receive room reservation folios and receipts via email.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-maroon"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-brand-cream/40 cursor-pointer">
                <div>
                  <span className="font-bold text-brand-maroon block">SMS &amp; WhatsApp Notifications</span>
                  <span className="text-[11px] text-brand-dark/70">
                    Receive dining order status updates and gate access codes via mobile.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-maroon"
                />
              </label>
            </div>
          </div>

          {/* Session Termination */}
          <div className="bg-red-50/70 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-base text-red-900">Sign Out of Account</h4>
              <p className="text-xs text-red-700/80 mt-0.5">
                Terminate your current device session securely.
              </p>
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
