'use client';

import { useState } from 'react';
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TopicsTable } from '@/components/admin/TopicsTable';
import { TopicModal } from '@/components/admin/TopicModal';
import { TopicService } from '@/services/topicService';
import { useTopicStore } from '@/stores/topicStore';
import { useAdminStore } from '@/stores/adminStore';
import { useObservableSubscription } from '@/hooks/useObservableSubscription';
import { topics$ } from '@/stores/observables/topics$';
import type { Topic, CreateTopicInput, UpdateTopicInput } from '@singularity-news/shared';
import { buttonStyles } from '@/styles/buttonStyles';

export default function TopicsPage() {
  const { topics, refetch } = useTopicStore();
  const { setSuccess, setError } = useAdminStore();
  const [modalState, setModalState] = useState<{ isOpen: boolean; topic?: Topic | null }>({
    isOpen: false,
    topic: null
  });
  const [loading, setLoading] = useState(false);

  // Subscribe to topics observable
  useObservableSubscription(topics$);

  const openAddModal = () => {
    setModalState({ isOpen: true, topic: null });
  };

  const openEditModal = (topic: Topic) => {
    setModalState({ isOpen: true, topic });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, topic: null });
  };

  const handleSaveTopic = async (data: CreateTopicInput | UpdateTopicInput, id?: string) => {
    try {
      if (id) {
        // Edit existing topic
        await TopicService.updateTopic(id, data as UpdateTopicInput);
        setSuccess('Topic updated successfully');
      } else {
        // Create new topic
        await TopicService.createTopic(data as CreateTopicInput);
        setSuccess('Topic created successfully');
      }
      refetch(); // Trigger refetch through the store
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save topic';
      setError(message);
      throw error; // Re-throw to handle in modal
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!id) {
      setError('Topic ID is required');
      return;
    }

    try {
      setLoading(true);
      await TopicService.deleteTopic(id);
      setSuccess('Topic deleted successfully');
      refetch(); // Trigger refetch through the store
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete topic';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Topics Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage article categories and topics
              </p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className={`${buttonStyles.primary} flex items-center`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Topic
          </button>
        </div>
      </div>

      {/* Topics Table */}
      <TopicsTable
        topics={topics}
        onEdit={openEditModal}
        onDelete={handleDeleteTopic}
      />

      {/* Add/Edit Modal */}
      <TopicModal
        topic={modalState.topic}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSaveTopic}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      )}
    </div>
  );
}