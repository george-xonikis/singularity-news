/**
 * Centralized button styles for consistency across the application
 */

export const buttonStyles = {
  // Primary button - main CTA actions
  primary: 'px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed',

  // Secondary button - alternative actions
  secondary: 'px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',

  // Ghost button - minimal styling
  ghost: 'text-gray-600 hover:text-gray-900 transition-colors cursor-pointer',

  // Icon button - for icon-only buttons
  icon: 'p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer',

  // Danger button - destructive actions
  danger: 'px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed',

  // Link button - looks like a link
  link: 'text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors',

  // Tab button - for tab navigation
  tab: (isActive: boolean) => `py-2 px-4 border-b-2 font-medium text-sm cursor-pointer transition-all ${
    isActive
      ? 'border-indigo-500 text-indigo-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }`,

  // Toggle button - for switching between modes
  toggle: (isActive: boolean) => `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
    isActive
      ? 'bg-indigo-100 text-indigo-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  }`,

  // Pagination button
  pagination: (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) return 'px-3 py-1 text-gray-400 cursor-not-allowed';
    if (isActive) return 'px-3 py-1 bg-indigo-600 text-white rounded cursor-pointer';
    return 'px-3 py-1 text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition-colors';
  }
};