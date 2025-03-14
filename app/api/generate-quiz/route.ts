import {
  questionSchema,
  questionsSchema,
  writtenQuestionSchema,
  writtenQuestionsSchema,
  flashcardSchema,
  flashcardsSchema,
} from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, mode } = await req.json();
  const firstFile = files[0].data;

  const promptMap = {
    quiz: "Create a written quiz with 4 questions based on this document. Each question should have a specific, concise answer.",
    choose:
      "Create a multiple choice test with 4 questions based on the content of the document. Each option should be roughly equal in length.",
    flashcards:
      "Create 4 flashcards based on this document. Each flashcard should have a question on one side and a concise answer on the other.",
  };

  const schemaMap = {
    quiz: writtenQuestionSchema,
    choose: questionSchema,
    flashcards: flashcardSchema,
  };

  const validationSchemaMap = {
    quiz: writtenQuestionsSchema,
    choose: questionsSchema,
    flashcards: flashcardsSchema,
  };

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: "You are a teacher creating learning materials.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: promptMap[mode as keyof typeof promptMap],
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: schemaMap[mode as keyof typeof schemaMap],
    output: "array",
    onFinish: ({ object }) => {
      const res =
        validationSchemaMap[mode as keyof typeof validationSchemaMap].safeParse(
          object
        );
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
