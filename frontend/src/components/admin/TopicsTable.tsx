'use client';

import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Topic } from '@singularity-news/shared';
import { TableHeader, TableCell } from '@/components/ui/TableComponents';

interface TopicsTableProps {
  topics: Topic[];
  onEdit: (topic: Topic) => void;
  onDelete: (id: string) => void;
}

export function TopicsTable({ topics, onEdit, onDelete }: TopicsTableProps) {

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="border-b border-gray-200">
            <TableHeader>
              Name
            </TableHeader>
            <TableHeader>
              Slug
            </TableHeader>
            <TableHeader align="right">
              Actions
            </TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topics.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                No topics found. Create your first topic to get started.
              </td>
            </tr>
          ) : (
            topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>
                  <div className="font-medium text-gray-900 whitespace-nowrap">{topic.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-500 font-mono whitespace-nowrap">{topic.slug}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(topic)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}