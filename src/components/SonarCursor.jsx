import React, { useEffect, useRef, useState } from "react";

export default function SonarCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [ping, setPing] = useState({ x: 0, y: 0, key: 0 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!pointerFine.matches) return;
    setEnabled(true);

    let raf = 0;
    let rx = 0, ry = 0, tx = 0, ty = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }
      const target = e.target;
      const interactive = target.closest("a, button, [data-sonar], input, textarea, select");
      setHovering(!!interactive);
    };

    const onDown = (e) => setPing({ x: e.clientX, y: e.clientY, key: Date.now() });

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan" style={{ boxShadow: "0 0 10px rgba(0,242,255,0.9)" }} />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 rounded-full border transition-[width,height,opacity] duration-200"
        style={{ width: hovering ? 44 : 26, height: hovering ? 44 : 26, borderColor: "rgba(0,242,255,0.6)", opacity: 0.9 }}
      />
      {ping.key > 0 && (
        <span key={ping.key} className="fixed left-0 top-0 h-10 w-10 rounded-full border border-cyan animate-sonar" style={{ transform: `translate3d(${ping.x}px, ${ping.y}px, 0) translate(-50%, -50%)` }} />
      )}
    </div>
  );
}
