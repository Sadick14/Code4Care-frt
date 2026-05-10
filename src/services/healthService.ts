/**
 * Health Service
 * Handles API health checks and system status
 * Endpoints: GET /health, GET /health/ready, GET /version
 */

import { logger } from '@/utils/logger';

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
}

export interface ReadyResponse {
  ready: boolean;
  database: 'connected' | 'disconnected';
  vector_store: 'ready' | 'not_ready';
  llm: 'available' | 'unavailable';
}

export interface VersionResponse {
  version: string;
  build?: string;
  environment?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const HEALTH_PATH = '/health';
const READY_PATH = '/health/ready';
const VERSION_PATH = '/version';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required for health service requests.');
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

export class HealthService {
  /**
   * GET /health - Check API health status
   */
  static async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await fetch(buildUrl(HEALTH_PATH), {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<HealthResponse>(response);
    } catch (error) {
      logger.error('Failed to check health', error);
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * GET /health/ready - Check if API is ready to accept requests
   */
  static async checkReady(): Promise<ReadyResponse> {
    try {
      const response = await fetch(buildUrl(READY_PATH), {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<ReadyResponse>(response);
    } catch (error) {
      logger.error('Failed to check ready status', error);
      return {
        ready: false,
        database: 'disconnected',
        vector_store: 'not_ready',
        llm: 'unavailable',
      };
    }
  }

  /**
   * GET /version - Get API version information
   */
  static async getVersion(): Promise<VersionResponse> {
    try {
      const response = await fetch(buildUrl(VERSION_PATH), {
        method: 'GET',
        headers: buildHeaders(),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<VersionResponse>(response);
    } catch (error) {
      logger.error('Failed to get version', error);
      return {
        version: 'unknown',
      };
    }
  }
}
