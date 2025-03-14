import {
  flashcardsSchema,
  questionsSchema,
  writtenQuestionsSchema,
} from "@/lib/schemas";
import { LearningMode } from "@/lib/types";
import WrittenQuiz from "./written-quiz";
import Quiz from "./quiz";
import Flashcard from "./flashcard";
import { Button } from "./ui/button";
import { z } from "zod";

interface QuizContentProps {
  mode: LearningMode;
  title?: string;
  questions:
    | z.infer<typeof questionsSchema>
    | z.infer<typeof writtenQuestionsSchema>
    | z.infer<typeof flashcardsSchema>;
  clearPDF: () => void;
}

const QuizContent = ({
  mode,
  title,
  questions,
  clearPDF,
}: QuizContentProps) => {
  switch (mode) {
    case "choose":
      return (
        <Quiz
          title={title ?? "Quiz"}
          questions={questions as z.infer<typeof questionsSchema>}
          clearPDF={clearPDF}
        />
      );
    case "quiz":
      return (
        <WrittenQuiz
          title={title ?? "Written Quiz"}
          questions={questions as z.infer<typeof writtenQuestionsSchema>}
          clearPDF={clearPDF}
          onComplete={(score) => {
            console.log(`Quiz completed with score: ${score}`);
          }}
        />
      );
    case "flashcards":
      return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {title ?? "Flashcards"}
          </h1>
          <div className="grid gap-8">
            {questions.map((card, index) => (
              <Flashcard key={index} card={card} index={index} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={clearPDF} variant="outline">
              Try Another PDF
            </Button>
          </div>
        </div>
      );
  }
};

export default QuizContent;
