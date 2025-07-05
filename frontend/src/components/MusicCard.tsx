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
function MusicCard({name, progress, status} : typeMusicCard) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <Progress value={Math.round(progress)}/>
        </CardDescription>
        <CardAction>
          <Button size={"icon"}>
            <Download className="text-green-500" />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

export default MusicCard;
