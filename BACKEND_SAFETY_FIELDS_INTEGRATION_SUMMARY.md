# Backend Integration & Safety Fields Analysis
**Date:** May 9, 2026  
**Scope:** Backend integration documentation and harm-field handling  
**Status:** ⚠️ PARTIAL CONTRACT - Backend expectations not fully documented

---

## Executive Summary

The frontend is actively **sending safety metrics in the `/v1/chat/event` metadata field**, but backend API documentation does not explicitly specify:
- Whether these fields are expected/required
- How the backend processes these metadata fields
- Field naming conventions for safety data in metadata

---

## 1. Backend Integration Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| **COMPLETE_FIELD_COMPATIBILITY_AUDIT.md** | `/workspaces/Code4Care-frt/` | Comprehensive endpoint validation report (10 POST, 7 GET endpoints) |
| **FIELD_COMPATIBILITY_REPORT.md** | `/workspaces/Code4Care-frt/` | Frontend vs Backend field compatibility analysis |
| **BACKEND_API_IMPLEMENTATION.md** | `src/services/` | Service module implementation guide (APIClient, AuthService, StaffAccessService, etc.) |
| **BACKEND_INTEGRATION_GUIDE.ts** | `src/services/` | TypeScript documentation with code examples for all services |
| **userTrackingService.ts** | `src/services/` | Event logging service, defines LogChatEventPayload interface |
| **userEngagementService.ts** | `src/services/` | User engagement tracking, implements logChatEvent() method |
| **enhancedChatService.ts** | `src/services/` | Chat history retrieval with safety_summary in response |

---

## 2. `/v1/chat/event` Endpoint Contract

### Official Documentation (from COMPLETE_FIELD_COMPATIBILITY_AUDIT.md)

```
✅ 6. POST /v1/chat/event
- Request: session_id, event_type, event_category?, topic?, input_method?
- Response: id, session_id, event_type, event_category?, topic?, input_method?, created_at
- Status: Perfect match
- HTTP Status: 200
```

**Note:** Documentation is **silent on `metadata` field** specification.

### Interface Definition (userTrackingService.ts)

```typescript
export interface EventLogRequest {
  session_id: string;
  conversation_id?: string;
  event_type: string;
  event_category?: string;
  topic?: string;
  input_method?: string;
  metadata?: Record<string, unknown>;  // ← Generic, accepts any fields
}

export interface EventLogResponse {
  id: string;
  session_id: string;
  conversation_id?: string;
  event_type: string;
  event_category?: string;
  topic?: string;
  input_method?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
```

---

## 3. Safety Fields Being Sent to Backend

### Fields Frontend Is Sending

The [ChatInterface.tsx](src/components/ChatInterface.tsx) component sends these safety fields **in metadata**:

```typescript
// Lines 358-370: logChatEvent with safety metrics
UserEngagementService.logChatEvent({
  session_id: sessionId,
  event_type: 'bot_response_received',
  event_category: response.safety_flags.length ? 'safety' : 'engagement',
  input_method: 'system',
  metadata: {
    response_time_ms: response.response_time_ms,
    language_detected: response.language_detected,
    citations_count: response.citations.length,
    harm_count: response.safety_flags.length,                    // ← SAFETY FIELD
    self_harm_mentions: countSafetyFlags(...),                   // ← SAFETY FIELD
    suicidal_ideation_mentions: countSafetyFlags(...),          // ← SAFETY FIELD
    risks_escalated_to_human: countSafetyFlags(...),            // ← SAFETY FIELD
    safety_flags_count: response.safety_flags.length,
  },
})
```

### Field Definitions Across Codebase

| Field | Type | Used By | Definition |
|-------|------|---------|-----------|
| `safety_summary` | object | enhancedChatService | From ChatSessionHistoryResponse (flags_triggered, escalations, crisis_interventions) |
| `harm_count` | number | ChatInterface.tsx | = response.safety_flags.length |
| `self_harm_mentions` | number | ChatInterface.tsx | Count of flags with 'self-harm' or 'self_harm' |
| `suicidal_ideation_mentions` | number | ChatInterface.tsx | Count of flags with 'suicidal' or 'suicidal_ideation' |
| `risks_escalated_to_human` | number | ChatInterface.tsx | Count of flags with 'consultant' or 'escalat' |

