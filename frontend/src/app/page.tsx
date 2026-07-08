import Link from 'next/link';
import { PlusCircle, ListTodo, ClipboardCheck, Download, Server, Cpu, Database } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Home() {
  const adminCards = [
    {
      href: '/create',
      title: 'Create Log Entry',
      description: 'Append a new cryptographically chained audit log entry to the ledger database.',
      icon: PlusCircle,
      badge: 'POST /api/v1/log',
    },
    {
      href: '/logs',
      title: 'View Ledger Logs',
      description: 'Search, filter, and inspect chronological records in the log list database.',
      icon: ListTodo,
      badge: 'GET /api/v1/logs',
    },
    {
      href: '/verify',
      title: 'Verify Chain Integrity',
      description: 'Run hash calculations across the database to detect potential chain breaches.',
      icon: ClipboardCheck,
      badge: 'GET /api/v1/verify',
    },
    {
      href: '/export',
      title: 'Export Audit Log',
      description: 'Extract and download logs matching custom filter parameters as CSV or JSON.',
      icon: Download,
      badge: 'GET /api/v1/export',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Control Center"
        description="Administrative portal for interacting with the Tamper-Evident Audit Log Ledger."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Ledger API status</div>
            <div className="text-sm font-semibold">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Database Engine</div>
            <div className="text-sm font-semibold">PostgreSQL (Prisma)</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Cryptographic Mode</div>
            <div className="text-sm font-semibold">SHA-256 Chain</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Audit Status</div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">Immutable</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-900 hover:shadow-sm dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-100"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg border border-zinc-200 p-2.5 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:border-zinc-800 dark:text-zinc-50 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-350">
                    {card.badge}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {card.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {card.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                Configure View &rarr;
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
