import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import VesselGallery from "@/components/VesselGallery";
import PressureTest from "@/components/PressureTest";
import Engineering from "@/components/Engineering";
import Footer from "@/components/Footer";
import SonarCursor from "@/components/SonarCursor";
import WaterPlasma from "@/components/WaterPlasma";
import { VIDEOS } from "@/data/catalog";
import { getCatalog } from "@/lib/catalogClient";

export default function Home() {
  const [items, setItems] = useState(VIDEOS);
  const [source, setSource] = useState("fallback");

  useEffect(() => {
    let active = true;
    getCatalog({ limit: 18 }).then((result) => {
      if (!active) return;
      if (result.items.length) setItems(result.items);
      setSource(result.source);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-abyss text-seafoam sonar-cursor">
      <WaterPlasma />
      <SonarCursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <VesselGallery items={items} source={source} />
        <PressureTest items={items} source={source} />
        <Engineering />
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
}
