'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { History } from 'lucide-react';

type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className='hover:cursor-pointer hover:opacity-75  flex flex-row items-center justify-center gap-6 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg'
      onClick={() => {
        router.push('/history');
      }}
    >
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-2xl font-bold'>History</CardTitle>
      </CardHeader>
      {/* <CardContent>
        <p className='text-sm text-muted-foreground'>
          Check history quiz attempts.
        </p>
      </CardContent> */}
    </Card>
  );
};

export default HistoryCard;
