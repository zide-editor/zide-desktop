import { useState } from "react";
import ConfigProject from "./ConfigProjectModal";
import OpenProject from "./OpenProject";

export default function StartUp({
  setStarted,
}: {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [config, setConfig] = useState(false);
  const [newProject, setNewProject] = useState(false);

  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#F3EEE3]">
      {config &&
        (newProject ? (
          <ConfigProject setStarted={setStarted} />
        ) : (
          <OpenProject />
        ))}
      <div className="border-4 border-black flex flex-col gap-2 p-2">
        <button
          className="p-3 border-2 bg-white text-center border-black"
          onClick={() => {
            setConfig(true);
            setNewProject(true);
          }}
        >
          <span className="mr-2 font-semibold">Create New Project</span>
        </button>
        <button
          className="p-3 border-2 bg-white text-center border-black"
          onClick={() => {
            setConfig(true);
          }}
        >
          <span className="mr-2 font-semibold">Open Project</span>
        </button>
      </div>
    </main>
  );
}
