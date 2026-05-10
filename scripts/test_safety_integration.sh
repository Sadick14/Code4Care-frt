#!/usr/bin/env bash
set -euo pipefail

# Usage: API_BASE_URL, TOKEN, ADMIN_TOKEN (optional), SESSION_ID (optional)
# Example:
# API_BASE_URL="https://api.example.com" TOKEN="$TOKEN" ADMIN_TOKEN="$ADMIN_TOKEN" ./scripts/test_safety_integration.sh

API_BASE_URL=${API_BASE_URL:?"API_BASE_URL env required"}
TOKEN=${TOKEN:?"TOKEN env required"}
ADMIN_TOKEN=${ADMIN_TOKEN:-$TOKEN}
SESSION_ID=${SESSION_ID:-"test-session-$(date +%s)"}

echo "API_BASE_URL=$API_BASE_URL"
echo "SESSION_ID=$SESSION_ID"

jq_exists() {
  command -v jq >/dev/null 2>&1
}

POST_JSON() {
  local url="$1"; shift
  if jq_exists; then
    curl -sS -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$1" "$url" | jq .
  else
    curl -sS -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$1" "$url"
  fi
}

POST_ADMIN_JSON() {
  local url="$1"; shift
  if jq_exists; then
    curl -sS -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "$1" "$url" | jq .
  else
    curl -sS -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "$1" "$url"
  fi
}

# 1) POST chat event with safety metadata
CHAT_EVENT_PAYLOAD=$(cat <<JSON
{
  "session_id": "${SESSION_ID}",
  "event_type": "bot_response",
  "metadata": {
    "self_harm_mentions": 1,
    "suicidal_ideation_mentions": 0,
    "risks_escalated_to_human": 0,
    "harm_count": 1
  }
}
JSON
)

echo "\n== Posting /v1/chat/event =="
POST_JSON "${API_BASE_URL}/v1/chat/event" "$CHAT_EVENT_PAYLOAD" || echo "chat event POST failed"

# 2) POST crisis event
CRISIS_PAYLOAD=$(cat <<JSON
{
  "session_id": "${SESSION_ID}",
  "conversation_id": "conversation-${SESSION_ID}",
  "crisis_type": "self_harm",
  "confidence": 0.92,
  "intervention_triggered": false,
  "escalated_to_human": false
}
JSON
)

echo "\n== Posting /v1/safety/crisis =="
POST_JSON "${API_BASE_URL}/v1/safety/crisis" "$CRISIS_PAYLOAD" || echo "crisis POST failed"

# 3) GET safety analytics (admin)
echo "\n== GET /analytics/safety (admin) =="
if jq_exists; then
  curl -sS -H "Authorization: Bearer $ADMIN_TOKEN" "${API_BASE_URL}/analytics/safety?period=week" | jq .
else
  curl -sS -H "Authorization: Bearer $ADMIN_TOKEN" "${API_BASE_URL}/analytics/safety?period=week"
fi

# 4) GET chat session history including metadata
echo "\n== GET /v1/chat/session/{session_id}?include_metadata=true =="
if jq_exists; then
  curl -sS -H "Authorization: Bearer $TOKEN" "${API_BASE_URL}/v1/chat/session/${SESSION_ID}?include_metadata=true" | jq .
else
  curl -sS -H "Authorization: Bearer $TOKEN" "${API_BASE_URL}/v1/chat/session/${SESSION_ID}?include_metadata=true"
fi

echo "\nDone. Inspect outputs above to confirm whether metadata was persisted and whether analytics aggregated the safety counts."
