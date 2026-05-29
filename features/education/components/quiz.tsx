"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/features/education/data/courses";

export type QuizResult = { answered: number; total: number; correct: number };

export function Quiz({
  questions,
  onResult,
}: {
  questions: QuizQuestion[];
  onResult: (result: QuizResult) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  const answered = Object.keys(answers).length;

  useEffect(() => {
    onResult({ answered, total: questions.length, correct });
    // Report whenever the answer set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, correct, questions.length]);

  function select(qid: string, index: number) {
    setAnswers((prev) => (prev[qid] !== undefined ? prev : { ...prev, [qid]: index }));
  }

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, qi) => {
        const selected = answers[q.id];
        const isAnswered = selected !== undefined;
        return (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-bitcoin">
              Fråga {qi + 1} av {questions.length}
            </p>
            <h4 className="mt-1.5 font-heading text-base font-semibold tracking-tight text-foreground">
              {q.question}
            </h4>

            <div className="mt-4 flex flex-col gap-2">
              {q.options.map((option, oi) => {
                const isCorrect = oi === q.answer;
                const isPicked = oi === selected;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => select(q.id, oi)}
                    aria-pressed={isPicked}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      !isAnswered &&
                        "border-border bg-background hover:border-bitcoin/50 hover:bg-bitcoin-muted",
                      isAnswered && isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                      isAnswered &&
                        isPicked &&
                        !isCorrect &&
                        "border-destructive/50 bg-destructive/10",
                      isAnswered &&
                        !isCorrect &&
                        !isPicked &&
                        "border-border opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium",
                        isAnswered && isCorrect
                          ? "text-emerald-300"
                          : isAnswered && isPicked
                            ? "text-destructive"
                            : "text-foreground",
                      )}
                    >
                      {option}
                    </span>
                    {isAnswered && isCorrect ? (
                      <CheckCircle size={18} weight="fill" className="text-emerald-400" aria-hidden />
                    ) : isAnswered && isPicked && !isCorrect ? (
                      <XCircle size={18} weight="fill" className="text-destructive" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isAnswered ? (
              <p
                className={cn(
                  "mt-3 rounded-lg px-3 py-2 text-sm",
                  selected === q.answer
                    ? "bg-emerald-500/10 text-emerald-200"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {selected === q.answer ? "Rätt! " : "Inte riktigt. "}
                {q.explanation}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
