'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileMenuWrapperProps {
  children: React.ReactNode;
}

export default function MobileMenuWrapper({ children }: MobileMenuWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile sidebar overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              </button>
              {/*<span className="text-lg font-semibold">ΜΕΝΟΥ</span>*/}
              <div className="w-10"></div>
            </div>
            <div onClick={() => setIsMenuOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}