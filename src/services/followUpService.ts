/**
 * Follow-up Service
 * Handles follow-up contact requests
 * Endpoint: POST /v1/followup
 */

import { logger } from '@/utils/logger';

export interface FollowUpRequestRequest {
  session_id: string;
  conversation_id?: string;
  contact_method: 'sms' | 'phone' | 'email';
  contact_info: string;
  requested_topic?: string;
}

export interface FollowUpRequestResponse {
  id: string;
  followup_id: string;
  session_id: string;
  conversation_id?: string;
  contact_method: string;
  contact_info: string;
  requested_topic?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  ''
).trim();

const FOLLOWUP_PATH = '/v1/followup';

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

export class FollowUpService {
  /**
   * POST /v1/followup - Create a follow-up contact request
   */
  static async createFollowUpRequest(
    payload: FollowUpRequestRequest,
  ): Promise<FollowUpRequestResponse> {
    try {
      const response = await fetch(buildUrl(FOLLOWUP_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<FollowUpRequestResponse>(response);
    } catch (error) {
      logger.error('Failed to create follow-up request', error);
      throw error;
    }
  }
}
