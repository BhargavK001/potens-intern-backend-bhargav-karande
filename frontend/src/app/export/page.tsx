'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import { api } from '../../lib/api';

export default function ExportPage() {
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<{ actor?: string; startDate?: string; endDate?: string }>({});

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Use the modified Axios client with responseType: 'blob' config
      const blob = await api.get<any, Blob>('/export', {
        params: {
          actor: filters.actor,
          startDate: filters.startDate ? new Date(filters.startDate).toISOString() : undefined,
          endDate: filters.endDate ? new Date(filters.endDate).toISOString() : undefined,
          format,
        },
        responseType: 'blob',
      });

      // Construct browser-compatible blob file URL and click simulation
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('download', `ledger_export_${timestamp}.${format}`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup the elements
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Ledger audit logs exported in ${format.toUpperCase()} successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Export Ledger Audit Logs"
        description="Filter ledger database events and extract them into downloadable JSON or CSV spreadsheets."
      />

      <div className="bg-white p-6 rounded-xl border border-zinc-200 space-y-6 dark:bg-black dark:border-zinc-800">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-400">1. Apply Query Filters</h3>
          <FilterBar onFilter={handleFilterChange} isLoading={isLoading} />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-400">2. Select Export Format</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
                format === 'json'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-300 text-zinc-500 bg-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-400 dark:bg-black'
              }`}
            >
              <FileJson className="h-5 w-5 text-amber-500" />
              <span>JSON Format</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
                format === 'csv'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-300 text-zinc-500 bg-white dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-400 dark:bg-black'
              }`}
            >
              <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
              <span>CSV Format</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Download className="h-4 w-4" />
          {isLoading ? 'Preparing export file...' : `Download ${format.toUpperCase()} Export`}
        </button>
      </div>
    </div>
  );
}
