"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { writtenQuestionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";

interface WrittenQuizProps {
  questions: z.infer<typeof writtenQuestionsSchema>;
  title: string;
  clearPDF: () => void;
  onComplete: (score: number) => void;
}

export default function WrittenQuiz({
  questions,
  title,
  clearPDF,
  onComplete,
}: WrittenQuizProps) {
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateSimilarity = (
    userAnswer: string,
    correctAnswer: string
  ): number => {
    // Simple similarity check - you might want to use a more sophisticated approach
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/);

    let matches = 0;
    correctWords.forEach((word) => {
      if (userWords.includes(word)) matches++;
    });

    return (matches / correctWords.length) * 100;
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (answers.some((answer) => !answer.trim())) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    // Calculate scores for each answer
    const questionScores = questions.map((question, index) => {
      const similarity = calculateSimilarity(answers[index], question.answer);
      return Math.round(similarity);
    });

    setScores(questionScores);
    setSubmitted(true);

    // Calculate overall score
    const averageScore = Math.round(
      questionScores.reduce((acc, score) => acc + score, 0) /
        questionScores.length
    );
    onComplete(averageScore);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={index} className="space-y-4 pb-12 border-b border-white">
            <h3 className="text-xl font-semibold">Question {index + 1}</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {question.question}
            </p>

            <textarea
              placeholder="Type your answer here..."
              value={answers[index]}
              onChange={(e: { target: { value: string } }) =>
                handleAnswerChange(index, e.target.value)
              }
              disabled={submitted}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {submitted && (
              <div className="mt-4">
                <p className="font-semibold">Score: {scores[index]}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Correct answer: {question.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {!submitted ? (
          <Button onClick={handleSubmit}>Submit Answers</Button>
        ) : (
          <Button onClick={clearPDF} variant="outline">
            Try Another PDF
          </Button>
        )}
      </div>
    </div>
  );
}
