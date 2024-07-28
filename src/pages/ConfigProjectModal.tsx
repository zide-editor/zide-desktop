import { useState } from "react";

export default function ConfigProject({
  setStarted,
}: {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState<string>("");
  const [rows, setCols] = useState<number>(8);
  const [cols, setRows] = useState<number>(8);

  const SubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStarted(true);
  };

  return (
    <main className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <form
        className="bg-white p-4 border-4 border-black"
        onSubmit={(e) => SubmitCreate(e)}
      >
        <h2 className="text-xl font-semibold mb-4">Configure Project</h2>
        <div className="flex flex-col gap-5 justify-center items-center">
          <div className="flex items-center justify-center">
            <div className="flex justify-center items-center text-md font-semibold px-1">
              Name
            </div>
            <input
              placeholder="Untitled"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-9/11 py-2 px-3 border-2 border-black"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex justify-center items-center text-md font-semibold">
              Rows
            </div>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.valueAsNumber)}
              placeholder="0"
              className="w-20 py-2 px-2 border-2 border-black"
            />

            <div className="flex justify-center items-center text-md font-semibold">
              Column
            </div>
            <input
              type="number"
              placeholder="0"
              value={cols}
              onChange={(e) => setCols(e.target.valueAsNumber)}
              className="w-20 py-2 px-2 border-2 border-black"
            />
          </div>

          <button className="px-5 py-3 bg-black text-white">Create</button>
        </div>
      </form>
    </main>
  );
}
