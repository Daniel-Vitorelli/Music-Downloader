import { useState } from "react";
import MusicCard from "./components/MusicCard";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import typeMusicCard from "./types/typeMusicCard";

function App() {
  const [musics, setMusics] = useState<typeMusicCard[]>([
    {
      name: "Leandro e Leonardo - Pensa em Mim",
      progress: Math.round(Math.random() * 100),
      status: "loading",
    },
  ]);
  const [url, setUrl] = useState<string>("");

  return (
    <div className="bg-zinc-900 flex justify-center items-center h-dvh text-gray-300">
      <div className="bg-zinc-800 h-11/12 w-4xl max-w-11/12 p-4 rounded-2xl border-2 border-green-500 shadow-[0_0_15px_#22c55e] flex flex-col gap-8">
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
          <Button type="submit" variant="green">
            Download
          </Button>
        </div>

        {musics &&
          musics.map((item, i) => (
            <MusicCard
              name={item.name}
              progress={item.progress}
              status={item.status}
              key={i}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
