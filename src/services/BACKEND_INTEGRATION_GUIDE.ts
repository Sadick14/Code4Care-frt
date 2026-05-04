/**
 * BACKEND API INTEGRATION GUIDE
 * Code4Care Frontend - Backend API Service Implementation
 * 
 * This guide explains how to use the backend API services
 * that have been implemented according to BACKEND_API_SPECIFICATION.md
 */

// ============================================================================
// 1. INITIALIZATION & SETUP
// ============================================================================

/**
 * Initialize the API Client at app startup (in AppProvider or main.tsx)
 */
import { APIClient } from '@/services/apiClient';

APIClient.initialize({
  autoRefreshToken: true,
  onTokenExpired: () => {
    // Redirect to login or show notification
    console.warn('Session token expired');
  },
  onUnauthorized: () => {
    // Handle unauthorized access
    console.warn('User unauthorized');
  },
});

// ============================================================================
// 2. AUTHENTICATION
// ============================================================================

import { AuthService, StaffAccessService } from '@/services';

/**
 * Login Flow Example
 */
async function loginExample() {
  try {
    // 1. Call login endpoint
    const session = await StaffAccessService.login('admin@example.com', 'password123');

    // 2. Store tokens
    if (session.accessToken && session.refreshToken) {
      AuthService.storeToken({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        token_type: session.tokenType || 'Bearer',
        expires_in: session.expiresIn || 3600,
        user: session.user,
      });
    }

    // 3. Store session info (for dashboard access)
    StaffAccessService.setSession(session);

    return session;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Token Management
 */
// Check if user is authenticated
const isAuthenticated = AuthService.isAuthenticated();

// Get current access token
const token = AuthService.getAccessToken();

// Manually refresh token
await AuthService.refreshAccessToken();

// Logout
await AuthService.logout();

// ============================================================================
// 3. STAFF/ADMIN MANAGEMENT
// ============================================================================

import { StaffAccessService } from '@/services';

/**
 * Get all staff members
 */
async function listStaffExample() {
  try {
    const accessToken = AuthService.getAccessToken();
    const staffList = await StaffAccessService.listStaff(accessToken);
    console.log('Staff:', staffList);
  } catch (error) {
    console.error('Failed to list staff:', error);
  }
}

/**
 * Create new staff member
 */
async function createStaffExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const newStaff = await StaffAccessService.createStaffAccount(
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+233 24 123 4567',
        role: 'consultant',
        password: 'SecurePassword123!',
      },
      accessToken,
    );

    console.log('Staff created:', newStaff);
  } catch (error) {
    console.error('Failed to create staff:', error);
  }
}

/**
 * Update staff member
 */
async function updateStaffExample(staffId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const updated = await StaffAccessService.updateStaffAccount(
      staffId,
      {
        name: 'Sarah Johnson',
        email: 'sarah.new@example.com',
        role: 'supervisor',
        isActive: true,
      },
      accessToken,
    );

    console.log('Staff updated:', updated);
  } catch (error) {
    console.error('Failed to update staff:', error);
  }
}

// ============================================================================
// 4. USER MANAGEMENT
// ============================================================================

import { UserManagementService } from '@/services';

/**
 * List all users with filtering
 */
async function listUsersExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const userList = await UserManagementService.listUsers(
      {
        page: 1,
        limit: 50,
        status: 'active',
        age_range: '15-19',
        region: 'Greater Accra',
        sort_by: 'last_active',
        sort_order: 'desc',
      },
      accessToken,
    );

    console.log('Users:', userList);
  } catch (error) {
    console.error('Failed to list users:', error);
  }
}

/**
 * Get detailed user information
 */
async function getUserDetailsExample(userId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const userDetails = await UserManagementService.getUserDetails(userId, accessToken);

    console.log('User details:', {
      id: userDetails.id,
      nickname: userDetails.nickname,
      statistics: userDetails.statistics,
      safety_profile: userDetails.safety_profile,
      engagement: userDetails.engagement,
    });
  } catch (error) {
    console.error('Failed to get user details:', error);
  }
}

/**
 * Get user chat history
 */
async function getUserChatHistoryExample(userId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const chatHistory = await UserManagementService.getUserChatHistory(
      userId,
      {
        limit: 50,
        offset: 0,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-12-31T23:59:59Z',
      },
      accessToken,
    );

    console.log('Chat history:', {
      total: chatHistory.total_messages,
      messages: chatHistory.messages,
    });
  } catch (error) {
    console.error('Failed to get chat history:', error);
  }
}

/**
 * Update user status
 */
