import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  variant?: 'default' | 'compact';
}

export function TableHeader({
  children,
  align = 'left',
  variant = 'default'
}: TableHeaderProps) {
  const baseClasses = 'px-6';
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  const variantClasses = {
    default: 'py-4 text-base font-bold text-gray-700',
    compact: 'py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
  };

  return (
    <th className={`${baseClasses} ${alignClasses[align]} ${variantClasses[variant]}`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = '' }: TableCellProps) {
  const baseClasses = 'px-6 py-4 text-sm';
  return (
    <td className={`${baseClasses} ${className}`}>
      {children}
    </td>
  );
}