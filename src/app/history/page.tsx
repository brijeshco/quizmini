import HistoryComponent from '@/components/HistoryComponent';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { LucideLayoutDashboard } from 'lucide-react';

type Props = {};

const History = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect('/');
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r flex flex-row items-center justify-center gap-6 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg'>
      {/* Main Content Wrapper */}
      <div className='w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-6'>
        {/* Title & Navigation */}
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-semibold text-gray-800 dark:text-white font-mono'>
            History
          </h1>
          <Link
            href='/dashboard'
            className={`${buttonVariants({
              variant: 'outline',
              size: 'sm',
            })} text-gray-800 dark:text-white border-gray-400 dark:border-gray-500`}
          >
            Back to Dashboard
          </Link>
        </div>

        {/* History Component */}
        <div className='overflow-auto max-h-[60vh] bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
          <HistoryComponent limit={100} userId={session.user.id} />
        </div>
      </div>
    </div>
  );
};

export default History;
