import { AuditLogEntry } from '../types';

interface LogTableProps {
  logs: AuditLogEntry[];
}

export default function LogTable({ logs }: LogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 border-dashed py-12 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No audit log entries found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
          <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
            <tr>
              <th scope="col" className="px-6 py-3">Actor / Action</th>
              <th scope="col" className="px-6 py-3">Payload</th>
              <th scope="col" className="px-6 py-3">Chain Linkage</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-black">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {log.actor}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <pre className="max-h-24 max-w-sm overflow-y-auto rounded-lg bg-zinc-50 p-2 text-xs font-mono text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Prev:</span>
                      <span className="truncate max-w-[120px] text-zinc-500 dark:text-zinc-400" title={log.previousHash}>
                        {log.previousHash}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Hash:</span>
                      <span className="truncate max-w-[120px] text-zinc-900 dark:text-zinc-100 font-semibold" title={log.hash}>
                        {log.hash}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
