'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  onFilter: (filters: { actor?: string; startDate?: string; endDate?: string }) => void;
  isLoading?: boolean;
}

export default function FilterBar({ onFilter, isLoading = false }: FilterBarProps) {
  const [actor, setActor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      actor: actor.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClear = () => {
    setActor('');
    setStartDate('');
    setEndDate('');
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-zinc-50 p-4 rounded-xl border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Actor search filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="actor-filter" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Actor
          </label>
          <input
            id="actor-filter"
            type="text"
            placeholder="Search by actor name..."
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-100"
          />
        </div>

        {/* Start Date filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-date-filter" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Start Date
          </label>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-100"
          />
        </div>

        {/* End Date filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="end-date-filter" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            End Date
          </label>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-100"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || (!actor && !startDate && !endDate)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Search className="h-3.5 w-3.5" />
          {isLoading ? 'Searching...' : 'Apply Filters'}
        </button>
      </div>
    </form>
  );
}
