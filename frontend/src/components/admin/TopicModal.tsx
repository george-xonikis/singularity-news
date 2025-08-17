'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Topic, CreateTopicInput, UpdateTopicInput } from '@singularity-news/shared';
import { buttonStyles } from '@/styles/buttonStyles';

interface TopicModalProps {
  topic?: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTopicInput | UpdateTopicInput, id?: string) => Promise<void>;
}

export function TopicModal({ topic, isOpen, onClose, onSave }: TopicModalProps) {
  const [formData, setFormData] = useState<CreateTopicInput | UpdateTopicInput>({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!topic;

  useEffect(() => {
    if (isOpen) {
      if (topic) {
        // Edit mode - populate with existing data
        setFormData({
          name: topic.name
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: ''
        });
      }
      setError('');
    }
  }, [topic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name?.trim()) {
      setError('Topic name is required');
      return;
    }

    setLoading(true);
    try {
      const data = { name: formData.name.trim() };

      await onSave(data, topic?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save topic');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditMode ? 'Edit Topic' : 'Add New Topic'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="topic-name" className="block text-sm font-medium text-gray-700">
              Topic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="topic-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="e.g., Technology"
              autoFocus
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              A URL-friendly slug will be automatically generated from the name
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={buttonStyles.secondary}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={buttonStyles.primary}
              disabled={loading || !formData.name?.trim()}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Topic')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}