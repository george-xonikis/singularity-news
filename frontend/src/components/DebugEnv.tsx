'use client';

import { BE_API_URL } from '@/config/env';

export default function DebugEnv() {

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-800 rounded-lg shadow-xl p-4 min-w-[400px] max-h-[80vh] overflow-y-auto">

      <h3 className="font-bold text-lg mb-3 text-gray-800">Environment Variables Debug</h3>

      <div className="space-y-2">
        <div>
          <span className="font-semibold">BE_API_URL:</span> {BE_API_URL || 'undefined'}
        </div>
        <div>
          <span className="font-semibold">ΝΕΧΤ_VERCEL_ENV:</span> {process.env.ΝΕΧΤ_VERCEL_ENV || 'undefined'}
        </div>
        <div>
          <span className="font-semibold">NODE_ENV:</span> {process.env.NODE_ENV || 'undefined'}
        </div>
        <div>
          <span className="font-semibold">NEXT_BE_API_URL:</span> {process.env.NEXT_BE_API_URL || 'undefined'}
        </div>
      </div>

    </div>
  );
}