/**
 * Report Service
 * Handles reporting harmful or incorrect responses - POST /v1/report
 */

import { logger } from '@/utils/logger';

export interface ReportRequest {
  session_id: string;
  message_id?: string;
  reason: string;
}

export interface ReportResponse {
  status: 'received';
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  ''
).trim();

const REPORT_PATH = '/v1/report';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

async function readApiError(response: Response): Promise<string> {
  const bodyText = await response.text();

  if (!bodyText) {
    return response.statusText || 'API request failed';
  }

  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;

    if (typeof parsed.detail === 'string') {
      return parsed.detail;
    }

    if (typeof parsed.message === 'string') {
      return parsed.message;
    }
  } catch {
    return bodyText;
  }

  return bodyText;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export class ReportService {
  /**
   * POST /v1/report - Report harmful or incorrect bot response
   */
  static async submitReport(
    payload: ReportRequest,
  ): Promise<ReportResponse> {
    try {
      const response = await fetch(buildUrl(REPORT_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<ReportResponse>(response);
    } catch (error) {
      logger.error('Failed to submit report', error);
      // Don't throw - report errors shouldn't break user experience
      return { status: 'received' };
    }
  }
}
