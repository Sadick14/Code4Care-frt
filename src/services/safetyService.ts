/**
 * Safety Service
 * Handles safety events - panic button and crisis detection
 * Endpoints: POST /v1/safety/panic, POST /v1/safety/crisis
 */

import { logger } from '@/utils/logger';

// ========== Panic Event ==========

export interface PanicEventRequest {
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

// ========== Crisis Event ==========

export interface CrisisEventRequest {
  session_id: string;
  conversation_id?: string;
  crisis_type: 'self_harm' | 'suicidal' | 'abuse' | 'emergency';
  confidence: number; // 0.0 - 1.0
  intervention_triggered: boolean;
  escalated_to_human: boolean;
}

export interface CrisisEventResponse {
  id: string;
  session_id: string;
  conversation_id?: string;
  crisis_type: string;
  confidence: number;
  intervention_triggered: boolean;
  escalated_to_human: boolean;
  created_at: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  ''
).trim();

const PANIC_PATH = '/v1/safety/panic';
const CRISIS_PATH = '/v1/safety/crisis';

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

export class SafetyService {
  /**
   * POST /v1/safety/panic - Log panic button event
   */
  static async logPanicEvent(
    payload: PanicEventRequest,
  ): Promise<PanicEventResponse> {
    try {
      const response = await fetch(buildUrl(PANIC_PATH), {
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
      // Return fallback response - safety logging is critical but shouldn't break UX
      return {
        id: `panic-${Date.now()}`,
        session_id: payload.session_id,
        action: payload.action,
        time_active_seconds: payload.time_active_seconds,
        created_at: new Date().toISOString(),
      };
    }
  }

  /**
   * POST /v1/safety/crisis - Log crisis detection event
   */
  static async logCrisisEvent(
    payload: CrisisEventRequest,
  ): Promise<CrisisEventResponse> {
    try {
      const response = await fetch(buildUrl(CRISIS_PATH), {
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
      // Return fallback response - safety logging is critical but shouldn't break UX
      return {
        id: `crisis-${Date.now()}`,
        session_id: payload.session_id,
        conversation_id: payload.conversation_id,
        crisis_type: payload.crisis_type,
        confidence: payload.confidence,
        intervention_triggered: payload.intervention_triggered,
        escalated_to_human: payload.escalated_to_human,
        created_at: new Date().toISOString(),
      };
    }
  }
}
