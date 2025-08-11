import { useEffect, useState } from "react";
import MusicCard from "./components/MusicCard";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import typeMusicCard from "./types/typeMusicCard";

function App() {
  const [musics, setMusics] = useState<typeMusicCard[]>([]);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const es = new EventSource("http://localhost:3000/progress");
    es.onmessage = (e) => {
      const updates = JSON.parse(e.data) as Record<
        string,
        Partial<typeMusicCard>
      >;
      setMusics((prev) =>
        prev.map((m) =>
          updates[m.jobId] ? { ...m, ...(updates[m.jobId] as any) } : m
        )
      );
    };
    return () => es.close();
  }, []);

  const startDownload = async () => {
    if (!url) return;
    const res = await fetch("http://localhost:3000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const { jobId } = await res.json();
    setMusics((prev) => [...prev, { jobId, percent: 0, status: "queued" }]);
    setUrl("");
  };

  return (
    <div className="bg-zinc-900 flex justify-center items-center h-dvh text-gray-300">
      <div className="bg-zinc-800 h-11/12 w-4xl max-w-11/12 p-4 rounded-2xl border-2 border-green-500 shadow-[0_0_15px_#22c55e] flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-gray-100">
            Music Downloader
          </h1>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter the Youtube Video Url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="submit" variant="green" onClick={startDownload}>
              Download
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {musics &&
            musics.map((item) => <MusicCard key={item.jobId} {...item} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
