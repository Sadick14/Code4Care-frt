/**
 * Feedback Service
 * Handles user feedback on bot responses - POST /v1/feedback
 */

import { logger } from '@/utils/logger';

export interface FeedbackRequest {
  session_id: string;
  message_id?: string;
  rating: number; // 1-5
  comment?: string;
}

export interface FeedbackResponse {
  status: 'received';
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  ''
).trim();

const FEEDBACK_PATH = '/v1/feedback';

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

export class FeedbackService {
  /**
   * POST /v1/feedback - Submit user feedback on bot response
   */
  static async submitFeedback(
    payload: FeedbackRequest,
  ): Promise<FeedbackResponse> {
    try {
      const response = await fetch(buildUrl(FEEDBACK_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<FeedbackResponse>(response);
    } catch (error) {
      logger.error('Failed to submit feedback', error);
      // Don't throw - feedback errors shouldn't break user experience
      return { status: 'received' };
    }
  }
}
