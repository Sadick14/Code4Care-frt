/**
 * Comprehensive API Client
 * Centralizes all backend API calls with automatic token management
 */

import { AuthService } from './authService';
import { StaffAccessService } from './staffAccessService';
import { UserManagementService } from './userManagementService';
import { SupportRequestService } from './supportRequestService';
import { RealAnalyticsService } from './realAnalyticsService';
import { EnhancedChatService } from './enhancedChatService';
import { requestChatCompletion } from './chatbotService';
import { logger } from '@/utils/logger';

export interface ApiClientConfig {
  autoRefreshToken?: boolean;
  onTokenExpired?: () => void;
  onUnauthorized?: () => void;
}

export class APIClient {
  private static instance: APIClient;
  private config: ApiClientConfig;

  private constructor(config: ApiClientConfig = {}) {
    this.config = {
      autoRefreshToken: true,
      ...config,
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: ApiClientConfig): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient(config);
    }
    return APIClient.instance;
  }

  /**
   * Initialize client (typically called on app startup)
   */
  static initialize(config?: ApiClientConfig): void {
    APIClient.getInstance(config);
  }

  /**
   * Get potentially refreshed access token
   */
  private async ensureValidToken(): Promise<string> {
    try {
      return await AuthService.getValidAccessToken();
    } catch (error) {
      logger.error('Failed to get valid token', error);
      if (this.config.onTokenExpired) {
        this.config.onTokenExpired();
      }
      throw error;
    }
  }

  /**
   * Handle unauthorized errors
   */
  private handleUnauthorized(): void {
    AuthService.clearTokens();
    if (this.config.onUnauthorized) {
      this.config.onUnauthorized();
    }
  }

  // ========== Authentication APIs ==========

  Auth = {
    /**
     * Store tokens after login
     */
    storeToken: (payload: Parameters<typeof AuthService.storeToken>[0]) => {
      AuthService.storeToken(payload);
    },

    /**
     * Get current access token
     */
    getAccessToken: () => AuthService.getAccessToken(),

    /**
     * Check if authenticated
     */
    isAuthenticated: () => AuthService.isAuthenticated(),

    /**
     * Refresh access token
     */
    refreshToken: () => AuthService.refreshAccessToken(),

    /**
     * Logout
     */
    logout: (accessToken?: string) => AuthService.logout(accessToken),

    /**
     * Clear all tokens
     */
    clearTokens: () => AuthService.clearTokens(),
  };

  // ========== Staff/Admin APIs ==========

  Staff = {
    /**
     * Login staff member
     */
    login: (email: string, password: string) => StaffAccessService.login(email, password),

    /**
     * Get staff session
     */
    getSession: () => StaffAccessService.getSession(),

    /**
     * Set staff session
     */
    setSession: (session: Parameters<typeof StaffAccessService.setSession>[0]) => {
      StaffAccessService.setSession(session);
    },

    /**
     * List all staff
     */
    listStaff: async (accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return StaffAccessService.listStaff(token);
    },

    /**
     * Create staff account
     */
    createStaff: async (
      payload: Parameters<typeof StaffAccessService.createStaffAccount>[0],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return StaffAccessService.createStaffAccount(payload, token);
    },

    /**
     * Update staff account
     */
    updateStaff: async (
      staffId: string,
      payload: Parameters<typeof StaffAccessService.updateStaffAccount>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return StaffAccessService.updateStaffAccount(staffId, payload, token);
    },

    /**
     * Delete staff account
     */
    deleteStaff: async (staffId: string, accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return StaffAccessService.deleteStaffAccount(staffId, token);
    },

    /**
     * Get dashboard stats
     */
    getDashboardStats: async (accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return StaffAccessService.getDashboardStats(token);
    },
  };

  // ========== User Management APIs ==========

  Users = {
    /**
     * List all users
     */
    list: async (options?: Parameters<typeof UserManagementService.listUsers>[0], accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return UserManagementService.listUsers(options, token);
    },

    /**
     * Get user details
     */
    getDetails: async (userId: string, accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return UserManagementService.getUserDetails(userId, token);
    },

    /**
     * Get user chat history
     */
    getChatHistory: async (
      userId: string,
      options?: Parameters<typeof UserManagementService.getUserChatHistory>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return UserManagementService.getUserChatHistory(userId, options, token);
    },

    /**
     * Update user
     */
    update: async (
      userId: string,
      payload: Parameters<typeof UserManagementService.updateUser>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return UserManagementService.updateUser(userId, payload, token);
    },

    /**
     * Delete user
     */
    delete: async (
      userId: string,
      payload: Parameters<typeof UserManagementService.deleteUser>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return UserManagementService.deleteUser(userId, payload, token);
    },
  };

  // ========== Support Request APIs ==========

  SupportRequests = {
    /**
     * Create support request
     */
    create: (payload: Parameters<typeof SupportRequestService.createSupportRequest>[0]) => {
      return SupportRequestService.createSupportRequest(payload);
    },

    /**
     * List support requests
     */
    list: async (
      options?: Parameters<typeof SupportRequestService.listSupportRequests>[0],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.listSupportRequests(options, token);
    },

    /**
     * Get request details
     */
    getDetails: async (requestId: string, accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.getSupportRequestDetails(requestId, token);
    },

    /**
     * Update request
     */
    update: async (
      requestId: string,
      payload: Parameters<typeof SupportRequestService.updateSupportRequest>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.updateSupportRequest(requestId, payload, token);
    },

    /**
     * Assign request
     */
    assign: async (
      requestId: string,
      payload: Parameters<typeof SupportRequestService.assignSupportRequest>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.assignSupportRequest(requestId, payload, token);
    },

    /**
     * Resolve request
     */
    resolve: async (
      requestId: string,
      payload: Parameters<typeof SupportRequestService.resolveSupportRequest>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.resolveSupportRequest(requestId, payload, token);
    },

    /**
     * Close request
     */
    close: async (
      requestId: string,
      payload: Parameters<typeof SupportRequestService.closeSupportRequest>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return SupportRequestService.closeSupportRequest(requestId, payload, token);
    },
  };

  // ========== Analytics APIs ==========

  Analytics = {
    /**
     * Get dashboard summary
     */
    getDashboard: async (
      options?: Parameters<typeof RealAnalyticsService.getDashboardSummary>[0],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return RealAnalyticsService.getDashboardSummary(options, token);
    },

    /**
     * Get topic analytics
     */
    getTopics: async (options?: Parameters<typeof RealAnalyticsService.getTopicAnalytics>[0], accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return RealAnalyticsService.getTopicAnalytics(options, token);
    },

    /**
     * Get user analytics
     */
    getUsers: async (options?: Parameters<typeof RealAnalyticsService.getUserAnalytics>[0], accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return RealAnalyticsService.getUserAnalytics(options, token);
    },

    /**
     * Get safety analytics
     */
    getSafety: async (options?: Parameters<typeof RealAnalyticsService.getSafetyAnalytics>[0], accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return RealAnalyticsService.getSafetyAnalytics(options, token);
    },

    /**
     * Get performance metrics
     */
    getPerformance: async (options?: Parameters<typeof RealAnalyticsService.getPerformanceMetrics>[0], accessToken?: string) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return RealAnalyticsService.getPerformanceMetrics(options, token);
    },

    /**
     * Record session analytics
     */
    recordSession: (payload: Parameters<typeof RealAnalyticsService.recordSessionAnalytics>[0]) => {
      return RealAnalyticsService.recordSessionAnalytics(payload);
    },
  };

  // ========== Chat APIs ==========

  Chat = {
    /**
     * Get chat completion
     */
    getCompletion: (payload: Parameters<typeof requestChatCompletion>[0]) => {
      return requestChatCompletion(payload);
    },

    /**
     * Submit chat feedback
     */
    submitFeedback: (payload: Parameters<typeof EnhancedChatService.submitChatFeedback>[0]) => {
      return EnhancedChatService.submitChatFeedback(payload);
    },

    /**
     * Escalate to consultant
     */
    escalate: (payload: Parameters<typeof EnhancedChatService.escalateToConsultant>[0]) => {
      return EnhancedChatService.escalateToConsultant(payload);
    },

    /**
     * Get session history
     */
    getSessionHistory: async (
      sessionId: string,
      options?: Parameters<typeof EnhancedChatService.getChatSessionHistory>[1],
      accessToken?: string,
    ) => {
      const token = accessToken || (this.config.autoRefreshToken ? await this.ensureValidToken() : undefined);
      return EnhancedChatService.getChatSessionHistory(sessionId, options, token);
    },
  };
}

// Export singleton instance factory
export function getApiClient(config?: ApiClientConfig): APIClient {
  return APIClient.getInstance(config);
}

// Export all individual services for granular usage if needed
export {
  AuthService,
  StaffAccessService,
  UserManagementService,
  SupportRequestService,
  RealAnalyticsService,
  EnhancedChatService,
};
