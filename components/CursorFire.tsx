"use client";
import { useEffect, useRef } from "react";

export default function CursorFire() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.cursor = "none";

    let rx = -200, ry = -200;
    let mx = -200, my = -200;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      }
      if (spotRef.current) {
        spotRef.current.style.left = mx + "px";
        spotRef.current.style.top = my + "px";
      }
    };

    const onMouseDown = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(0.7)`;
    };
    const onMouseUp = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(1)`;
    };

    // ring follows with lag
    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Spotlight */}
      <div
        ref={spotRef}
        className="fixed pointer-events-none z-[9996] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(125,211,252,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Lagging ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid rgba(125,211,252,0.5)",
          transition: "transform 0.08s ease, scale 0.15s ease",
          boxShadow: "0 0 8px rgba(125,211,252,0.2)",
        }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#7dd3fc",
          boxShadow: "0 0 12px rgba(125,211,252,0.9)",
        }}
      />
    </>
  );
}
