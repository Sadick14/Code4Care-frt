/**
 * Services Index
 * Central export point for all API and service modules
 */

// Core API Client
export { APIClient, getApiClient } from './apiClient';
export type { ApiClientConfig } from './apiClient';

// Authentication Service
export { AuthService } from './authService';
export type { TokenPayload, RefreshTokenPayload, RefreshTokenResponse } from './authService';

// Staff/Admin Services
export { StaffAccessService } from './staffAccessService';
export type {
  StaffRole,
  StaffStatus,
  StaffAvailability,
  SupportRequestStatus,
  StaffAccount,
  SupportRequest,
  StaffSession,
  AdminLoginUser,
  AdminLoginResponse,
  AdminDashboardStats,
  AdminStaffPasswordResetRequest,
  AdminStaffPasswordResetResponse,
  AdminStaffAvailabilityRequest,
  AdminStaffAvailabilityResponse,
  AdminConversationListItem,
  AdminConversationListResponse,
  AdminConversationMessage,
  AdminConversationDetail,
  AdminListConversationsOptions,
  AdminFeedbackItem,
  AdminFeedbackListResponse,
  AdminListFeedbackOptions,
  AdminReportItem,
  AdminReportListResponse,
  AdminListReportsOptions,
  AdminUpdateReportRequest,
} from './staffAccessService';

// User Management Services
export { UserManagementService } from './userManagementService';
export type {
  UserStatus,
  AgeRange,
  GenderIdentity,
  UserDetails,
  UserListItem,
  UserListResponse,
  ChatMessage,
  UserChatHistoryResponse,
  UpdateUserRequest,
  UserDeleteRequest,
} from './userManagementService';

// Support Requests Services
export { SupportRequestService } from './supportRequestService';
export type {
  SupportRequestStatus as SRStatus,
  SupportRequestType,
  RequestReason,
  RequestUrgency,
  ChatContext,
  CreateSupportRequestPayload,
  SupportRequestCreationResponse,
  SupportRequestListItem,
  SupportRequestListResponse,
  SupportRequestDetails,
  UpdateSupportRequestPayload,
  AssignRequestPayload,
  ResolveSupportRequestPayload,
  CloseSupportRequestPayload,
} from './supportRequestService';

// Chat Services
export { EnhancedChatService } from './enhancedChatService';
export type {
  ChatFeedbackPayload,
  ChatFeedbackResponse,
  EscalateToConsultantPayload,
  EscalateToConsultantResponse,
  ChatSessionMessage,
  ChatSessionHistoryResponse,
} from './enhancedChatService';

// User Engagement Services
export { UserEngagementService } from './userEngagementService';
export type {
  UserLanguage,
  ChatEventCategory,
  ChatInputMethod,
  SessionAction,
  DeviceType,
  CaptureDemographicsPayload,
  CaptureDemographicsResponse,
  LogChatEventPayload,
  LogChatEventResponse,
  UpdateUserSettingsPayload,
  UpdateUserSettingsResponse,
  TrackSessionPayload,
  TrackSessionResponse,
} from './userEngagementService';

// Analytics Services
export { RealAnalyticsService } from './realAnalyticsService';
export type {
  AnalyticsPeriod,
  AnalyticsSummary,
  AnalyticsOverviewSummary,
  TopicEngagementItem,
  TopicEngagementResponse,
  UserAnalyticsResponse,
  SafetyAnalyticsResponse,
  PerformanceMetricsResponse,
  SessionAnalyticsPayload,
  SessionAnalyticsResponse,
} from './realAnalyticsService';

// Safety Incident Services
export { SafetyIncidentService } from './safetyIncidentService';
export type {
  IncidentType,
  IncidentMetrics,
  SafetyAnalyticsResponse as SafetyAnalytics,
  SafetyTrendDataPoint,
  IncidentListItem,
  IncidentListResponse,
  UpdateIncidentRequest,
} from './safetyIncidentService';

// Safety Event Services
export { SafetyEventService } from './safetyEventService';
export type {
  PanicEventPayload,
  PanicEventResponse,
  CrisisEventPayload,
  CrisisEventResponse,
} from './safetyEventService';

// Health Metrics Services
export { HealthMetricsService } from './healthMetricsService';
export type {
  SystemMetric,
  PerformanceDataPoint,
  ServiceHealthStatus,
  HealthMetricsResponse,
  PerformanceHistoryResponse,
} from './healthMetricsService';

// Audit Log Services
export { AuditLogService } from './auditLogService';
export type {
  AuditLogEntry,
  AuditLogListResponse,
  AuditLogFilters,
  AuditLogStatsResponse,
} from './auditLogService';

// Original Chat Service (for completion requests)
export { requestChatCompletion, ChatbotSession, createChatSession, getBotResponse, getFollowUpSuggestions } from './chatbotService';
export type { ChatMessage as ChatbotMessage, UserDemographics, ChatApiRequest, ChatApiResponse, ChatCitation, SafetyFlag } from './chatbotService';

// Analytics (Mock Data - kept for reference)
export { AnalyticsService } from './analyticsService';

// Text-to-Speech Service
export { requestTextToSpeech } from './ttsService';
export type { TTSRequest, TTSResponse } from './ttsService';
