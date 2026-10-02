import React from "react";

export default function WaterPlasma({ intensity = "normal" }) {
  return (
    <div
      className={`water-plasma-field ${intensity === "soft" ? "water-plasma-soft" : ""}`}
      aria-hidden="true"
    >
      <div className="water-depth-gradient" />
      <div className="water-blob water-blob-a" />
      <div className="water-blob water-blob-b" />
      <div className="water-blob water-blob-c" />
      <div className="water-blob water-blob-d" />
      <div className="water-caustics" />
      <div className="water-sheen" />
      <div className="water-vignette" />
    </div>
  );
}
