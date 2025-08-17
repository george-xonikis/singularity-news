'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { Topic } from '@singularity-news/shared';

interface SearchableTopicDropdownProps {
  topics: Topic[];
  value: string;
  onChange: (topicName: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function SearchableTopicDropdown({
  topics,
  value,
  onChange,
  placeholder = 'Select a topic',
  className = '',
  error = false
}: SearchableTopicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter topics based on search query
  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get display value - either selected topic name or empty
  const selectedTopic = topics.find(topic => topic.name === value);
  const displayValue = selectedTopic ? selectedTopic.name : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredTopics.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredTopics.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredTopics[highlightedIndex]) {
          onChange(filteredTopics[highlightedIndex].name);
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (topicName: string) => {
    onChange(topicName);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleOptionClick(topic.name)}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100'
                } ${value === topic.name ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
              >
                <div className="font-medium">{topic.name}</div>
                <div className="text-xs text-gray-500">{topic.slug}</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              {searchQuery ? `No topics found for "${searchQuery}"` : 'No topics available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}