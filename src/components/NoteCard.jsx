import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function NoteCard({ note }) {
  const { title, subject, description, file_url, created_at } = note;

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <FileText className="h-4 w-4 shrink-0 mt-0.5" />
            <CardTitle className="text-base leading-snug">{title}</CardTitle>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit mt-1">
          {subject}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1">
        {description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description provided.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 border-t">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <Button size="sm" asChild>
          <a href={file_url} target="_blank" rel="noopener noreferrer" download>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
