import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Progress } from "./ui/progress";
import typeMusicCard from "../types/typeMusicCard";

function MusicCard({ filename, percent, status, downloadUrl }: typeMusicCard) {
  const displayName = filename ? filename.replace(/\.mp3$/, "") : "…";
  return (
    <>
    
    <Card>
      <CardHeader>
        <CardTitle>{displayName}</CardTitle>
        <CardDescription>
          <Progress value={Math.round(percent)} />
        </CardDescription>
        <CardAction>
          {status === "done" && downloadUrl && (
            <a href={`http://localhost:3000${downloadUrl}`}>
              <Button size={"icon"}>
                <Download className="text-green-500" />
              </Button>
            </a>
          )}
        </CardAction>
      </CardHeader>
    </Card>
    </>
  );
}

export default MusicCard;
