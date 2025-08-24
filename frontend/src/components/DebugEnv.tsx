'use client';

import { BE_API_URL } from '@/config/env';

export default function DebugEnv() {
  // Get all environment variables that are available
  const envVars = Object.entries(process.env).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-800 rounded-lg shadow-xl p-4 min-w-[400px] max-h-[80vh] overflow-y-auto">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Environment Variables Debug</h3>

      <div className="space-y-2 text-sm">
        <div className="p-2 bg-red-50 rounded mb-3">
          <span className="font-semibold text-red-700 block mb-1">Configured BE_API_URL:</span>
          <span className="font-mono text-red-600 text-xs break-all">{BE_API_URL}</span>
        </div>

        <div className="p-2 bg-yellow-50 rounded">
          <span className="font-semibold text-gray-600 block mb-1">Build Time:</span>
          <span className="font-mono text-yellow-700 text-xs">{new Date().toISOString()}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="font-bold text-gray-800 mb-2">All Process.env Variables ({envVars.length}):</h4>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {envVars.length === 0 ? (
              <div className="p-2 bg-gray-100 rounded">
                <span className="text-xs text-gray-500">No environment variables available</span>
              </div>
            ) : (
              envVars.map(([key, value]) => (
                <div key={key} className="p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="font-semibold text-gray-700 text-xs block">{key}:</span>
                  <span className="font-mono text-gray-600 text-xs break-all">
                    {value || '(empty)'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="font-semibold text-gray-600 mb-2">Looking for:</h4>
          <div className="space-y-1 text-xs">
            <div className="p-1 bg-blue-50 rounded">
              <span className="font-mono">VERCEL_ENV = {process.env.VERCEL_ENV || 'NOT FOUND'}</span>
            </div>
            <div className="p-1 bg-blue-50 rounded">
              <span className="font-mono">BE_API_URL = {process.env.BE_API_URL || 'NOT FOUND'}</span>
            </div>
            <div className="p-1 bg-blue-50 rounded">
              <span className="font-mono">NEXT_PUBLIC_BE_API_URL = {process.env.NEXT_PUBLIC_BE_API_URL || 'NOT FOUND'}</span>
            </div>
            <div className="p-1 bg-blue-50 rounded">
              <span className="font-mono">NODE_ENV = {process.env.NODE_ENV || 'NOT FOUND'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}