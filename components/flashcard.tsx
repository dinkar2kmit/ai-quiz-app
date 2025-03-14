"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FlashCard } from "@/lib/types";

interface FlashcardProps {
  card: FlashCard;
  index: number;
}

export default function Flashcard({ card, index }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full aspect-[3/2] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full h-full"
          >
            <Card className="w-full h-full flex items-center justify-center p-6 text-lg font-bold bg-white text-black">
              <CardContent className="p-0">{card.question}</CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full h-full"
          >
            <Card className="w-full h-full flex items-center justify-center p-6 text-lg bg-secondary">
              <CardContent className="p-0">{card.answer}</CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
