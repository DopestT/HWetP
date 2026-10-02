import React from "react";
import { Link } from "react-router-dom";
import wordmark from "@/assets/herwet-wordmark.webp";

export default function AgeGate({ onEnter }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-abyss/95 px-4 py-6 backdrop-blur-xl sm:items-center sm:px-6">
      <div className="glass-panel relative my-auto w-full max-w-xl overflow-hidden rounded-2xl p-6 text-center sm:p-8 md:p-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-cyan/10 blur-[70px]" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/40 sm:mb-6 sm:h-16 sm:w-16">
            <div className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(0,242,255,0.9)]" />
          </div>
          <div className="mx-auto max-w-md">
            <img src={wordmark} alt="HERWET PUSSY" className="mx-auto w-full object-contain drop-shadow-[0_0_22px_rgba(0,242,255,0.14)]" />
          </div>
          <h1 className="heading-display mt-6 text-[clamp(2.35rem,11vw,3rem)] text-seafoam sm:mt-7 md:text-5xl">Enter the deep</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-seafoam/60">
            HERWET is intended for adults only. Confirm that you are at least 18 years old to continue.
          </p>
          <button onClick={onEnter} className="mt-7 min-h-12 w-full rounded-lg border border-cyan/60 bg-cyan/10 px-6 py-4 font-heading text-sm uppercase tracking-[0.18em] text-cyan transition hover:bg-cyan hover:text-abyss sm:mt-8 sm:tracking-[0.22em]">
            I am 18 or older
          </button>
          <div className="mt-4 flex items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-titanium">
            <Link to="/trust/age" className="hover:text-cyan">Age assurance</Link>
            <a href="https://www.google.com" className="hover:text-seafoam">Exit</a>
          </div>
        </div>
      </div>
    </div>
  );
}
