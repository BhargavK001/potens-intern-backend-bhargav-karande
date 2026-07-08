import { AuditLogRepository } from '../repositories/AuditLogRepository.js';
import type { AuditLogQuery, ExportResult } from '../types/log.js';

export class ExportService {
  constructor(private readonly repository = new AuditLogRepository()) {}

  /**
   * Generates administrative log export files in CSV or custom JSON format.
   * Currently exports are generated fully in-memory; streaming exports are designated as a future scalability enhancement.
   */
  async exportLogs(filters: AuditLogQuery, format: 'csv' | 'json'): Promise<ExportResult> {
    const logs = await this.repository.findFiltered(filters);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `audit_logs_${timestamp}.${format}`;

    if (format === 'json') {
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          filterApplied: {
            actor: filters.actor || null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
          },
          recordCount: logs.length,
          notice: 'Only a complete chronological export can be fully verified. Filtered exports intentionally omit intermediate chain entries and therefore cannot independently prove ledger integrity.',
        },
        logs: logs.map(entry => ({
          id: entry.id,
          actor: entry.actor,
          action: entry.action,
          payload: entry.payload,
          previousHash: entry.previousHash,
          hash: entry.hash,
          createdAt: entry.createdAt,
        })),
      };

      return {
        content: JSON.stringify(exportData, null, 2),
        contentType: 'application/json',
        filename,
      };
    } else {
      // CSV format
      const headers = ['id', 'actor', 'action', 'payload', 'previousHash', 'hash', 'createdAt'];

      const escapeCsvValue = (val: any): string => {
        if (val === null || val === undefined) {
          return '""';
        }
        let strValue = val instanceof Date ? val.toISOString() : (typeof val === 'object' ? JSON.stringify(val) : String(val));
        // Protect against spreadsheet formula injection (=, +, -, @)
        if (/^[=\+\-@]/.test(strValue)) {
          strValue = "'" + strValue;
        }
        return `"${strValue.replace(/"/g, '""')}"`;
      };

      const csvLines = logs.map(entry => {
        const row = [
          entry.id,
          entry.actor,
          entry.action,
          entry.payload,
          entry.previousHash,
          entry.hash,
          entry.createdAt,
        ];
        return row.map(escapeCsvValue).join(',');
      });

      // UTF-8 BOM prefix for Microsoft Excel compatibility (\uFEFF)
      const content = '\uFEFF' + [headers.join(','), ...csvLines].join('\n');

      return {
        content,
        contentType: 'text/csv',
        filename,
      };
    }
  }
}