**Files referencing these fields:**
- [src/services/userManagementService.ts](src/services/userManagementService.ts#L25-26) - Type definitions
- [src/components/ChatInterface.tsx](src/components/ChatInterface.tsx#L367-370) - Actual usage in event logging
- [src/components/AdminReports.tsx](src/components/AdminReports.tsx#L187-190) - Analytics display with multi-key fallback
- [src/services/realAnalyticsService.ts](src/services/realAnalyticsService.ts#L316-320) - Field name alias mapping
- [src/components/AdminSafetyManagement.tsx](src/components/AdminSafetyManagement.tsx#L62-75) - Safety dashboard display

---

## 4. Backend Metadata Processing

### What Happens to Metadata

**From documentation:**
- The `/v1/chat/event` endpoint accepts `metadata?: Record<string, unknown>`
- The backend returns `metadata?: Record<string, unknown>` in responses
- **No specification** of how metadata is processed, stored, or used

### Defensive Normalization Layer

The frontend has a **robust normalization layer** in [realAnalyticsService.ts](src/services/realAnalyticsService.ts#L316-320) for analytics:

```typescript
// Multiple field name aliases for each metric
{
  self_harm_mentions: ['self_harm_mentions', 'selfHarmMentions', 'self_harm_mentions_detected'],
  suicidal_ideation_mentions: ['suicidal_ideation_mentions', 'suicidalIdeationMentions', 'suicidal_ideation'],
  risks_escalated_to_human: ['risks_escalated_to_human', 'risksEscalatedToHuman', 'total_escalated'],
}
```

**This normalizer:**
- Accepts multiple field name variations (snake_case, camelCase)
- Attempts fallback field lookups
- Returns `0` if no match found
- **Used only for analytics endpoint responses, NOT for chat event metadata**

---

## 5. Admin Analytics & Dashboard

### Safety Metrics Display Pipeline

**Path:** ChatInterface → logChatEvent (metadata) → Backend `/v1/chat/event`  
↓  
**Retrieved:** AdminReports/EnhancedAdminDashboard → GET `/analytics/safety`  
↓  
**Display:** Mapping through realAnalyticsService normalizer

### Admin Components Using Safety Fields

1. **AdminReports.tsx** ([Line 187-190](src/components/AdminReports.tsx#L187-190))
   - Attempts to fetch `self_harm_mentions`, `selfHarmMentions`, `self_harm_mentions_detected`
   - Also fetches `suicidal_ideation_mentions`, `suicidalIdeationMentions`, `suicidal_ideation`
   - And `risks_escalated_to_human`, `risksEscalatedToHuman`, `total_escalated`

2. **EnhancedAdminDashboard.tsx** ([Line 335-336](src/components/EnhancedAdminDashboard.tsx#L335-336))
   - Displays "Self-Harm Mentions" and "Suicidal Ideation" cards
   - Uses same multi-key fallback pattern

3. **AdminSafetyManagement.tsx** ([Line 62-75](src/components/AdminSafetyManagement.tsx#L62-75))
   - Shows "Self-Harm Mentions", "Suicidal Ideation", "Escalated Risks"
   - Calls `getNumber(safetyData, 'risks_escalated_to_human', 'risksEscalatedToHuman', 'total_escalated')`

**Issue:** These fields are queried from GET `/analytics/safety` endpoint, not from `/v1/chat/event` metadata

---

## 6. Identified Gaps

### Gap 1: No Explicit Metadata Contract for /v1/chat/event
- ❌ Backend API documentation doesn't specify expected metadata fields
- ❌ No specification of whether `harm_count`, `self_harm_mentions`, etc. are indexed/stored
- ❌ No specification of how metadata is aggregated or made available in analytics endpoints
- ✅ Code works - metadata field accepts any Record<string, unknown>

### Gap 2: Disconnect Between Event Logging and Analytics Retrieval
- **Frontend sends:** Safety metrics in `/v1/chat/event` metadata
- **Frontend retrieves:** Safety metrics from GET `/analytics/safety` endpoint
- **Missing link:** No documented path showing how metadata flows to analytics endpoint

### Gap 3: Field Naming Inconsistencies
- Frontend sends: `harm_count`, `self_harm_mentions`, `suicidal_ideation_mentions`, `risks_escalated_to_human`
- Analytics normalizer expects: Multiple aliases per field
- No backend specification of which names are "canonical"

### Gap 4: Multiple Field Name Variations
The realAnalyticsService normalizer handles these variations:
```
self_harm_mentions → ['self_harm_mentions', 'selfHarmMentions', 'self_harm_mentions_detected']
suicidal_ideation_mentions → ['suicidal_ideation_mentions', 'suicidalIdeationMentions', 'suicidal_ideation']
risks_escalated_to_human → ['risks_escalated_to_human', 'risksEscalatedToHuman', 'total_escalated']
```
**Question:** Which variations does the backend actually produce?

---

## 7. Backend Endpoint Summary

### Public Endpoints Handling Safety

| Endpoint | Method | Purpose | Safety Fields? |
|----------|--------|---------|-----------------|
| `/v1/chat/event` | POST | Log chat interaction events | ⚠️ Optional in metadata |
| `/v1/safety/panic` | POST | Log panic button activation | No - separate endpoint |
| `/v1/safety/crisis` | POST | Log crisis detection | No - separate endpoint |
| `/analytics/safety` | GET | Retrieve safety analytics | ✅ Yes - self_harm_mentions, suicidal_ideation_mentions, risks_escalated_to_human |
| `/analytics/session` | POST | Submit session analytics | ✅ Yes - safety_flags array |

### Admin Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Any `/api/admin/incidents*` | GET/POST | Safety incidents | 🔴 Not implemented (returns 404) |

---

## 8. Implementation Status

### ✅ What IS Documented
1. Basic endpoint contracts (request/response fields)
2. TypeScript interface definitions
3. Service method implementations
4. Example usage in BACKEND_INTEGRATION_GUIDE.ts
5. Field compatibility audit and fixes
6. Analytics normalization layer

### ❌ What IS NOT Documented
1. How `/v1/chat/event` metadata fields are processed by backend
2. How metadata connects to `/analytics/safety` aggregation
3. Expected metadata field names and types
4. Backend field name normalization (if any)
5. Storage/indexing of metadata fields
6. Whether `harm_count`, `self_harm_mentions`, etc. are enforced/optional

---

## 9. Verification Checklist

- [x] Files documenting backend integration identified
- [x] Safety fields being sent identified (ChatInterface.tsx metadata)
- [x] `/v1/chat/event` endpoint contract found (documentation is minimal)
- [x] Admin analytics components identified (using GET `/analytics/safety`)
- [x] Defensive normalization layer documented
- [x] Gaps identified between frontend sends vs backend contract
- [ ] Backend explicitly confirms field acceptance
- [ ] Backend field normalization process documented
- [ ] Metadata → analytics aggregation process documented

---

## 10. Recommendations

### For Clarification
1. **Backend specification needed:** Document what fields are expected in `/v1/chat/event` metadata
2. **Field naming standard:** Establish canonical field names (snake_case vs camelCase)
3. **Analytics mapping:** Document how metadata fields flow to `/analytics/safety` endpoint
4. **Storage contract:** Specify which metadata fields are indexed/queryable

### For Implementation
1. Update [BACKEND_INTEGRATION_GUIDE.ts](src/services/BACKEND_INTEGRATION_GUIDE.ts) with metadata field examples
2. Add JSDoc comments to LogChatEventPayload metadata explaining expected fields
3. Create backend API specification markdown documenting metadata schema
4. Verify backend processes all safety fields from metadata correctly

