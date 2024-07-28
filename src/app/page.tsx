"use client";

import ProjectArena from "@/pages/ProjectArena";
import StartUp from "@/pages/StartUp";
import React, { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <>{!started ? <StartUp setStarted={setStarted} /> : <ProjectArena />}</>
  );
}
