'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { PlusCircle, CheckCircle, Info } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../lib/api';
import { AuditLogEntry } from '../../types';

const createSchema = z.object({
  actor: z.string()
    .trim()
    .min(1, 'Actor is required')
    .max(100, 'Actor cannot exceed 100 characters'),
  action: z.string()
    .trim()
    .min(1, 'Action is required')
    .max(100, 'Action cannot exceed 100 characters'),
  payloadString: z.string()
    .trim()
    .min(1, 'Payload is required')
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }, {
      message: 'Payload must be a valid, non-null, non-array JSON object (e.g. {"key": "value"})',
    }),
});

type FormValues = z.infer<typeof createSchema>;

export default function CreateLogPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [createdEntry, setCreatedEntry] = useState<AuditLogEntry | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      actor: '',
      action: '',
      payloadString: '{\n  "resource": "ledger",\n  "status": "active"\n}',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setCreatedEntry(null);

    try {
      const payload = JSON.parse(data.payloadString);
      const logEntry = await api.post<any, AuditLogEntry>('/log', {
        actor: data.actor,
        action: data.action,
        payload,
      });

      setCreatedEntry(logEntry);
      toast.success('Audit log entry created and chained successfully!');
      reset();
    } catch (err: any) {
      toast.error(err.message || 'Failed to append log entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Append Audit Log"
        description="Insert a new event log entry. The backend will calculate its cryptographic hash based on the previous block's hash."
      />

      <div className="grid gap-6 md:grid-cols-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-zinc-200 dark:bg-black dark:border-zinc-800">
          <div className="space-y-1.5">
            <label htmlFor="actor" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Actor
            </label>
            <input
              id="actor"
              type="text"
              placeholder="e.g. system-admin or user@domain.com"
              disabled={isLoading}
              {...register('actor')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none dark:bg-zinc-900/50 dark:text-zinc-50 ${
                errors.actor
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100'
              }`}
            />
            {errors.actor && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                {errors.actor.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="action" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Action
            </label>
            <input
              id="action"
              type="text"
              placeholder="e.g. user.login or document.delete"
              disabled={isLoading}
              {...register('action')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none dark:bg-zinc-900/50 dark:text-zinc-50 ${
                errors.action
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100'
              }`}
            />
            {errors.action && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                {errors.action.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="payloadString" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Payload (JSON)
            </label>
            <textarea
              id="payloadString"
              rows={5}
              placeholder="Type valid JSON object..."
              disabled={isLoading}
              {...register('payloadString')}
              className={`w-full rounded-lg border px-3.5 py-2.5 font-mono text-xs text-zinc-900 focus:outline-none dark:bg-zinc-900/50 dark:text-zinc-50 ${
                errors.payloadString
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-zinc-200 focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100'
              }`}
            />
            {errors.payloadString && (
              <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                {errors.payloadString.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <PlusCircle className="h-4 w-4" />
            {isLoading ? 'Creating log entry...' : 'Append Log Entry'}
          </button>
        </form>

        {createdEntry && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl space-y-4 dark:bg-emerald-950/20 dark:border-emerald-900">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Ledger Verification Details</h3>
            </div>
            <div className="grid gap-3 text-xs font-mono">
              <div className="flex flex-col gap-1 border-b border-emerald-100 pb-2 dark:border-emerald-900/30">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Log ID</span>
                <span className="text-zinc-900 dark:text-zinc-100">{createdEntry.id}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-emerald-100 pb-2 dark:border-emerald-900/30">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Hash</span>
                <span className="text-zinc-900 dark:text-zinc-100 break-all">{createdEntry.hash}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-emerald-100 pb-2 dark:border-emerald-900/30">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Previous Hash</span>
                <span className="text-zinc-900 dark:text-zinc-100 break-all">{createdEntry.previousHash}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Created At</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {new Date(createdEntry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
