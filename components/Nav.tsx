
"use client";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-[#151a21] bg-black/40">
      <nav className="container flex items-center justify-between h-14">
        <a href="#home" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet-400">IW</a>
        <button className="md:hidden btn" onClick={() => setOpen(v => !v)} aria-expanded={open}>☰</button>
        <ul className={`md:flex gap-6 text-sm ${open ? "block" : "hidden"} md:block`}>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
