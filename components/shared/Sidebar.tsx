"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/conastants'

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className='sidebar'>
      <div className='flex flex-col gap-4'>
        <Link href='/' className='sidebar-logo flex items-center gap-4'>
          <Image 
            src="/assets/images/logo-text.svg"
            alt="Imaginet"
            width={140}
            height={28}
            priority
          />
        </Link>

        <SignedIn>
          <nav className='sidebar-nav'>
            <ul className='sidebar-nav_elements'>
              {navLinks.slice(0, -2).map((link) => {
                const isActive = pathname === link.route;

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                  }`}>
                    <Link href={link.route} className='sidebar-link'>
                      <Image 
                        src={link.icon}
                        alt={link.label}
                        width={16}
                        height={16}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <ul className='sidebar-nav_elements'>
              {navLinks.slice(-2).map((link) => {
                const isActive = pathname === link.route;

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                  }`}>
                    <Link href={link.route} className='sidebar-link'>
                      <Image 
                        src={link.icon}
                        alt={link.label}
                        width={16}
                        height={16}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}

              <li className='flex-center cursor-pointer gap-2 p-4'>
                <UserButton afterSignOutUrl='/' showName={true} />
              </li>
            </ul>
          </nav>
        </SignedIn>

        <SignedOut>
          <div className='flex-center flex-col gap-3'>
            <Link href="/sign-in">
              <button className='btn btn-primary'>
                Login
              </button>
            </Link>
            <Link href="/sign-up">
              <button className='btn btn-secondary'>
                Sign Up
              </button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  )
}

export default Sidebar