async function updateUserExample(userId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const updated = await UserManagementService.updateUser(
      userId,
      {
        status: 'suspended',
        reason_for_change: 'Safety concern detected',
        follow_up_required: true,
        follow_up_date: '2024-02-01T10:00:00Z',
      },
      accessToken,
    );

    console.log('User updated:', updated);
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

// ============================================================================
// 5. SUPPORT REQUESTS
// ============================================================================

import { SupportRequestService } from '@/services';

/**
 * Create support request (typically called when escalating from chat)
 */
async function createSupportRequestExample() {
  try {
    const supportRequest = await SupportRequestService.createSupportRequest({
      user_id: 'session-123',
      user_nickname: 'SilentThinker',
      age_range: '15-19',
      gender_identity: 'female',
      region: 'Greater Accra',
      language: 'en',
      request_type: 'escalation',
      reason: 'safety',
      urgency: 'critical',
      chat_context: {
        topic: 'self-harm concerns',
        last_message: 'I feel like hurting myself',
        session_id: 'session-123',
      },
      safety_flags_triggered: ['self-harm'],
    });

    console.log('Support request created:', supportRequest);
  } catch (error) {
    console.error('Failed to create support request:', error);
  }
}

/**
 * List support requests
 */
async function listSupportRequestsExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const requests = await SupportRequestService.listSupportRequests(
      {
        page: 1,
        limit: 20,
        status: 'waiting',
        urgency: 'high',
        sort_by: 'created_at',
      },
      accessToken,
    );

    console.log('Support requests:', {
      total: requests.total,
      waiting: requests.waiting_total,
      high_priority: requests.high_priority,
      requests: requests.requests,
    });
  } catch (error) {
    console.error('Failed to list support requests:', error);
  }
}

/**
 * Assign support request to staff
 */
async function assignRequestExample(requestId: string, staffId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const assigned = await SupportRequestService.assignSupportRequest(
      requestId,
      {
        staff_id: staffId,
        auto_start: false,
      },
      accessToken,
    );

    console.log('Request assigned:', assigned);
  } catch (error) {
    console.error('Failed to assign request:', error);
  }
}

/**
 * Resolve support request
 */
async function resolveRequestExample(requestId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const resolved = await SupportRequestService.resolveSupportRequest(
      requestId,
      {
        resolution_notes: 'User connected with mental health resources',
        satisfaction_rating: 5,
        follow_up_required: false,
      },
      accessToken,
    );

    console.log('Request resolved:', resolved);
  } catch (error) {
    console.error('Failed to resolve request:', error);
  }
}

// ============================================================================
// 6. CHAT & ESCALATION
// ============================================================================

import { EnhancedChatService, requestChatCompletion } from '@/services';

/**
 * Get chat completion from AI
 */
async function getChatCompletionExample() {
  try {
    const response = await requestChatCompletion({
      message: 'What should I know about contraception?',
      language: 'en',
      session_id: 'session-123',
    });

    console.log('Chat response:', {
      answer: response.answer,
      citations: response.citations,
      safety_flags: response.safety_flags,
      response_time_ms: response.response_time_ms,
    });
  } catch (error) {
    console.error('Failed to get chat completion:', error);
  }
}

/**
 * Submit feedback on chat response
 */
async function submitChatFeedbackExample() {
  try {
    const feedback = await EnhancedChatService.submitChatFeedback({
      session_id: 'session-123',
      message_id: 'msg-456',
      rating: 5,
      helpful: true,
      feedback_type: 'accurate',
      would_recommend: true,
    });

    console.log('Feedback recorded:', feedback);
  } catch (error) {
    console.error('Failed to submit feedback:', error);
  }
}

/**
 * Escalate chat to human consultant
 */
async function escalateToChatConsultantExample() {
  try {
    const escalation = await EnhancedChatService.escalateToConsultant({
      session_id: 'session-123',
      user_nickname: 'SilentThinker',
      reason: 'safety',
      urgency: 'critical',
      safety_flags_triggered: ['self-harm', 'suicidal'],
      current_message: 'I cannot cope anymore',
    });

    console.log('Escalated to consultant:', {
      support_request_id: escalation.support_request_id,
      status: escalation.status,
      queue_position: escalation.queue_position,
      estimated_wait_time: escalation.estimated_wait_time,
    });
  } catch (error) {
    console.error('Failed to escalate to consultant:', error);
  }
}

/**
 * Get chat session history
 */
async function getChatSessionHistoryExample(sessionId: string) {
  try {
    const accessToken = AuthService.getAccessToken();

    const history = await EnhancedChatService.getChatSessionHistory(
      sessionId,
      {
        limit: 100,
        include_metadata: true,
      },
      accessToken,
    );

    console.log('Chat history:', {
      total_messages: history.total_messages,
      topics: history.topics_discussed,
      safety_summary: history.safety_summary,
      messages: history.messages,
    });
  } catch (error) {
    console.error('Failed to get chat history:', error);
  }
}

// ============================================================================
// 7. ANALYTICS
// ============================================================================

import { RealAnalyticsService } from '@/services';

/**
 * Get dashboard analytics
 */
async function getDashboardAnalyticsExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const analytics = await RealAnalyticsService.getDashboardSummary(
      {
        period: 'week',
        by_region: true,
        by_age_group: true,
      },
      accessToken,
    );

    console.log('Dashboard analytics:', {
      total_users: analytics.summary.total_active_users,
      conversations: analytics.summary.total_conversations,
      messages: analytics.summary.total_messages,
      demographics: analytics.demographics,
      safety: analytics.safety,
    });
  } catch (error) {
    console.error('Failed to get analytics:', error);
  }
}

