import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';

type Props = {
  correct_answers: number;
  wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
  return (
    <Card className='flex flex-row items-center justify-center gap-6 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg'>
      {/* Correct Answers Section */}
      <div className='flex flex-col items-center'>
        <div className='flex items-center justify-center p-2 rounded-full bg-white'>
          <CheckCircle color='green' size={32} />
        </div>
        <span className='mt-2 text-3xl font-semibold text-white'>
          {correct_answers}
        </span>
        <span className='text-xs text-white opacity-70'>Correct</span>
      </div>

      {/* Separator */}
      <Separator orientation='vertical' className='h-16 border-white' />

      {/* Wrong Answers Section */}
      <div className='flex flex-col items-center'>
        <div className='flex items-center justify-center p-2 rounded-full bg-white'>
          <XCircle color='red' size={32} />
        </div>
        <span className='mt-2 text-3xl font-semibold text-white'>
          {wrong_answers}
        </span>
        <span className='text-xs text-white opacity-70'>Wrong</span>
      </div>
    </Card>
  );
};

export default MCQCounter;
