/**
 * Safety Event Service
 * Handles user-facing event logging for panic button and crisis detection
 * Public endpoints that don't require admin authentication
 */

import { logger } from '@/utils/logger';

const SAFETY_BASE_PATH = '/v1/safety';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required for safety event requests.');
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function readApiError(response: Response): Promise<string> {
  const bodyText = await response.text();
  if (!bodyText) return response.statusText || 'Safety event logging failed';
  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;
    if (typeof parsed.detail === 'string') return parsed.detail;
    if (Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((item) => {
          if (!item || typeof item !== 'object') return String(item);
          const detail = item as Record<string, unknown>;
          const msg = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return msg;
        })
        .join('; ');
    }
    if (typeof parsed.message === 'string') return parsed.message;
  } catch {
    return bodyText;
  }
  return bodyText;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) throw new Error('Empty response body');
  return JSON.parse(text) as T;
}

// Type definitions for panic and crisis events
export interface PanicEventPayload {
  session_id: string;
  action: 'activated' | 'dismissed';
  time_active_seconds?: number;
}

export interface PanicEventResponse {
  id: string;
  session_id: string;
  action: string;
  time_active_seconds?: number;
  created_at: string;
}

export interface CrisisEventPayload {
  session_id: string;
  conversation_id?: string;
  crisis_type: 'severe_distress' | 'self_harm' | 'suicidal_ideation' | 'abuse';
  confidence: number; // 0-1
  intervention_triggered: boolean;
  escalated_to_human: boolean;
}

export interface CrisisEventResponse {
  id: string;
  session_id: string;
  crisis_type: string;
  confidence: number;
  intervention_triggered: boolean;
  escalated_to_human: boolean;
  created_at: string;
}

export class SafetyEventService {
  /**
   * POST /v1/safety/panic - Log a panic button event
   * Used by PanicButton component to log when user presses panic button
   */
  static async logPanicEvent(
    payload: PanicEventPayload,
  ): Promise<PanicEventResponse> {
    const url = buildUrl(`${SAFETY_BASE_PATH}/panic`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<PanicEventResponse>(response);
    } catch (error) {
      logger.error('Failed to log panic event', error);
      throw error;
    }
  }

  /**
   * POST /v1/safety/crisis - Log a crisis detection event
   * Used by chatbot to log when crisis indicators are detected
   */
  static async logCrisisEvent(
    payload: CrisisEventPayload,
  ): Promise<CrisisEventResponse> {
    const url = buildUrl(`${SAFETY_BASE_PATH}/crisis`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<CrisisEventResponse>(response);
    } catch (error) {
      logger.error('Failed to log crisis event', error);
      throw error;
    }
  }
}
