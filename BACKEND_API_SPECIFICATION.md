# Code4Care Backend API Specification
## Complete System Endpoint Sweep & Implementation Guide

**Document Version:** 1.0  
**Last Updated:** May 4, 2026  
**Project:** Code4Care - Youth Sexual & Reproductive Health Support Platform

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core API Endpoints](#core-api-endpoints)
   - [Chat/AI Service Endpoints](#chaiai-service-endpoints)
   - [Admin Authentication Endpoints](#admin-authentication-endpoints)
   - [Staff Management Endpoints](#staff-management-endpoints)
   - [User Management Endpoints](#user-management-endpoints)
   - [Support Request Endpoints](#support-request-endpoints)
   - [Analytics Endpoints](#analytics-endpoints)
4. [Database Schema](#database-schema)
5. [Error Handling](#error-handling)
6. [Implementation Notes](#implementation-notes)

---

## System Overview

The Code4Care platform consists of the following integrated systems:

- **User-Facing Chat Application**: Interactive chatbot for SRH information (English, Twi, Ewe, Ga)
- **Story Mode**: Educational story-based learning modules
- **Crisis Support**: Emergency hotlines and support resources
- **Pharmacy Locator**: Find nearby pharmacies and health clinics
- **Admin Dashboard**: Staff management, analytics, safety monitoring
- **Staff Management**: Admin and consultant roles with support request queuing

### Core Technologies
- Frontend: React + TypeScript + Vite
- Backend: FastAPI (Python), Node.js, or similar
- Database: PostgreSQL recommended
- AI/LLM: Integrated chatbot API endpoint
- Authentication: JWT tokens (Bearer)
- i18n Support: English (en), Twi (twi), Ewe (ewe), Ga (ga)

---

## Authentication & Authorization

### Token Structure

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin|consultant|supervisor|coordinator",
    "is_active": true,
    "created_at": "ISO8601",
    "last_login_at": "ISO8601"
  }
}
```

### Authorization Levels

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, staff management, user management, reports, system health |
| **consultant** | Support request handling, user chat history access, incident reporting |
| **supervisor** | Consultant oversight, team management, safety escalation |
| **coordinator** | Event scheduling, clinic coordination, pharmacy updates |

---

## Core API Endpoints

### **Chat/AI Service Endpoints**

#### 1. POST `/v1/chat` - Chat Completion

Send user message to AI chatbot and receive response with citations and safety flags.

**Request:**
```json
{
  "message": "string (user question/statement)",
  "language": "en|twi|ewe|ga",
  "session_id": "string (unique session identifier)",
  "user_id": "string (optional, for analytics)",
  "age_range": "10-14|15-19|20-24|25+",
  "gender_identity": "male|female|non-binary|prefer-not-say",
  "region": "string (Ghana region)",
  "user_demographics": {
    "age_range": "string",
    "gender_identity": "string",
    "region": "string"
  },
  "context": {
    "previous_messages": [
      { "role": "user|bot|assistant", "content": "string" }
    ],
    "conversation_topic": "string (optional)"
  }
}
```

**Response (200 OK):**
```json
{
  "answer": "string (chatbot response)",
  "citations": [
    {
      "title": "string",
      "source": "string",
      "excerpt": "string",
      "text": "string",
      "url": "string",
      "page": "string|number"
    }
  ],
  "safety_flags": [
    {
      "label": "self-harm|suicidal|abuse|panic",
      "reason": "string (explanation)",
      "severity": "low|medium|high|critical",
      "message": "string (recommended action)"
    }
  ],
  "language_detected": "string",
  "response_time_ms": 1234,
  "session_id": "string"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid language, missing required fields
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: AI service failure
- `503 Service Unavailable`: AI service temporarily down

**Fields Needed:**
- User question text
- Language code
- Session identifier
- Demographic data (age, gender, region)
- Conversation context history
- Previous messages for continuity

---

#### 2. POST `/v1/chat/feedback` - Chat Response Feedback

Submit feedback on chatbot responses for improvement.

**Request:**
```json
{
  "session_id": "string",
  "message_id": "string",
  "rating": 1|2|3|4|5,
  "helpful": true|false,
  "feedback_type": "accurate|unclear|inappropriate|other",
  "feedback_text": "string (optional detailed feedback)",
  "would_recommend": true|false
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "session_id": "string",
  "message_id": "string",
  "rating": 5,
  "feedback_type": "accurate",
  "created_at": "ISO8601",
  "status": "recorded"
}
```

---

#### 3. POST `/v1/chat/escalate` - Escalate Chat to Human Consultant

Escalate chat session to human support for personal consultation.

**Request:**
```json
{
  "session_id": "string",
  "user_id": "string",
  "user_nickname": "string",
  "reason": "safety|complex|request",
  "urgency": "normal|high|critical",
  "safety_flags_triggered": ["string"],
  "current_message": "string (last user message)"
}
```

**Response (201 Created):**
```json
{
  "support_request_id": "string",
  "session_id": "string",
  "status": "waiting|assigned|active|resolved",
  "created_at": "ISO8601",
  "estimated_wait_time": 300,
  "assigned_consultant": {
    "id": "string (if assigned)",
    "name": "string",
    "availability": "available|busy|offline"
  },
  "queue_position": 3
}
```

---

#### 4. GET `/v1/chat/session/{session_id}` - Get Chat Session History

Retrieve full chat history for a specific session.

**Query Parameters:**
- `limit`: number (default: 50, max: 500)
- `offset`: number (default: 0)
- `include_metadata`: boolean (optional)

**Response (200 OK):**
```json
{
  "session_id": "string",
  "user_id": "string (optional)",
  "created_at": "ISO8601",
  "last_message_at": "ISO8601",
  "duration_seconds": 1234,
  "language": "en|twi|ewe|ga",
  "total_messages": 42,
  "messages": [
    {
      "id": "string",
      "sender": "user|bot",
      "text": "string",
      "timestamp": "ISO8601",
      "language": "string",
      "safety_flags": ["string"],
      "source": "chatbot|consultant"
    }
  ],
  "topics_discussed": ["contraception", "menstruation", ...],
  "safety_summary": {
    "flags_triggered": 2,
    "escalations": 0,
    "crisis_interventions": 0
  }
}
```

---

### **Admin Authentication Endpoints**

#### 1. POST `/admin/login` - Admin/Staff Login

Authenticate staff member and issue JWT tokens.

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string (optional)",
  "token_type": "Bearer (implicit)"
}
```

**Response (200 OK):**
```json
{
  "access_token": "string (JWT)",
  "refresh_token": "string (JWT)",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin|consultant|supervisor|coordinator",
    "is_active": true,
    "created_at": "ISO8601",
    "last_login_at": "ISO8601"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account inactive/suspended
- `404 Not Found`: User not found

---

#### 2. POST `/admin/refresh-token` - Refresh Access Token

Get new access token using refresh token.

**Request:**
```json
{
  "refresh_token": "string"
}
```

**Response (200 OK):**
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

#### 3. POST `/admin/logout` - Admin Logout

Invalidate current session tokens.

**Request:**
```json
{
  "access_token": "string (current token)"
}
```

**Response (200 OK):**
```json
{
  "status": "logged_out",
  "message": "Session ended successfully"
}
```

---

#### 4. GET `/admin/me` - Get Current Admin User Info

Get details of logged-in admin user.

**Headers:** `Authorization: Bearer {access_token}`

**Response (200 OK):**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "is_active": true,
  "created_at": "ISO8601",
  "last_login_at": "ISO8601",
  "permissions": ["string"],
  "settings": {
    "email_notifications": true,
    "sms_alerts": false,
    "report_frequency": "daily|weekly|monthly"
  }
}
```

---

### **Staff Management Endpoints**

#### 1. POST `/admin/staff` - Create New Staff Account

Create a new staff member account. (Admin only)

**Request:**
```json
{
  "username": "string (unique)",
  "email": "string (unique, valid email)",
  "password": "string (min 8 chars, complexity requirements)",
  "role": "admin|consultant|supervisor|coordinator",
  "first_name": "string",
  "last_name": "string",
  "phone": "string (+233..)",
  "department": "string (optional)",
  "date_of_hire": "ISO8601",
  "trained": true|false,
  "is_active": true
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "department": "string",
  "created_at": "ISO8601",
  "is_active": true,
  "status": "pending|verified|active"
}
```

**Validation Rules:**
- Username: alphanumeric, 4-32 characters, unique
- Email: valid format, unique
- Password: minimum 8 characters, must include uppercase, lowercase, number, special char
- Phone: valid Ghana mobile number format
- Role restricted to one of: admin, consultant, supervisor, coordinator

---

#### 2. GET `/admin/staff` - List All Staff

Get paginated list of all staff members. (Admin only)

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `role`: string (filter: admin|consultant|supervisor|coordinator)
- `status`: string (filter: active|inactive|suspended)
- `search`: string (search by name/email/username)
- `sort_by`: string (username|email|role|created_at|last_login_at)
- `sort_order`: asc|desc

**Response (200 OK):**
```json
{
  "staff": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "first_name": "string",
      "last_name": "string",
      "phone": "string",
      "status": "active|inactive|suspended",
      "is_active": true,
      "created_at": "ISO8601",
      "last_login_at": "ISO8601",
      "current_load": 3,
      "availability": "available|busy|offline",
      "pending_follow_ups": 2
    }
  ],
  "total": 24,
  "page": 1,
  "limit": 20,
  "pages": 2
}
```

---

#### 3. GET `/admin/staff/{staff_id}` - Get Staff Details

Get detailed information for specific staff member.

**Response (200 OK):**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "first_name": "string",
  "last_name": "string",
  "phone": "string",
  "department": "string",
  "status": "active|inactive|suspended",
  "is_active": true,
  "trained": true,
  "created_at": "ISO8601",
  "last_login_at": "ISO8601",
  "date_of_hire": "ISO8601",
  "availability": "available|busy|offline",
  "current_load": 3,
  "total_consultations": 145,
  "average_session_duration": 1234,
  "ratings": {
    "avg_rating": 4.7,
    "total_ratings": 87,
    "helpful_count": 82
  },
  "stats": {
    "consultations_this_month": 12,
    "avg_response_time_minutes": 5,
    "escalations_handled": 8,
    "follow_ups_pending": 2
  },
  "settings": {
    "email_notifications": true,
    "sms_alerts": false,
    "max_concurrent_sessions": 5
  }
}
```

---

#### 4. PUT `/admin/staff/{staff_id}` - Update Staff Account

Update staff member information. (Admin only)

**Request:**
```json
{
  "email": "string (optional)",
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "phone": "string (optional)",
  "role": "string (optional, admin only)",
  "department": "string (optional)",
  "is_active": boolean (optional),
  "trained": boolean (optional),
  "availability": "available|busy|offline (optional)",
  "settings": {
    "email_notifications": boolean,
    "sms_alerts": boolean,
    "max_concurrent_sessions": number
  }
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "updated_fields": ["email", "availability"],
  "updated_at": "ISO8601",
  "success": true
}
```

---

#### 5. DELETE `/admin/staff/{staff_id}` - Deactivate/Remove Staff

Deactivate or remove staff account. (Admin only)

**Request:**
```json
{
  "action": "deactivate|delete",
  "reason": "string (optional)",
  "transfer_sessions_to": "string (staff_id, if deactivating)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "action": "deactivated|deleted",
  "status": "inactive",
  "deleted_at": "ISO8601",
  "sessions_transferred": 3
}
```

---

#### 6. POST `/admin/staff/{staff_id}/reset-password` - Password Reset

Force password reset for staff member. (Admin only)

**Request:**
```json
{
  "temporary_password": "string (sent to staff)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "password_reset": true,
  "reset_at": "ISO8601",
  "notification_sent": true,
  "notification_method": "email|sms"
}
```

---

#### 7. POST `/admin/staff/{staff_id}/change-availability` - Change Availability Status

Update staff member's current availability status.

**Request:**
```json
{
  "availability": "available|busy|offline",
  "reason": "string (optional)",
  "until": "ISO8601 (optional, for temporary status)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "availability": "available",
  "changed_at": "ISO8601",
  "active_sessions": 2,
  "queued_requests": 4
}
```

---

### **User Management Endpoints**

#### 1. GET `/users` - List All Users

Get paginated list of all users. (Admin only)

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50, max: 500)
- `status`: string (filter: active|inactive|suspended)
- `age_range`: string (filter: 10-14|15-19|20-24|25+)
- `gender`: string (filter)
- `region`: string (filter)
- `search`: string (search by nickname)
- `sort_by`: string (last_active|created_at|engagement_count)
- `sort_order`: asc|desc

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "string (session_id)",
      "nickname": "string",
      "age_range": "10-14|15-19|20-24|25+",
      "gender_identity": "male|female|non-binary|prefer-not-say",
      "region": "string",
      "language": "en|twi|ewe|ga",
      "created_at": "ISO8601",
      "last_active": "ISO8601",
      "status": "active|inactive|suspended",
      "total_sessions": 12,
      "total_messages": 345,
      "engagement_score": 87,
      "panic_button_used": 1,
      "crisis_flags": 2,
      "last_message_date": "ISO8601"
    }
  ],
  "total": 1245,
  "page": 1,
  "limit": 50,
  "pages": 25
}
```

---

#### 2. GET `/users/{user_id}` - Get User Details

Get detailed information for specific user.

**Response (200 OK):**
```json
{
  "id": "string",
  "nickname": "string",
  "age_range": "string",
  "gender_identity": "string",
  "region": "string",
  "language": "string",
  "created_at": "ISO8601",
  "last_active": "ISO8601",
  "status": "active|inactive|suspended",
  "statistics": {
    "total_sessions": 12,
    "total_messages": 345,
    "total_session_duration_minutes": 567,
    "average_session_duration_minutes": 47,
    "topics_discussed": ["contraception", "menstruation", ...],
    "consultant_escalations": 2,
    "panic_button_used": 1,
    "story_modules_started": 5,
    "story_modules_completed": 3
  },
  "safety_profile": {
    "self_harm_mentions": 1,
    "suicidal_ideation_mentions": 0,
    "abuse_mentions": 2,
    "crisis_interventions": 1,
    "flags_total": 4,
    "escalations": 1,
    "requires_follow_up": true,
    "follow_up_notes": "string (if exists)"
  },
  "engagement": {
    "score": 87,
    "category": "high|medium|low",
    "last_engagement_date": "ISO8601"
  },
  "chat_history_summary": {
    "oldest_message_date": "ISO8601",
    "newest_message_date": "ISO8601",
    "message_count": 345,
    "topics": ["topic1", "topic2"]
  }
}
```

---

#### 3. GET `/users/{user_id}/chat-history` - Get User Chat History

Retrieve full chat history for a user. (Admin only)

**Query Parameters:**
- `limit`: number (default: 50, max: 500)
- `offset`: number (default: 0)
- `start_date`: ISO8601 (optional)
- `end_date`: ISO8601 (optional)
- `search`: string (optional, search in messages)

**Response (200 OK):**
```json
{
  "user_id": "string",
  "total_messages": 345,
  "messages": [
    {
      "id": "string",
      "session_id": "string",
      "timestamp": "ISO8601",
      "sender": "user|bot",
      "text": "string (truncated if long)",
      "language": "string",
      "safety_flags": ["string"],
      "source": "chatbot|consultant",
      "response_time_ms": 1234
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "total": 345
  }
}
```

---

#### 4. PUT `/users/{user_id}` - Update User Status

Update user account status or notes. (Admin only)

**Request:**
```json
{
  "status": "active|inactive|suspended (optional)",
  "reason_for_change": "string (if status changed)",
  "follow_up_notes": "string (optional)",
  "follow_up_required": boolean (optional),
  "assigned_consultant": "string (consultant_id, optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "suspended",
  "updated_at": "ISO8601",
  "reason": "Crisis detected - escalated to consultant"
}
```

---

#### 5. DELETE `/users/{user_id}` - Delete User Data

Completely remove user data (GDPR compliance).

**Request:**
```json
{
  "reason": "user_request|gdpr|safety",
  "confirmation_code": "string (user-provided code)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "deleted": true,
  "deleted_at": "ISO8601",
  "data_retention": "messages archived for 90 days per policy"
}
```

---

### **Support Request Endpoints**

#### 1. POST `/support-requests` - Create Support Request

Create new support request (user or escalation-triggered).

**Request:**
```json
{
  "user_id": "string (session_id)",
  "user_nickname": "string",
  "age_range": "string",
  "gender_identity": "string",
  "region": "string",
  "language": "string",
  "request_type": "escalation|scheduled_consultation|follow_up",
  "reason": "safety|complex_question|follow_up|scheduled",
  "urgency": "normal|high|critical",
  "chat_context": {
    "topic": "string",
    "last_message": "string",
    "session_id": "string"
  },
  "safety_flags_triggered": ["string"],
  "requested_specialty": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": "string (support_request_id)",
  "user_id": "string",
  "status": "waiting|assigned|active|resolved",
  "created_at": "ISO8601",
  "assigned_staff_id": null,
  "position_in_queue": 2,
  "estimated_wait_time_minutes": 15,
  "urgency": "high"
}
```

---

#### 2. GET `/support-requests` - List Support Requests

Get paginated list of support requests. (Staff/Admin)

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: string (filter: waiting|assigned|active|resolved)
- `urgency`: string (filter: normal|high|critical)
- `assigned_to`: string (filter by staff_id)
- `sort_by`: string (created_at|urgency|status)

**Response (200 OK):**
```json
{
  "requests": [
    {
      "id": "string",
      "user_id": "string",
      "user_nickname": "string",
      "age_range": "string",
      "status": "waiting",
      "urgency": "high",
      "created_at": "ISO8601",
      "assigned_staff_id": null,
      "assigned_staff_name": null,
      "position_in_queue": 2,
      "wait_time_minutes": 8,
      "safety_flags": ["string"]
    }
  ],
  "total": 47,
  "page": 1,
  "limit": 20,
  "waiting_total": 12,
  "high_priority": 3
}
```

---

#### 3. GET `/support-requests/{request_id}` - Get Request Details

Get detailed information for specific support request.

**Response (200 OK):**
```json
{
  "id": "string",
  "user_id": "string",
  "user_nickname": "string",
  "age_range": "string",
  "gender_identity": "string",
  "region": "string",
  "language": "string",
  "status": "active",
  "urgency": "high",
  "request_type": "escalation",
  "reason": "safety",
  "created_at": "ISO8601",
  "assigned_staff_id": "string",
  "assigned_staff_name": "string",
  "assigned_at": "ISO8601",
  "started_at": "ISO8601",
  "resolved_at": null,
  "duration_minutes": 15,
  "chat_context": {
    "topic": "string",
    "safety_flags": ["self-harm"],
    "session_history": [
      { "role": "user|consultant", "message": "string", "timestamp": "ISO8601" }
    ]
  },
  "conversation_transcript": [
    { "role": "user|consultant", "message": "string", "timestamp": "ISO8601" }
  ],
  "notes": "string (staff notes)",
  "follow_up_required": true,
  "follow_up_date": "ISO8601"
}
```

---

#### 4. PUT `/support-requests/{request_id}` - Update Support Request Status

Update status, assignment, or notes of a support request. (Consultant/Admin)

**Request:**
```json
{
  "status": "assigned|active|resolved (optional)",
  "assigned_staff_id": "string (optional)",
  "notes": "string (optional, append to existing)",
  "urgency": "normal|high|critical (optional)",
  "follow_up_required": boolean (optional),
  "follow_up_date": "ISO8601 (optional)",
  "resolution_notes": "string (if marking resolved)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "active",
  "assigned_staff_id": "staff-123",
  "assigned_staff_name": "Jane Smith",
  "updated_at": "ISO8601"
}
```

---

#### 5. POST `/support-requests/{request_id}/assign` - Assign Request to Staff

Assign or claim a support request.

**Request:**
```json
{
  "staff_id": "string",
  "auto_start": false|true (auto-move to active)
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "assigned",
  "assigned_staff_id": "string",
  "assigned_at": "ISO8601"
}
```

---

#### 6. POST `/support-requests/{request_id}/resolve` - Mark Request as Resolved

Mark a support request as resolved.

**Request:**
```json
{
  "resolution_notes": "string",
  "satisfaction_rating": 1|2|3|4|5 (optional),
  "follow_up_required": false|true,
  "follow_up_date": "ISO8601 (if follow_up_required)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "resolved",
  "resolved_at": "ISO8601",
  "duration_minutes": 23,
  "follow_up_scheduled": false
}
```

---

#### 7. POST `/support-requests/{request_id}/close` - Close Request

Close and archive a support request without resolution.

**Request:**
```json
{
  "reason": "user_cancelled|no_response|transferred|other",
  "notes": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "closed",
  "closed_at": "ISO8601"
}
```

---

### **Analytics Endpoints**

#### 1. GET `/analytics/dashboard` - Dashboard Summary

Get overall system analytics and KPIs.

**Query Parameters:**
- `period`: today|week|month|year (default: week)
- `by_region`: boolean (groupby region)
- `by_age_group`: boolean (group by age)
- `by_language`: boolean (group by language)

**Response (200 OK):**
```json
{
  "generated_at": "ISO8601",
  "period": "week",
  "summary": {
    "total_active_users": 1245,
    "new_users_total": 87,
    "new_users_in_period": 12,
    "returning_users": 1203,
    "total_conversations": 3456,
    "conversations_in_period": 456,
    "total_messages": 45678,
    "messages_in_period": 8234,
    "average_session_duration_minutes": 23,
    "average_messages_per_session": 12
  },
  "demographics": {
    "age_range": {
      "10-14": 234,
      "15-19": 892,
      "20-24": 456,
      "25+": 178
    },
    "gender": {
      "male": 601,
      "female": 987,
      "non-binary": 89,
      "prefer-not-say": 83
    },
    "language_preference": {
      "en": 1145,
      "twi": 412,
      "ewe": 156,
      "ga": 47
    },
    "regions": {
      "Greater Accra": 523,
      "Ashanti": 312,
      "Eastern": 189,
      "Western": 154,
      "Central": 128,
      "Northern": 89,
      "Volta": 76,
      "Upper East": 95,
      "Upper West": 45,
      "Bono": 72
    }
  },
  "engagement": {
    "topics": [
      {
        "topic": "contraception",
        "inquiries": 234,
        "avg_session_time_seconds": 450,
        "satisfaction_score": 4.2
      }
    ],
    "high_engagement_topics": ["contraception", "pregnancy", "menstruation"],
    "low_engagement_topics": ["puberty", "general"]
  },
  "safety": {
    "panic_exits_total": 45,
    "panic_exits_in_period": 8,
    "crisis_interventions_triggered": 12,
    "self_harm_mentions_detected": 3,
    "suicidal_ideation_mentions": 2,
    "abuse_mentions_detected": 5,
    "concerned_users_followed_up": 4,
    "risks_escalated_to_human": 6
  },
  "performance": {
    "avg_response_time_ms": 234,
    "message_processing_success_percent": 99.8,
    "system_uptime_percent": 99.95,
    "crashes_or_errors": 1,
    "consecutive_hours_service": 168
  },
  "funnel": {
    "total_visitors": 1500,
    "completed_onboarding": 1245,
    "had_first_chat": 1200,
    "completed_story_module": 234,
    "used_pharmacy": 89,
    "accessed_crisis_support": 45,
    "return_rate_percent": 82.3
  }
}
```

---

#### 2. GET `/analytics/topics` - Topic Engagement Analytics

Get analytics for specific topics.

**Query Parameters:**
- `period`: today|week|month|year (default: week)
- `limit`: number (default: 20)

**Response (200 OK):**
```json
{
  "period": "week",
  "topics": [
    {
      "topic": "contraception",
      "inquiries": 234,
      "avg_session_time_seconds": 450,
      "satisfaction_score": 4.2,
      "trending": true,
      "change_vs_last_period": 15.2,
      "common_questions": ["string"],
      "age_groups": {
        "10-14": 45,
        "15-19": 123,
        "20-24": 56,
        "25+": 10
      },
      "gender_breakdown": {
        "male": 89,
        "female": 134,
        "non-binary": 8,
        "prefer-not-say": 3
      }
    }
  ]
}
```

---

#### 3. GET `/analytics/users` - User Analytics

Get user behavior and retention analytics.

**Query Parameters:**
- `period`: today|week|month|year
- `segment`: all|new|returning|at-risk|high_engagement

**Response (200 OK):**
```json
{
  "period": "week",
  "total_active_users": 1245,
  "new_users": 87,
  "returning_users": 1158,
  "retention_rate": 82.3,
  "sessions": {
    "total_sessions": 3456,
    "avg_sessions_per_user": 2.8,
    "one_time_users": 234
  },
  "engagement_distribution": {
    "high": 456,
    "medium": 567,
    "low": 222
  },
  "demographics": {
    "by_age": {
      "10-14": { "total": 234, "retention": 78.5 },
      "15-19": { "total": 892, "retention": 85.2 },
      "20-24": { "total": 456, "retention": 81.3 },
      "25+": { "total": 178, "retention": 76.2 }
    },
    "by_region": {
      "Greater Accra": { "total": 523, "retention": 86.4 },
      "Ashanti": { "total": 312, "retention": 81.2 }
    }
  }
}
```

---

#### 4. GET `/analytics/safety` - Safety & Crisis Analytics

Get safety incidents and crisis intervention analytics.

**Query Parameters:**
- `period`: today|week|month|year
- `severity`: low|medium|high|critical (optional filter)

**Response (200 OK):**
```json
{
  "period": "week",
  "incidents": {
    "total": 47,
    "panic_exits": {
      "total": 8,
      "triggered": 3,
      "responded_within_minutes": 5,
      "avg_response_time_minutes": 2.3
    },
    "crisis_interventions": 12,
    "self_harm_mentions": 3,
    "suicidal_ideation": 2,
    "abuse_mentions": 5,
    "followed_up": 4
  },
  "severity_distribution": {
    "low": 18,
    "medium": 15,
    "high": 10,
    "critical": 4
  },
  "escalations": {
    "total_escalated": 6,
    "to_human_consultant": 4,
    "to_external_resources": 2,
    "follow_up_pending": 3
  },
  "trends": {
    "incidents_increasing": true,
    "change_vs_last_period": 15.2,
    "peak_time": "18:00-22:00"
  },
  "demographics": {
    "by_age_range": {
      "15-19": 18,
      "20-24": 12
    },
    "by_gender": {
      "female": 28,
      "male": 15,
      "non-binary": 4
    }
  }
}
```

---

#### 5. GET `/analytics/performance` - System Performance Metrics

Get system performance and reliability metrics.

**Query Parameters:**
- `period`: today|week|month|year

**Response (200 OK):**
```json
{
  "period": "week",
  "response_time": {
    "avg_ms": 234,
    "p50_ms": 187,
    "p95_ms": 512,
    "p99_ms": 1234
  },
  "message_processing": {
    "success_rate": 99.8,
    "failed_messages": 12,
    "total_processed": 45678
  },
  "uptime": {
    "percent": 99.95,
    "downtime_minutes": 36,
    "incidents": 1
  },
  "errors": {
    "total": 8,
    "by_type": {
      "timeout": 3,
      "ai_service_error": 2,
      "database_error": 2,
      "other": 1
    }
  },
  "service_availability": {
    "chat_service": "operational",
    "ai_service": "operational",
    "database": "operational",
    "authentication": "operational"
  }
}
```

---

#### 6. POST `/analytics/session` - Record Session Analytics

Record analytics data for a completed session. (Called from frontend)

**Request:**
```json
{
  "session_id": "string",
  "user_id": "string (optional)",
  "age_range": "string",
  "gender_identity": "string",
  "region": "string",
  "language": "string",
  "start_time": "ISO8601",
  "end_time": "ISO8601",
  "duration_seconds": 1234,
  "messages_exchanged": 42,
  "topics_discussed": ["contraception", "menstruation"],
  "panic_button_used": false,
  "crisis_support_accessed": false,
  "story_modules_started": 1,
  "story_modules_completed": 0,
  "pharmacy_searches": 2,
  "satisfaction_rating": 4,
  "would_return": true,
  "safety_flags": ["string"]
}
```

**Response (201 Created):**
```json
{
  "session_id": "string",
  "recorded_at": "ISO8601",
  "status": "recorded"
}
```

---

## Database Schema

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id VARCHAR(36) PRIMARY KEY,
  nickname VARCHAR(100),
  age_range VARCHAR(20),
  gender_identity VARCHAR(50),
  region VARCHAR(100),
  language VARCHAR(10),
  created_at TIMESTAMP,
  last_active TIMESTAMP,
  status VARCHAR(20),
  session_duration VARCHAR(20),
  total_messages INT,
  topics_discussed TEXT,
  engagement_score INT,
  analytics_opt_in BOOLEAN,
  safety_flags_count INT,
  panic_button_used INT,
  crisis_escalations INT
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  sender VARCHAR(20), /* 'user' or 'bot' */
  text LONGTEXT,
  timestamp TIMESTAMP,
  language VARCHAR(10),
  safety_flags TEXT, /* JSON array */
  citations TEXT, /* JSON array */
  response_time_ms INT,
  source VARCHAR(20), /* 'chatbot' or 'consultant' */
  FOREIGN KEY (session_id) REFERENCES user_sessions(id)
);
```

### Staff Accounts Table
```sql
CREATE TABLE staff_accounts (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50), /* admin, consultant, supervisor, coordinator */
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  status VARCHAR(20), /* active, inactive, suspended */
  is_active BOOLEAN,
  trained BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login_at TIMESTAMP,
  date_of_hire TIMESTAMP,
  availability VARCHAR(20) /* available, busy, offline */
);
```

### Support Requests Table
```sql
CREATE TABLE support_requests (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36),
  user_nickname VARCHAR(100),
  age_range VARCHAR(20),
  gender_identity VARCHAR(50),
  region VARCHAR(100),
  language VARCHAR(10),
  status VARCHAR(20), /* waiting, assigned, active, resolved */
  urgency VARCHAR(20), /* normal, high, critical */
  request_type VARCHAR(50),
  reason VARCHAR(100),
  created_at TIMESTAMP,
  assigned_staff_id VARCHAR(36),
  assigned_at TIMESTAMP,
  started_at TIMESTAMP,
  resolved_at TIMESTAMP,
  duration_minutes INT,
  safety_flags TEXT,
  notes LONGTEXT,
  follow_up_required BOOLEAN,
  follow_up_date TIMESTAMP,
  FOREIGN KEY (assigned_staff_id) REFERENCES staff_accounts(id)
);
```

### Analytics Table
```sql
CREATE TABLE analytics_sessions (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36),
  user_id VARCHAR(36),
  age_range VARCHAR(20),
  gender_identity VARCHAR(50),
  region VARCHAR(100),
  language VARCHAR(10),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_seconds INT,
  messages_exchanged INT,
  topics_discussed TEXT, /* JSON array */
  panic_button_used BOOLEAN,
  crisis_support_accessed BOOLEAN,
  story_modules_started INT,
  story_modules_completed INT,
  pharmacy_searches INT,
  satisfaction_rating INT,
  would_return BOOLEAN,
  safety_flags TEXT,
  recorded_at TIMESTAMP
);
```

### Story Module Progress Table
```sql
CREATE TABLE story_module_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  module_id VARCHAR(100),
  status VARCHAR(50), /* in_progress, completed, abandoned */
  score_percent INT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_seconds INT,
  last_story_idx INT,
  answers JSON,
  user_rating INT
);
```

### Crisis Incidents Table
```sql
CREATE TABLE crisis_incidents (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36),
  session_id VARCHAR(36),
  user_id VARCHAR(36),
  user_nickname VARCHAR(100),
  incident_type VARCHAR(50), /* self-harm, suicidal, abuse, panic */
  severity VARCHAR(20), /* low, medium, high, critical */
  status VARCHAR(20), /* open, in-review, resolved, escalated */
  description LONGTEXT,
  chat_excerpt LONGTEXT,
  reported_at TIMESTAMP,
  automated BOOLEAN,
  reporter_id VARCHAR(36),
  assigned_to VARCHAR(36),
  assigned_at TIMESTAMP,
  notes LONGTEXT,
  follow_up_required BOOLEAN,
  follow_up_date TIMESTAMP,
  resolved_at TIMESTAMP
);
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "status": 400,
    "details": {
      "field": "field_name",
      "issue": "Specific validation error"
    },
    "timestamp": "ISO8601",
    "request_id": "string (for logging)"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_REQUEST` | 400 | Malformed request body |
| `VALIDATION_ERROR` | 400 | Field validation failed |
| `UNAUTHORIZED` | 401 | Missing/invalid credentials |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_ENTRY` | 409 | Duplicate unique field value |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary service outage |

---

## Implementation Notes

### Priority Implementation Order

1. **Phase 1 (Critical):**
   - User session management (onboarding, demographics)
   - Chat API integration with existing AI service
   - Admin login and authentication
   - Staff account management basic CRUD

2. **Phase 2 (High):**
   - Support request queue system
   - Safety incident detection and logging
   - Analytics recording
   - User management and chat history retrieval

3. **Phase 3 (Medium):**
   - Advanced analytics and reporting
   - Real-time consultant chat integration
   - Advanced filtering and search
   - Export/reporting features

4. **Phase 4 (Nice-to-Have):**
   - Mobile-specific optimizations
   - Performance caching and optimization
   - Batch processing for large datasets

### API Best Practices

- **Authentication:** JWT tokens with 1-hour expiry, refresh tokens with 30-day expiry
- **Rate Limiting:** 1000 requests/minute per user/IP
- **Logging:** All requests logged with request_id for tracing
- **Data Validation:** Server-side validation for all inputs
- **CORS:** Allow requests from frontend domain only
- **Pagination:** Maximum 500 items per page, default 50
- **Timestamps:** All timestamps in ISO 8601 UTC format
- **Error Details:** Never expose internal system details in error messages
- **Encryption:** All sensitive data (passwords, tokens) encrypted at rest

### Multilingual Support

All response strings should support language parameter:
- English (en) - default
- Twi (twi)
- Ewe (ewe)
- Ga (ga)

### Safety & Privacy Considerations

- User sessions identified by anonymous `session_id`, not IP or device ID
- Implement automatic data retention policies (e.g., delete after 90 days if requested)
- Audit trail for all staff actions
- Encryption for all data in transit (TLS 1.2+)
- GDPR compliance for data deletion requests
- Safety incident detection must flag without storing full sensitive user data

---

## Frontend Integration Checklist

- [ ] Chat API integration with retry logic
- [ ] Session management and persistence
- [ ] Token refresh mechanism
- [ ] Analytics event batching and submission
- [ ] Crisis incident auto-detection and reporting
- [ ] Support request creation and tracking
- [ ] User feedback collection
- [ ] Offline fallback for critical features
- [ ] Error boundary and user notifications
- [ ] Performance monitoring

---

**Document prepared for:** Full backend implementation with FastAPI, Node.js, or similar  
**Next Steps:** Create detailed schema migration scripts, implement authentication middleware, set up error logging infrastructure

