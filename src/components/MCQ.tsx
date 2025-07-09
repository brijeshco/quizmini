'use client';
import { Game, Question } from '@prisma/client';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { differenceInSeconds } from 'date-fns';
import Link from 'next/link';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import { checkAnswerSchema, endGameSchema } from '@/schemas/questions';
import { cn, formatTimeDelta } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { useToast } from './ui/use-toast';

type Props = {
  game: Game & { questions: Pick<Question, 'id' | 'options' | 'question'>[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [now, setNow] = useState(new Date());
  const [isHydrated, setIsHydrated] = useState(false); // To track if the component is hydrated

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { toast } = useToast();
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  // Client-side timer effect
  useEffect(() => {
    // Set isHydrated to true once the component is mounted (after SSR)
    setIsHydrated(true);

    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date()); // Update time every second
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = useMemo(() => {
    return () => {
      checkAnswer(undefined, {
        onSuccess: ({ isCorrect }) => {
          if (isCorrect) {
            setStats((stats) => ({
              ...stats,
              correct_answers: stats.correct_answers + 1,
            }));
            toast({
              title: 'Correct',
              description: 'You got it right!',
              variant: 'success',
            });
          } else {
            setStats((stats) => ({
              ...stats,
              wrong_answers: stats.wrong_answers + 1,
            }));
            toast({
              title: 'Incorrect',
              description: 'You got it wrong!',
              variant: 'destructive',
            });
          }
          if (questionIndex === game.questions.length - 1) {
            endGame();
            setHasEnded(true);
            return;
          }
          setQuestionIndex((questionIndex) => questionIndex + 1);
        },
      });
    };
  }, [checkAnswer, questionIndex, game.questions.length, toast, endGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === '1') setSelectedChoice(0);
      else if (key === '2') setSelectedChoice(1);
      else if (key === '3') setSelectedChoice(2);
      else if (key === '4') setSelectedChoice(3);
      else if (key === 'Enter') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  // Prevent hydration mismatch by ensuring that the dynamic content
  // (e.g., timer) only appears after hydration.
  if (!isHydrated) {
    return null; // Return null until hydration is complete
  }

  if (hasEnded) {
    return (
      <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400'>
        <div className='bg-white p-10 rounded-2xl shadow-lg text-center max-w-[500px]'>
          <h2 className='text-4xl font-semibold text-teal-600 mb-4'>
            Congratulations!
          </h2>
          <p className='text-xl text-gray-600 mb-6'>
            You completed the game in{' '}
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </p>
          <div className='flex justify-between'>
            <Link
              href={`/statistics/${game.id}`}
              className={cn(
                'bg-green-500 text-white px-6 py-3 rounded-full shadow-md',
                'hover:bg-green-600 transition-colors'
              )}
            >
              View Stats
            </Link>
            <Button
              variant='outline'
              className='px-6 py-3 text-lg bg-gray-100 text-teal-500 rounded-full shadow-md hover:bg-gray-200 transition-colors'
              onClick={() => window.location.reload()}
            >
              Restart Game
              <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-col'>
          <p>
            <span className='text-slate-400'>Topic</span> &nbsp;
            <span className='px-2 py-1 text-white rounded-lg bg-slate-800'>
              {game.topic}
            </span>
          </p>
        </div>

        <div className='flex items-center text-slate-400'>
          <Timer className='mr-2' color='red' size={32} />
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center w-full mt-4'>
        <Card className='w-full'>
          <CardHeader className='flex flex-row items-center'>
            <CardTitle className='mr-5 text-center'>
              <div>{questionIndex + 1}</div>
              <div className='text-base text-slate-400'>
                {game.questions.length}
              </div>
            </CardTitle>
            <CardDescription className='flex-grow text-lg'>
              {currentQuestion?.question}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className='flex flex-col items-center justify-center w-full mt-4'>
          {options.map((option, index) => (
            <Button
              key={option}
              variant={selectedChoice === index ? 'default' : 'outline'}
              className='justify-start w-full py-8 mb-4'
              onClick={() => setSelectedChoice(index)}
            >
              <div className='flex items-center'>
                <div className='p-2 px-3 mr-5 border rounded-md'>
                  {index + 1}
                </div>
                <div>{option}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-between w-full mt-4'>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />

        <Button
          variant='default'
          className='mt-2'
          size='lg'
          disabled={isChecking || hasEnded}
          onClick={handleNext}
        >
          {isChecking && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Next <ChevronRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
