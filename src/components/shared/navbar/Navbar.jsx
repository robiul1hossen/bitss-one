"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import NavbarRight from "./NavbarRight";
import NavbarLeft from "./NavbarLeft";
import NavbarCenter from "./NavbarCenter";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) {
        setScrolled(window.scrollY > 32);
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-100 transition-[top,background-color,box-shadow,border-color] duration-300 py-3 bg-white scrollbar-none h-[68px] flex items-center ${
        scrolled
          ? "md:bg-white/95 md:backdrop-blur-sm md:shadow-sm md:border-b md:border-slate-100"
          : "md:top-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <NavbarLeft />
          <div className="hidden md:flex">
            <NavbarCenter />
          </div>
        </div>
        <NavbarRight />
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="w-full min-h-screen h-full bg-white px-4 fixed overflow-hidden">
          <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
      )}
    </div>
  );
}
