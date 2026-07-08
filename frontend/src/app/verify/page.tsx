'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../lib/api';
import { VerificationResult } from '../../types';

export default function VerifyPage() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const runVerification = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<any, VerificationResult>('/verify');
      setResult(data);
      if (data.status === 'PASS') {
        toast.success('Ledger integrity verified successfully. Chain intact!');
      } else {
        toast.error('Ledger hash chain validation failed! Inconsistency detected.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify ledger integrity');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runVerification();
  }, []);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Ledger Chain Verification"
        description="Trigger cryptographic chain traversal checks. The engine re-computes hashes from the Genesis block to ensure immutability."
      >
        <button
          onClick={runVerification}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Re-Verify
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-zinc-200 rounded-xl dark:bg-black dark:border-zinc-800">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-zinc-200 dark:border-zinc-50 dark:border-t-zinc-950" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Performing validation checks...</p>
        </div>
      ) : result ? (
        <div className="space-y-6">
          <div className={`flex flex-col items-center justify-center p-8 rounded-xl border text-center ${
            result.status === 'PASS'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400'
              : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400'
          }`}>
            {result.status === 'PASS' ? (
              <ShieldCheck className="h-16 w-16 mb-4 text-emerald-600 dark:text-emerald-500" />
            ) : (
              <ShieldAlert className="h-16 w-16 mb-4 text-red-650 dark:text-red-500" />
            )}

            <h2 className="text-xl font-bold">
              Ledger Status: {result.status === 'PASS' ? 'INTEGRAL' : 'COMPROMISED'}
            </h2>
            <p className="text-sm mt-1 max-w-md text-zinc-500 dark:text-zinc-400">
              {result.status === 'PASS'
                ? 'All block link connections are intact. Ledger immutability holds true.'
                : 'A cryptographic break or hash inconsistency has been identified in the chain.'}
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-200 dark:bg-black dark:border-zinc-800 dark:divide-zinc-800">
            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Status</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                result.status === 'PASS'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {result.status === 'PASS' ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Pass
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    Fail
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Blocks Checked</span>
              <span className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                {result.entriesChecked}
              </span>
            </div>

            {result.status === 'FAIL' && (
              <>
                <div className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Broken Block ID</span>
                  <span className="text-xs font-mono font-semibold text-red-600 dark:text-red-400">
                    {result.brokenEntryId}
                  </span>
                </div>
                <div className="flex justify-between items-center px-6 py-4">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Failure Signature Code</span>
                  <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                    {result.reason}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center px-6 py-4">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Verification Timestamp</span>
              <span className="text-sm font-mono text-zinc-900 dark:text-zinc-50">
                {new Date(result.verifiedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
          No verification logs available. Run validation above.
        </div>
      )}
    </div>
  );
}
