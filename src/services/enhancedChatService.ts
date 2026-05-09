/**
 * Enhanced Chat Service
 * Extends chatbotService with feedback, escalation, and session management
 */

import { logger } from '@/utils/logger';

export interface ChatFeedbackPayload {
  session_id: string;
  message_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  helpful: boolean;
  feedback_type: 'accurate' | 'unclear' | 'inappropriate' | 'other';
  feedback_text?: string;
  would_recommend: boolean;
}

export interface ChatFeedbackResponse {
  id: string;
  session_id: string;
  message_id: string;
  rating: number;
  feedback_type: string;
  created_at: string;
  status: 'recorded';
}

export interface EscalateToConsultantPayload {
  session_id: string;
  user_id?: string;
  user_nickname: string;
  reason: 'safety' | 'complex' | 'request';
  urgency: 'normal' | 'high' | 'critical';
  safety_flags_triggered: string[];
  current_message: string;
}

export interface ConsultantAssignment {
  id?: string;
  name?: string;
  availability?: 'available' | 'busy' | 'offline';
}

export interface EscalateToConsultantResponse {
  support_request_id: string;
  session_id: string;
  status: 'waiting' | 'assigned' | 'active' | 'resolved';
  created_at: string;
  estimated_wait_time: number;
  assigned_consultant?: ConsultantAssignment;
  queue_position: number;
}

export interface ChatSessionMessage {
  id: string;
  role: 'user' | 'bot' | 'consultant';
  content: string;
  timestamp: string;
  citations?: Array<{
    title?: string;
    source?: string;
    excerpt?: string;
  }>;
  safety_flags?: Array<{
    label: string;
    severity: string;
    message: string;
  }>;
}

export interface ChatSessionHistoryResponse {
  session_id: string;
  user_id?: string;
  created_at: string;
  last_message_at: string;
  duration_seconds: number;
  language: string;
  total_messages: number;
  messages: ChatSessionMessage[];
  topics_discussed: string[];
  safety_summary: {
    flags_triggered: number;
    escalations: number;
    crisis_interventions: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const CHAT_BASE_PATH = '/v1/chat';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required for chat endpoints.');
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(accessToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
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

    if (Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return String(item);
          }
          const detail = item as Record<string, unknown>;
          const location = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
          const message = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return location ? `${location}: ${message}` : message;
        })
        .join('; ');
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

export class EnhancedChatService {
  /**
   * POST /v1/chat/feedback - Submit feedback on chatbot responses
   */
  static async submitChatFeedback(
    payload: ChatFeedbackPayload,
  ): Promise<ChatFeedbackResponse> {
    try {
      const response = await fetch(buildUrl(`${CHAT_BASE_PATH}/feedback`), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<ChatFeedbackResponse>(response);
    } catch (error) {
      logger.error('Failed to submit chat feedback', error);
      // Don't re-throw feedback errors - they shouldn't break the chat experience
      return {
        id: `feedback-${Date.now()}`,
        session_id: payload.session_id,
        message_id: payload.message_id,
        rating: payload.rating,
        feedback_type: payload.feedback_type,
        created_at: new Date().toISOString(),
        status: 'recorded',
      };
    }
  }

  /**
   * POST /v1/chat/escalate - Escalate chat session to human consultant
   */
  static async escalateToConsultant(
    payload: EscalateToConsultantPayload,
  ): Promise<EscalateToConsultantResponse> {
    try {
      const response = await fetch(buildUrl(`${CHAT_BASE_PATH}/escalate`), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<EscalateToConsultantResponse>(response);
    } catch (error) {
      logger.error('Failed to escalate chat to consultant', error);
      throw error;
    }
  }

  /**
   * GET /v1/chat/session/{session_id} - Get chat session history
   */
  static async getChatSessionHistory(
    sessionId: string,
    options?: {
      limit?: number;
      offset?: number;
      include_metadata?: boolean;
    },
    accessToken?: string,
  ): Promise<ChatSessionHistoryResponse> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));
    if (options?.include_metadata) params.append('include_metadata', String(options.include_metadata));

    const url = `${buildUrl(`${CHAT_BASE_PATH}/session/${sessionId}`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<ChatSessionHistoryResponse>(response);
    } catch (error) {
      logger.error(`Failed to get chat session history for ${sessionId}`, error);
      throw error;
    }
  }
}
