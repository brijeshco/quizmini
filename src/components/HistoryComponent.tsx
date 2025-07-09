import { prisma } from '@/lib/db';
import { Clock, CopyCheck, Edit2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { formatDistanceToNow } from 'date-fns'; // A nice helper for formatting the date dynamically

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: 'desc',
    },
  });

  return (
    <div className='space-y-8'>
      {games.map((game) => (
        <div
          key={game.id}
          className='bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'
        >
          <div className='flex items-center space-x-4'>
            {/* Icon */}
            <div
              className={`p-3 rounded-full ${
                game.gameType === 'mcq' ? 'bg-primary' : 'bg-secondary'
              } text-primary-foreground`}
            >
              {game.gameType === 'mcq' ? (
                <CopyCheck className='w-6 h-6' />
              ) : (
                <Edit2 className='w-6 h-6' />
              )}
            </div>

            {/* Game Info */}
            <div className='flex-1'>
              <Link
                href={`/statistics/${game.id}`}
                className='text-2xl font-semibold text-card-foreground hover:text-accent-foreground transition-colors'
              >
                {game.topic}
              </Link>

              {/* Game time */}
              <p className='text-sm text-muted-foreground mt-2'>
                <Clock className='inline-block w-4 h-4 mr-2 text-muted-foreground' />
                {formatDistanceToNow(new Date(game.timeEnded ?? 0))} ago
              </p>

              {/* Game type */}
              <p className='mt-2 text-sm text-muted-foreground'>
                {game.gameType === 'mcq' ? (
                  <span className='bg-primary text-primary-foreground py-1 px-2 rounded-full text-xs'>
                    Multiple Choice
                  </span>
                ) : (
                  <span className='bg-secondary text-secondary-foreground py-1 px-2 rounded-full text-xs'>
                    Open-Ended
                  </span>
                )}
              </p>
            </div>

            {/* Add a quick preview button */}
            <Link
              href={`/statistics/${game.id}`}
              className='inline-flex items-center justify-center py-2 px-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent-foreground hover:text-card'
            >
              View Stats
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryComponent;
