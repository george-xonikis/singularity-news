'use client';

import { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAdminStore } from '@/stores/adminStore';

export function Notifications() {
  const { error, success, clearError, clearSuccess } = useAdminStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => clearSuccess(), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  if (!error && !success) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md animate-slide-in">
          <div className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-3 text-red-500 hover:text-red-700 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md animate-slide-in">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
            <button
              onClick={clearSuccess}
              className="ml-3 text-green-500 hover:text-green-700 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}