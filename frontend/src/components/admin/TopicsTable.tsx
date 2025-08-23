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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100">
            <tr className="border-b border-slate-200">
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
          <tbody>
            {topics.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No topics found. Create your first topic to get started.
                </td>
              </tr>
            ) : (
              topics.map((topic, index) => (
                <tr 
                  key={topic.id} 
                  className={`${index !== topics.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 cursor-pointer transition-colors duration-150`}
                >
                  <TableCell>
                    <div className="font-medium text-slate-900 whitespace-nowrap">{topic.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-600 font-mono whitespace-nowrap">{topic.slug}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(topic)}
                        className="text-amber-600 hover:text-amber-700 p-1 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
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
    </div>
  );
}