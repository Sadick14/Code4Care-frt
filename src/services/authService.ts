/**
 * Authentication Utilities Service
 * Handles token management, refresh, and session lifecycle
 */

import { logger } from '@/utils/logger';
import { safeStorage } from '@/utils/safeStorage';

export interface TokenPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    last_login_at: string;
  };
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const API_BASE_URL = (
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).trim();

const TOKEN_KEY = 'code4care_access_token';
const REFRESH_TOKEN_KEY = 'code4care_refresh_token';
const TOKEN_EXPIRY_KEY = 'code4care_token_expiry';
const ADMIN_REFRESH_TOKEN_PATH = '/admin/refresh-token';
const ADMIN_LOGOUT_PATH = '/admin/logout';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
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

function calculateTokenExpiry(expiresIn: number): string {
  // expiresIn is in seconds, calculate when token will expire
  const expiryTime = new Date().getTime() + expiresIn * 1000;
  return expiryTime.toString();
}

function isTokenExpired(accessToken?: string): boolean {
  if (!accessToken) {
    return true;
  }

  const expiryTime = safeStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) {
    return true;
  }

  const expiryTimestamp = parseInt(expiryTime, 10);
  const currentTime = new Date().getTime();
  // Consider token expired if 5 minutes or less remaining
  const bufferTime = 5 * 60 * 1000;

  return currentTime > expiryTimestamp - bufferTime;
}

export class AuthService {
  /**
   * Store token after login
   */
  static storeToken(payload: TokenPayload): void {
    try {
      safeStorage.setItem(TOKEN_KEY, payload.access_token);
      safeStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh_token);
      safeStorage.setItem(TOKEN_EXPIRY_KEY, calculateTokenExpiry(payload.expires_in));
      logger.debug('Token stored successfully');
    } catch (error) {
      logger.error('Failed to store token', error);
    }
  }

  /**
   * Get current access token
   */
  static getAccessToken(): string | null {
    return safeStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get current refresh token
   */
  static getRefreshToken(): string | null {
    return safeStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Check if current token is expired
   */
  static isTokenExpired(): boolean {
    const accessToken = this.getAccessToken();
    return isTokenExpired(accessToken);
  }

  /**
   * POST /admin/refresh-token - Refresh access token using refresh token
   */
  static async refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available. Please log in again.');
    }

    try {
      const response = await fetch(buildUrl(ADMIN_REFRESH_TOKEN_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          refresh_token: refreshToken,
        } satisfies RefreshTokenPayload),
      });

      if (!response.ok) {
        // If refresh fails, clear tokens
        this.clearTokens();
        throw new Error(await readApiError(response));
      }

      const data = await readJsonResponse<RefreshTokenResponse>(response);

      // Update stored access token and expiry
      safeStorage.setItem(TOKEN_KEY, data.access_token);
      safeStorage.setItem(TOKEN_EXPIRY_KEY, calculateTokenExpiry(data.expires_in));

      logger.debug('Token refreshed successfully');
      return data;
    } catch (error) {
      logger.error('Failed to refresh token', error);
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Get access token, refreshing if expired
   */
  static async getValidAccessToken(): Promise<string> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated. Please log in.');
    }

    if (this.isTokenExpired()) {
      try {
        const refreshed = await this.refreshAccessToken();
        return refreshed.access_token;
      } catch (error) {
        logger.error('Token refresh failed', error);
        this.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    }

    return accessToken;
  }

  /**
   * POST /admin/logout - Invalidate session tokens
   */
  static async logout(accessToken?: string): Promise<void> {
    const token = accessToken || this.getAccessToken();

    if (token) {
      try {
        await fetch(buildUrl(ADMIN_LOGOUT_PATH), {
          method: 'POST',
          headers: buildHeaders(token),
          body: JSON.stringify({
            access_token: token,
          }),
        });
      } catch (error) {
        logger.error('Logout API call failed (continuing with local cleanup)', error);
        // Continue with local cleanup even if API call fails
      }
    }

    // Always clear local tokens
    this.clearTokens();
  }

  /**
   * Clear all stored tokens
   */
  static clearTokens(): void {
    try {
      safeStorage.removeItem(TOKEN_KEY);
      safeStorage.removeItem(REFRESH_TOKEN_KEY);
      safeStorage.removeItem(TOKEN_EXPIRY_KEY);
      logger.debug('Tokens cleared');
    } catch (error) {
      logger.error('Failed to clear tokens', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken && !this.isTokenExpired();
  }

  /**
   * Get time remaining on token (in seconds)
   */
  static getTokenTimeRemaining(): number {
    const expiryTime = safeStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!expiryTime) {
      return 0;
    }

    const expiryTimestamp = parseInt(expiryTime, 10);
    const currentTime = new Date().getTime();
    const timeRemaining = Math.max(0, expiryTimestamp - currentTime);

    return Math.floor(timeRemaining / 1000); // Convert to seconds
  }
}
