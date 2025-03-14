import { Button } from "@/components/ui/button";
import { LearningMode } from "@/lib/types";
import { Brain, CheckCircle, FlipHorizontal } from "lucide-react";

interface ModeSelectorProps {
  selectedMode: LearningMode;
  onModeSelect: (mode: LearningMode) => void;
}

export default function ModeSelector({
  selectedMode,
  onModeSelect,
}: ModeSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-4">
        Select Learning Mode
      </h2>
      <div className="flex gap-4 justify-center pb-12 border-b border-white">
        <Button
          className="p-6 text-[16px]"
          variant={selectedMode === "quiz" ? "default" : "outline"}
          onClick={() => onModeSelect("quiz")}
        >
          <Brain className="mr-2 h-4 w-4" />
          Write
        </Button>
        <Button
          className="p-6 text-[16px]"
          variant={selectedMode === "choose" ? "default" : "outline"}
          onClick={() => onModeSelect("choose")}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Choose
        </Button>
        <Button
          className="p-6 text-[16px]"
          variant={selectedMode === "flashcards" ? "default" : "outline"}
          onClick={() => onModeSelect("flashcards")}
        >
          <FlipHorizontal className="mr-2 h-4 w-4" />
          {/* <Cards  /> */}
          Flashcards
        </Button>
      </div>
    </div>
  );
}
