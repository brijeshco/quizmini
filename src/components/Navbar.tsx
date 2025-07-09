import Link from 'next/link';
import React from 'react';
import { getAuthSession } from '@/lib/nextauth';
import UserAccountNav from './UserAccountNav';
import { ThemeToggle } from './ThemeToggle';
import SignInButton from './SignInButton';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className='fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md'>
      <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Logo Section */}
        <div className='flex items-center space-x-4'>
          <Link href={'/'}>
            <p className='text-3xl font-semibold tracking-wide text-white uppercase hover:text-blue-200 transition-colors'>
              MiniQuiz
            </p>
          </Link>
        </div>

        {/* Right Section (Theme Toggle, User Account, Sign In) */}
        <div className='flex items-center space-x-4'>
          <ThemeToggle className='text-2xl' />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text={'Sign In'} />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className='md:hidden flex items-center'>
          <button className='text-white text-3xl'>☰</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
