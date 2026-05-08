/**
 * Suggestions Service
 * Handles conversation suggestions/prompts
 * Endpoint: GET /v1/suggestions
 */

import { logger } from '@/utils/logger';

export interface SuggestionsRequest {
  language?: string;
  context?: string;
  limit?: number;
}

export interface SuggestionsResponse {
  suggestions: string[];
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  ''
).trim();

const SUGGESTIONS_PATH = '/v1/suggestions';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(): Record<string, string> {
  return {
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

export class SuggestionsService {
  /**
   * GET /v1/suggestions - Get conversation starter suggestions
   */
  static async getSuggestions(
    params?: SuggestionsRequest,
  ): Promise<SuggestionsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.language) {
      searchParams.append('language', params.language);
    }
    if (params?.context) {
      searchParams.append('context', params.context);
    }
    if (params?.limit) {
      searchParams.append('limit', String(params.limit));
    }

    const url = `${buildUrl(SUGGESTIONS_PATH)}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<SuggestionsResponse>(response);
    } catch (error) {
      logger.warn('Failed to fetch suggestions from API, using fallback', error);
      // Return fallback suggestions if API fails
      return this.getFallbackSuggestions(params?.language);
    }
  }

  /**
   * Fallback suggestions for when API is unavailable
   */
  private static getFallbackSuggestions(language?: string): SuggestionsResponse {
    const suggestions: Record<string, string[]> = {
      en: [
        'Can you help me with stress management?',
        'Tell me about anxiety coping strategies',
        'How can I improve my sleep?',
        'What are some breathing exercises?'
      ],
      twi: [
        'Medɔ no abɔ me abudade',
        'Ka me bɔ abɔ fofor',
        'Woakyerɛ me sɛnea mebu me din',
        'Medɔ no amua ase'
      ],
      ewe: [
        'Kpe ŋu nam be nye modzidzi la',
        'Gblɔ nam subɔsubɔ sia me',
        'Woafia nam alakpɔ dɔwo',
        'Kpe ŋu nam yɔ nye ŋutivɔvɔ'
      ],
      ga: [
        'Fo mi bɔ adwetɔ',
        'Mi bɔ nuo ŋmema dɔforɔ',
        'Fo mi bɔ sɛ ŋmema mo yoo',
        'Mi bɔ onlɔ n-nyɛ'
      ]
    };

    const langSuggestions = suggestions[language || 'en'] || suggestions['en'];
    return { suggestions: langSuggestions };
  }
}

