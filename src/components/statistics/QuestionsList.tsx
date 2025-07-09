'use client';
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react'; // Icons for feedback
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Question } from '@prisma/client';
import { formatTimeDelta } from '@/lib/utils'; // Assuming this is your custom utility to format time

type Props = {
  questions: Question[];
  accuracy: number;
  timeStarted: Date;
  timeEnded: Date;
};

const QuestionsList = ({
  questions,
  accuracy,
  timeStarted,
  timeEnded,
}: Props) => {
  // Format the duration (assuming you have a utility function to format time)
  const formattedDuration = formatTimeDelta(
    Math.floor((timeEnded.getTime() - timeStarted.getTime()) / 1000)
  );

  return (
    <div className='overflow-x-auto mt-8 bg-white p-6 rounded-lg shadow-lg'>
      {/* Accuracy & Duration */}
      <div className='flex justify-between items-center mb-6'>
        <div className='text-center flex-1'>
          <h2 className='text-2xl font-bold text-gray-800 font-mono'>
            Accuracy
          </h2>
          <div
            className={`text-4xl font-semibold
    ${
      accuracy >= 75
        ? 'text-green-600'
        : accuracy >= 50
        ? 'text-yellow-600'
        : 'text-red-600'
    }`}
          >
            {accuracy}%
          </div>
        </div>
        <div className='text-center flex-1'>
          <h2 className='text-2xl font-bold text-gray-800 font-mono'>
            Duration
          </h2>
          <div className='text-3xl font-semibold text-gray-700'>
            {formattedDuration}
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <Table className='min-w-full bg-white shadow-md rounded-lg'>
        <TableCaption className='text-lg font-semibold text-center mb-4'></TableCaption>
        <TableHeader>
          <TableRow className=' text-white'>
            <TableHead className='py-4 px-6'>No.</TableHead>
            <TableHead className='py-4 px-6'>
              Question & Correct Answer
            </TableHead>
            <TableHead className='py-4 px-6'>Your Answer</TableHead>

            {questions[0].questionType === 'open_ended' && (
              <TableHead className='py-4 px-6 text-right'>Accuracy</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map(
            (
              { answer, question, userAnswer, percentageCorrect, isCorrect },
              index
            ) => {
              return (
                <TableRow
                  key={index}
                  className='border-b border-gray-200 bg-gray-50 hover:bg-gray-100'
                >
                  <TableCell className='py-4 px-6'>{index + 1}</TableCell>
                  <TableCell className='py-4 px-6'>
                    <div className='font-semibold text-gray-800'>
                      {question}
                    </div>
                    <div className='text-sm text-gray-600 mt-2'>
                      <span className='text-indigo-500'>Correct Answer:</span>{' '}
                      <span className='font-semibold text-green-600'>
                        {answer}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`py-4 px-6 font-semibold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      {isCorrect ? (
                        <CheckCircle className='text-green-600' size={20} />
                      ) : (
                        <XCircle className='text-red-600' size={20} />
                      )}
                      {userAnswer}
                    </div>
                  </TableCell>

                  {percentageCorrect && (
                    <TableCell className='py-4 px-6 text-right text-sm'>
                      <span className='text-yellow-600 font-semibold'>
                        {percentageCorrect}%
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsList;
