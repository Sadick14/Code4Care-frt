# Complete API Integration Guide

## Overview

This document provides a comprehensive guide to all backend API endpoints integrated in the Code4Care frontend application. All services are fully implemented and accessible through the centralized `APIClient`.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Core Services](#core-services)
   - [Chat Service](#chat-service)
   - [Authentication Service](#authentication-service)
   - [Health Service](#health-service)
3. [User Management](#user-management)
   - [User Tracking Service](#user-tracking-service)
   - [User Management Service](#user-management-service)
4. [Safety & Crisis](#safety--crisis)
   - [Safety Service](#safety-service)
   - [Support Requests Service](#support-requests-service)
5. [Analytics](#analytics)
   - [Real Analytics Service](#real-analytics-service)
   - [Feature Analytics Service](#feature-analytics-service)
6. [Feedback & Reporting](#feedback--reporting)
   - [Feedback Service](#feedback-service)
   - [Report Service](#report-service)
7. [Additional Services](#additional-services)
   - [Follow-up Service](#follow-up-service)
   - [Suggestions Service](#suggestions-service)
8. [Admin Services](#admin-services)
   - [Staff Access Service](#staff-access-service)
9. [Usage Examples](#usage-examples)

---

## Setup & Configuration

### Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_CHAT_API_BASE_URL=http://localhost:8000
VITE_ADMIN_API_BASE_URL=http://localhost:8000
```

### Initialize API Client

```typescript
import { APIClient } from '@/services';

// Initialize with configuration
APIClient.initialize({
  autoRefreshToken: true,
  onTokenExpired: () => {
    // Handle token expiration (e.g., redirect to login)
    window.location.href = '/admin/login';
  },
  onUnauthorized: () => {
    // Handle unauthorized access
    console.error('Unauthorized access');
  },
});

// Get API client instance
const apiClient = APIClient.getInstance();
```

---

## Core Services

### Chat Service

**Endpoints:** `POST /v1/chat`, `POST /v1/chat/feedback`, `POST /v1/chat/escalate`, `GET /v1/chat/session/{session_id}`

#### Get Chat Completion

```typescript
const response = await apiClient.Chat.getCompletion({
  message: 'What is contraception?',
  language: 'en',
  session_id: 'session-123',
});

console.log(response.answer);
console.log(response.citations);
console.log(response.safety_flags);
```

#### Submit Chat Feedback

```typescript
await apiClient.Chat.submitFeedback({
  session_id: 'session-123',
  message_id: 'msg-456',
  rating: 5,
  helpful: true,
  feedback_type: 'accurate',
  would_recommend: true,
});
```

#### Escalate to Consultant

```typescript
const escalation = await apiClient.Chat.escalate({
  session_id: 'session-123',
  user_nickname: 'Anonymous',
  reason: 'safety',
  urgency: 'high',
  safety_flags_triggered: ['self_harm'],
  current_message: 'User needs immediate help',
});

console.log(`Position in queue: ${escalation.queue_position}`);
console.log(`Estimated wait: ${escalation.estimated_wait_time} minutes`);
```

#### Get Session History

```typescript
const history = await apiClient.Chat.getSessionHistory(
  'session-123',
  { limit: 50, include_metadata: true },
  accessToken
);

console.log(history.messages);
console.log(history.topics_discussed);
```

---

### Authentication Service

**Endpoints:** `POST /admin/login`, `POST /admin/refresh-token`, `POST /admin/logout`

#### Login

```typescript
// Login via Staff Access Service
const session = await apiClient.Staff.login('admin@example.com', 'password123');

// Store token
apiClient.Auth.storeToken({
  access_token: session.accessToken,
  refresh_token: session.refreshToken,
  token_type: 'Bearer',
  expires_in: 3600,
});
```

#### Check Authentication

```typescript
const isAuthenticated = apiClient.Auth.isAuthenticated();

if (!isAuthenticated) {
  // Redirect to login
}
```

#### Refresh Token

```typescript
const newToken = await apiClient.Auth.refreshToken();
console.log('New access token:', newToken.access_token);
```

#### Logout

```typescript
await apiClient.Auth.logout();
// Tokens are automatically cleared
```

---

### Health Service

**Endpoints:** `GET /health`, `GET /health/ready`, `GET /version`

#### Check API Health

```typescript
const health = await apiClient.Health.check();
console.log(`API status: ${health.status}`); // 'ok' | 'degraded' | 'down'
```

#### Check Ready Status

```typescript
const ready = await apiClient.Health.checkReady();
console.log(`Database: ${ready.database}`);
console.log(`Vector Store: ${ready.vector_store}`);
console.log(`LLM: ${ready.llm}`);
```

#### Get Version

```typescript
const version = await apiClient.Health.getVersion();
console.log(`API Version: ${version.version}`);
```

---

## User Management

### User Tracking Service

**Endpoints:** `POST /v1/user/demographics`, `POST /v1/chat/event`, `POST /v1/user/settings`, `POST /v1/session`

#### Capture Demographics (Onboarding)

```typescript
await apiClient.UserTracking.captureDemographics({
  session_id: 'session-123',
  age_range: '15-19',
  gender_identity: 'female',
  region: 'Greater Accra',
  language: 'en',
});
```

#### Log Chat Event

```typescript
await apiClient.UserTracking.logEvent({
  session_id: 'session-123',
  event_type: 'message_sent',
  event_category: 'conversation',
  topic: 'contraception',
  input_method: 'text',
});
```

#### Update User Settings

```typescript
await apiClient.UserTracking.updateSettings({
  session_id: 'session-123',
  nickname: 'Anonymous123',
  language: 'en',
  chat_retention: true,
  analytics_consent: true,
  consultant_mode_enabled: false,
});
```

#### Track Session

```typescript
// Start session
await apiClient.UserTracking.trackSession({
  session_id: 'session-123',
  action: 'start',
  return_visitor: false,
  device_type: 'mobile',
  os: 'Android',
  browser: 'Chrome',
});

// End session
await apiClient.UserTracking.trackSession({
  session_id: 'session-123',
  action: 'end',
  duration_seconds: 1200,
});
```

---

### User Management Service

**Endpoints:** `GET /users`, `GET /users/{user_id}`, `PUT /users/{user_id}`, `DELETE /users/{user_id}`, `GET /users/{user_id}/chat-history`

#### List Users (Admin)

```typescript
const users = await apiClient.Users.list({
  page: 1,
  limit: 50,
  status: 'active',
  age_range: '15-19',
  search: 'nickname',
  sort_by: 'last_active',
  sort_order: 'desc',
});

console.log(`Total users: ${users.total}`);
users.users.forEach(user => {
  console.log(`${user.nickname} - ${user.engagement_score}`);
});
```

#### Get User Details

```typescript
const user = await apiClient.Users.getDetails('user-123');

console.log(user.statistics.total_sessions);
console.log(user.safety_profile.flags_total);
console.log(user.engagement.category);
```

#### Get User Chat History

```typescript
const chatHistory = await apiClient.Users.getChatHistory(
  'user-123',
  { limit: 100, start_date: '2025-01-01' }
);

console.log(`Total messages: ${chatHistory.total_messages}`);
```

#### Update User

```typescript
await apiClient.Users.update('user-123', {
  status: 'suspended',
  reason_for_change: 'Policy violation',
  follow_up_required: true,
  follow_up_notes: 'Needs counselor check-in',
});
```

#### Delete User (GDPR)

```typescript
await apiClient.Users.delete('user-123', {
  reason: 'gdpr',
  confirmation_code: 'DELETE-USER-123',
});
```

---

## Safety & Crisis

### Safety Service

**Endpoints:** `POST /v1/safety/panic`, `POST /v1/safety/crisis`

#### Log Panic Button Event

```typescript
// When panic button is activated
await apiClient.Safety.logPanic({
  session_id: 'session-123',
  action: 'activated',
  time_active_seconds: 0,
});

// When panic button is dismissed
await apiClient.Safety.logPanic({
  session_id: 'session-123',
  action: 'dismissed',
  time_active_seconds: 15,
});
```

#### Log Crisis Detection

```typescript
await apiClient.Safety.logCrisis({
  session_id: 'session-123',
  conversation_id: 'conv-456',
  crisis_type: 'self_harm',
  confidence: 0.85,
  intervention_triggered: true,
  escalated_to_human: true,
});
```

---

### Support Requests Service

**Endpoints:** Full CRUD for support requests + assign/resolve/close

#### Create Support Request

```typescript
const supportRequest = await apiClient.SupportRequests.create({
  user_id: 'user-123',
  user_nickname: 'Anonymous',
  age_range: '15-19',
  gender_identity: 'female',
  region: 'Greater Accra',
  language: 'en',
  request_type: 'escalation',
  reason: 'safety',
  urgency: 'critical',
  chat_context: {
    topic: 'crisis',
    last_message: 'I need help now',
    session_id: 'session-123',
  },
  safety_flags_triggered: ['suicidal_ideation'],
});

console.log(`Request ID: ${supportRequest.id}`);
console.log(`Queue position: ${supportRequest.position_in_queue}`);
```

#### List Support Requests (Admin)

```typescript
const requests = await apiClient.SupportRequests.list({
  page: 1,
  limit: 20,
  status: 'waiting',
  urgency: 'high',
  sort_by: 'created_at',
});

console.log(`Waiting requests: ${requests.waiting_total}`);
console.log(`High priority: ${requests.high_priority}`);
```

#### Get Request Details

```typescript
const request = await apiClient.SupportRequests.getDetails('request-123');

console.log(request.conversation_transcript);
console.log(request.follow_up_required);
```

#### Assign Request

```typescript
await apiClient.SupportRequests.assign('request-123', {
  staff_id: 'staff-456',
  auto_start: true,
});
```

#### Resolve Request

```typescript
await apiClient.SupportRequests.resolve('request-123', {
  resolution_notes: 'Issue resolved successfully',
  satisfaction_rating: 5,
  follow_up_required: false,
});
```

#### Close Request

```typescript
await apiClient.SupportRequests.close('request-123', {
  reason: 'user_cancelled',
  notes: 'User resolved issue independently',
});
```

---

## Analytics

### Real Analytics Service

**Endpoints:** `GET /analytics/dashboard`, `GET /analytics/topics`, `GET /analytics/users`, `GET /analytics/safety`, `GET /analytics/performance`, `POST /analytics/session`

#### Get Dashboard Summary

```typescript
const summary = await apiClient.Analytics.getDashboard({
  period: 'week',
  by_region: true,
  by_age_group: true,
});

console.log(summary.summary.total_active_users);
console.log(summary.summary.total_conversations);
console.log(summary.demographics);
```

#### Get Topic Analytics

```typescript
const topics = await apiClient.Analytics.getTopics({
  period: 'month',
  limit: 10,
});

topics.topics.forEach(topic => {
  console.log(`${topic.topic}: ${topic.count} (${topic.percentage}%)`);
  console.log(`Trend: ${topic.trend}, Satisfaction: ${topic.avg_satisfaction}`);
});
```

#### Get User Analytics

```typescript
const userAnalytics = await apiClient.Analytics.getUsers({
  period: 'month',
  segment: 'returning',
});

console.log(`Retention rate: ${userAnalytics.retention_rate}%`);
```

#### Get Safety Analytics

```typescript
const safety = await apiClient.Analytics.getSafety({
  period: 'week',
  severity: 'high',
});

console.log(`Total incidents: ${safety.incidents.total}`);
console.log(safety.severity_distribution);
```

#### Get Performance Metrics

```typescript
const performance = await apiClient.Analytics.getPerformance({
  period: 'today',
});

console.log(`Avg response time: ${performance.response_time.avg_ms}ms`);
console.log(`Success rate: ${performance.message_processing.success_rate}%`);
```

#### Record Session Analytics

```typescript
await apiClient.Analytics.recordSession({
  session_id: 'session-123',
  user_id: 'user-456',
  age_range: '15-19',
  gender_identity: 'female',
  region: 'Greater Accra',
  language: 'en',
  start_time: '2025-01-01T10:00:00Z',
  end_time: '2025-01-01T10:30:00Z',
  duration_seconds: 1800,
  messages_exchanged: 25,
  topics_discussed: ['contraception', 'menstruation'],
  panic_button_used: false,
  crisis_support_accessed: false,
  story_modules_started: 1,
  story_modules_completed: 0,
  pharmacy_searches: 2,
  satisfaction_rating: 4,
  would_return: true,
  safety_flags: [],
});
```

---

### Feature Analytics Service

**Endpoints:** `POST /v1/story/event`, `POST /v1/mythbuster/event`, `POST /v1/resource/access`

#### Log Story Module Event

```typescript
// Story started
await apiClient.FeatureAnalytics.logStory({
  session_id: 'session-123',
  story_id: 'story-contraception-basics',
  story_title: 'Contraception Basics',
  action: 'started',
  progress_percentage: 0,
  time_spent_seconds: 0,
});

// Story completed
await apiClient.FeatureAnalytics.logStory({
  session_id: 'session-123',
  story_id: 'story-contraception-basics',
  story_title: 'Contraception Basics',
  action: 'completed',
  progress_percentage: 100,
  time_spent_seconds: 300,
});
```

#### Log Myth Buster Event

```typescript
await apiClient.FeatureAnalytics.logMythBuster({
  session_id: 'session-123',
  myth_id: 'myth-first-time-pregnancy',
  myth_title: 'Can you get pregnant the first time?',
  action: 'viewed',
});

await apiClient.FeatureAnalytics.logMythBuster({
  session_id: 'session-123',
  myth_id: 'myth-first-time-pregnancy',
  myth_title: 'Can you get pregnant the first time?',
  action: 'feedback_helpful',
});
```

#### Log Resource Access

```typescript
await apiClient.FeatureAnalytics.logResourceAccess({
  session_id: 'session-123',
  resource_type: 'pdf_booklet',
  resource_id: 'srh-guide-2025',
  resource_name: 'SRH Guide for Youth',
  action: 'downloaded',
});

await apiClient.FeatureAnalytics.logResourceAccess({
  session_id: 'session-123',
  resource_type: 'clinic_locator',
  action: 'viewed',
});
```

---

## Feedback & Reporting

### Feedback Service

**Endpoint:** `POST /v1/feedback`

#### Submit Feedback

```typescript
await apiClient.Feedback.submit({
  session_id: 'session-123',
  message_id: 'msg-456',
  rating: 4,
  comment: 'Very helpful information!',
});
```

---

### Report Service

**Endpoint:** `POST /v1/report`

#### Report Response

```typescript
await apiClient.Report.submit({
  session_id: 'session-123',
  message_id: 'msg-789',
  reason: 'Inaccurate information about contraception methods',
});
```

---

## Additional Services

### Follow-up Service

**Endpoint:** `POST /v1/followup`

#### Create Follow-up Request

```typescript
const followUp = await apiClient.FollowUp.create({
  session_id: 'session-123',
  conversation_id: 'conv-456',
  contact_method: 'whatsapp',
  contact_info: '+233241234567',
  requested_topic: 'Follow-up on contraception consultation',
});

console.log(`Follow-up ID: ${followUp.followup_id}`);
console.log(`Status: ${followUp.status}`);
```

---

### Suggestions Service

**Endpoint:** `GET /v1/suggestions`

#### Get Conversation Suggestions

```typescript
const suggestions = await apiClient.Suggestions.get({
  language: 'en',
  context: 'getting_started',
  limit: 5,
});

suggestions.suggestions.forEach(suggestion => {
  console.log(`- ${suggestion}`);
});
```

---

## Admin Services

### Staff Access Service

**Endpoints:** `POST /admin/login`, `GET /admin/staff`, `POST /admin/staff`, `PUT /admin/staff/{staff_id}`, `DELETE /admin/staff/{staff_id}`, `GET /admin/dashboard`

#### Admin Login

```typescript
const session = await apiClient.Staff.login('admin@example.com', 'password123');

// Store session
apiClient.Staff.setSession(session);

// Store token for API calls
apiClient.Auth.storeToken({
  access_token: session.accessToken!,
  refresh_token: session.refreshToken!,
  token_type: 'Bearer',
  expires_in: session.expiresIn!,
});
```

#### List Staff

```typescript
const staff = await apiClient.Staff.listStaff(accessToken);

staff.forEach(member => {
  console.log(`${member.name} - ${member.role} (${member.availability})`);
});
```

#### Create Staff Account

```typescript
const newStaff = await apiClient.Staff.createStaff({
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+233241234567',
  role: 'consultant',
  password: 'SecurePassword123!',
});

console.log(`Created staff: ${newStaff.name}`);
```

#### Update Staff Account

```typescript
await apiClient.Staff.updateStaff('staff-123', {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'supervisor',
  isActive: true,
});
```

#### Delete Staff Account

```typescript
await apiClient.Staff.deleteStaff('staff-123');
```

#### Get Dashboard Stats

```typescript
const stats = await apiClient.Staff.getDashboardStats(accessToken);

console.log(`Total conversations: ${stats.total_conversations}`);
console.log(`Active sessions today: ${stats.active_sessions_today}`);
console.log(`Safety flags today: ${stats.safety_flags_today}`);
console.log(`Pending reports: ${stats.pending_reports}`);
```

---

## Usage Examples

### Complete User Flow Example

```typescript
// 1. Start session
const sessionId = `session-${Date.now()}`;

await apiClient.UserTracking.trackSession({
  session_id: sessionId,
  action: 'start',
  return_visitor: false,
  device_type: 'mobile',
  os: 'Android',
  browser: 'Chrome',
});

// 2. Capture demographics during onboarding
await apiClient.UserTracking.captureDemographics({
  session_id: sessionId,
  age_range: '15-19',
  gender_identity: 'female',
  region: 'Greater Accra',
  language: 'en',
});

// 3. Get conversation suggestions
const suggestions = await apiClient.Suggestions.get({ language: 'en' });

// 4. Send chat message
const chatResponse = await apiClient.Chat.getCompletion({
  message: 'What is contraception?',
  language: 'en',
  session_id: sessionId,
});

// 5. Log chat event
await apiClient.UserTracking.logEvent({
  session_id: sessionId,
  event_type: 'message_sent',
  event_category: 'conversation',
  topic: 'contraception',
});

// 6. Submit feedback
await apiClient.Feedback.submit({
  session_id: sessionId,
  rating: 5,
  comment: 'Very helpful!',
});

// 7. End session
await apiClient.UserTracking.trackSession({
  session_id: sessionId,
  action: 'end',
  duration_seconds: 600,
});

// 8. Record session analytics
await apiClient.Analytics.recordSession({
  session_id: sessionId,
  age_range: '15-19',
  gender_identity: 'female',
  region: 'Greater Accra',
  language: 'en',
  start_time: new Date(Date.now() - 600000).toISOString(),
  end_time: new Date().toISOString(),
  duration_seconds: 600,
  messages_exchanged: 5,
  topics_discussed: ['contraception'],
  panic_button_used: false,
  crisis_support_accessed: false,
  story_modules_started: 0,
  story_modules_completed: 0,
  pharmacy_searches: 0,
  satisfaction_rating: 5,
  would_return: true,
  safety_flags: [],
});
```

### Safety Event Flow Example

```typescript
// Crisis detected in chat
const sessionId = 'session-123';

// 1. Log crisis event
await apiClient.Safety.logCrisis({
  session_id: sessionId,
  crisis_type: 'self_harm',
  confidence: 0.9,
  intervention_triggered: true,
  escalated_to_human: true,
});

// 2. Escalate to consultant
const escalation = await apiClient.Chat.escalate({
  session_id: sessionId,
  user_nickname: 'Anonymous',
  reason: 'safety',
  urgency: 'critical',
  safety_flags_triggered: ['self_harm'],
  current_message: 'User mentioned self-harm',
});

console.log(`Support request created: ${escalation.support_request_id}`);
console.log(`Queue position: ${escalation.queue_position}`);
```

---

## Error Handling

All services implement consistent error handling:

```typescript
try {
  await apiClient.Chat.getCompletion({
    message: 'Hello',
    language: 'en',
    session_id: 'session-123',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Chat error:', error.message);

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // Handle authentication error
      apiClient.Auth.clearTokens();
      window.location.href = '/login';
    }
  }
}
```

---

## TypeScript Types

All services export comprehensive TypeScript types. Import them as needed:

```typescript
import type {
  ChatApiRequest,
  ChatApiResponse,
  UserDemographicsRequest,
  SafetyEventPayload,
  SupportRequestDetails,
} from '@/services';
```

---

## Summary

✅ **All backend endpoints are now integrated** in the frontend
✅ **Centralized APIClient** for easy access
✅ **Comprehensive TypeScript types** for type safety
✅ **Consistent error handling** across all services
✅ **Automatic token refresh** for authenticated endpoints
✅ **Fallback responses** for non-critical analytics/tracking

### Total Services Implemented:
- ✅ Chat Service (4 endpoints)
- ✅ Authentication Service (4 endpoints)
- ✅ User Tracking Service (4 endpoints)
- ✅ User Management Service (5 endpoints)
- ✅ Safety Service (2 endpoints)
- ✅ Support Requests Service (7 endpoints)
- ✅ Real Analytics Service (6 endpoints)
- ✅ Feature Analytics Service (3 endpoints)
- ✅ Feedback Service (1 endpoint)
- ✅ Report Service (1 endpoint)
- ✅ Follow-up Service (1 endpoint)
- ✅ Suggestions Service (1 endpoint)
- ✅ Health Service (3 endpoints)
- ✅ Staff Access Service (6 endpoints)

**Total: 48+ endpoints fully integrated!**
