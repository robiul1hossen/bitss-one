import { useAuth } from "@/context/AuthContext";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function NavbarRight() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    clearAuth,
  } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleLogout() {
    clearAuth();
    setUserMenuOpen(false);
  }
  return (
    <div className="hidden md:flex items-center justify-end min-w-[100px] h-[38px]">
      {authLoading ? (
        // Skeleton while auth state loads from localStorage
        <div className="w-24 h-8 bg-slate-100/80 rounded-xl shrink-0" />
      ) : isAuthenticated ? (
        // ── Logged in — user avatar + dropdown ──
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200"
          >
            <div className="w-6.5 h-6.5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-red-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-[13.5px] font-semibold text-slate-700 max-w-28 truncate">
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* User dropdown */}
          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-4 bg-linear-to-br from-slate-900 to-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-black text-red-400">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
                >
                  <User size={14} className="text-slate-400 shrink-0" />
                  My Orders
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut size={14} className="shrink-0" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ── Logged out — Sign in + Get Protected ──
        <>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13.5px] font-semibold transition-all duration-200 shadow-sm shadow-red-200 hover:shadow-red-300"
          >
            Sign in
          </Link>
        </>
      )}
    </div>
  );
}