/**
 * Get topic engagement analytics
 */
async function getTopicAnalyticsExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const topics = await RealAnalyticsService.getTopicAnalytics(
      {
        period: 'week',
        limit: 20,
      },
      accessToken,
    );

    console.log('Topic analytics:', topics.topics);
  } catch (error) {
    console.error('Failed to get topic analytics:', error);
  }
}

/**
 * Get safety analytics
 */
async function getSafetyAnalyticsExample() {
  try {
    const accessToken = AuthService.getAccessToken();

    const safety = await RealAnalyticsService.getSafetyAnalytics(
      {
        period: 'month',
      },
      accessToken,
    );

    console.log('Safety analytics:', {
      total_incidents: safety.incidents.total,
      escalations: safety.escalations,
      trends: safety.trends,
    });
  } catch (error) {
    console.error('Failed to get safety analytics:', error);
  }
}

/**
 * Record session analytics (called after session ends)
 */
async function recordSessionAnalyticsExample() {
  try {
    const recorded = await RealAnalyticsService.recordSessionAnalytics({
      session_id: 'session-123',
      user_id: 'user-456',
      age_range: '15-19',
      gender_identity: 'female',
      region: 'Greater Accra',
      language: 'en',
      start_time: '2024-01-15T10:00:00Z',
      end_time: '2024-01-15T10:23:00Z',
      duration_seconds: 1380,
      messages_exchanged: 12,
      topics_discussed: ['contraception', 'puberty'],
      panic_button_used: false,
      crisis_support_accessed: false,
      story_modules_started: 1,
      story_modules_completed: 0,
      pharmacy_searches: 2,
      satisfaction_rating: 4,
      would_return: true,
      safety_flags: [],
    });

    console.log('Session analytics recorded:', recorded);
  } catch (error) {
    console.error('Failed to record session analytics:', error);
  }
}

// ============================================================================
// 8. USING THE API CLIENT (Recommended Approach)
// ============================================================================

import { getApiClient } from '@/services';

/**
 * Using the centralized API client with automatic token management
 */
async function usingApiClientExample() {
  const api = getApiClient();

  try {
    // Authentication
    const session = await api.Staff.login('admin@example.com', 'password');
    api.Auth.storeToken({
      access_token: session.accessToken!,
      refresh_token: session.refreshToken!,
      token_type: 'Bearer',
      expires_in: session.expiresIn || 3600,
    });

    // Staff operations (tokens auto-managed)
    const staff = await api.Staff.listStaff();
    console.log('Staff:', staff);

    // User operations (tokens auto-managed)
    const users = await api.Users.list({ page: 1, limit: 50 });
    console.log('Users:', users);

    // Support requests (tokens auto-managed)
    const requests = await api.SupportRequests.list({
      status: 'waiting',
    });
    console.log('Support requests:', requests);

    // Analytics (tokens auto-managed)
    const dashboard = await api.Analytics.getDashboard({ period: 'week' });
    console.log('Analytics:', dashboard);

    // Chat operations (no token needed)
    const chatResponse = await api.Chat.getCompletion({
      message: 'Question about contraception',
      language: 'en',
      session_id: 'session-123',
    });
    console.log('Chat response:', chatResponse);

    // Escalate to consultant
    const escalation = await api.Chat.escalate({
      session_id: 'session-123',
      user_nickname: 'User',
      reason: 'safety',
      urgency: 'critical',
      safety_flags_triggered: ['self-harm'],
      current_message: 'Help me',
    });
    console.log('Escalation:', escalation);
  } catch (error) {
    console.error('API error:', error);
  }
}

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

import { AuthService } from '@/services';

/**
 * Error handling with token refresh
 */
async function robustApiCallExample() {
  try {
    // This will automatically refresh token if expired
    const accessToken = await AuthService.getValidAccessToken();

    // Make API call with valid token
    const user = await UserManagementService.getUserDetails('user-123', accessToken);

    console.log('User:', user);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Session expired')) {
      // Redirect to login
      console.log('Redirecting to login...');
    } else {
      console.error('API error:', error);
    }
  }
}

// ============================================================================
// SUMMARY OF SERVICES
// ============================================================================

/**
 * AUTHENTICATION
 * - AuthService: Token management, refresh, logout
 * 
 * STAFF/ADMIN
 * - StaffAccessService: Login, staff CRUD, dashboard stats
 * 
 * USERS
 * - UserManagementService: User list, details, chat history, updates
 * 
 * SUPPORT REQUESTS
 * - SupportRequestService: Create, list, assign, resolve, close
 * 
 * CHAT
 * - EnhancedChatService: Feedback, escalation, session history
 * - requestChatCompletion: AI chat completion
 * 
 * ANALYTICS
 * - RealAnalyticsService: Dashboard, topics, users, safety, performance
 * 
 * CENTRALIZED CLIENT
 * - APIClient: Unified interface with automatic token management
 */

export {};
