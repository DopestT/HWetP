import React from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import VesselGallery from "@/components/VesselGallery";
import PressureTest from "@/components/PressureTest";
import Engineering from "@/components/Engineering";
import Footer from "@/components/Footer";
import SonarCursor from "@/components/SonarCursor";
import WaterPlasma from "@/components/WaterPlasma";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma />
      <SonarCursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <VesselGallery />
        <PressureTest />
        <Engineering />
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}
