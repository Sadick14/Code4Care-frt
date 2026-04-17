# Admin Dashboard Quick Reference

## How to Access the Admin Dashboard

### Step 1: Click Analytics Button
- Look for the **"Analytics"** button in the top-right corner of the header
- This button appears on desktop/tablet (hidden on mobile)

### Step 2: Admin Login
- Enter any email and password (demo mode accepts any credentials)
- Click "Sign In"

### Step 3: View Dashboard
- Full-screen analytics dashboard loads
- Click **"Exit Admin"** button (bottom-right) to return to user mode

---

## Dashboard Sections

### 📊 **Overview Tab** (Default Landing)
Your executive summary with:
- 4 Key Performance Indicators at the top
- User demographics (age, gender, language)
- Current safety metrics
- Engagement trends graph
- Historical trend data

**Use this when:** You need a quick health check of the platform

---

### 👥 **User Journey Tab**
Funnel analysis showing user progression:
- Total visitors → Onboarding → Chat → Story Mode → Pharmacy → Crisis Support
- Conversion rates between each stage
- Identify where users drop off

**Use this when:** Improving user activation or identifying friction points

---

### 💬 **Topics Tab**
Detailed engagement by topic category:
- Contraception, STIs, Pregnancy, Menstruation, Relationships, Puberty, Consent, Mental Health
- Number of inquiries per topic
- User satisfaction ratings (1-5)
- Time spent discussing each topic

**Use this when:** Deciding which topics need more content or refinement

---

### 📚 **Content Performance Tab**
Story Mode module effectiveness:
- Which modules users start vs complete
- Completion rates
- Average quiz scores
- User usefulness ratings

**Use this when:** Planning educational content updates or expansions

---

### 🚨 **Safety & Crisis Tab**
Critical safety incident tracking:
- Panic exits (today + total)
- Crisis interventions triggered
- Self-harm mentions detected
- Suicidal ideation mentions
- Abuse mentions
- User follow-ups completed

**Use this when:** Monitoring user wellbeing and safety protocols

---

### 🧠 **Insights Tab**
AI-generated recommendations and alerts:
- **Green (Opportunity)**: Growth opportunities
- **Red (Warning)**: Safety/retention concerns needing action
- **Blue (Recommendation)**: Specific action items
- **Orange (Trend)**: Emerging patterns

Click any insight card to expand and see detailed suggested actions.

**Use this when:** Making strategic decisions about program improvements

---

### 🔍 **Content Gaps Tab**
Identifies unmet user information needs:
- Topics with highest unmet demand
- Frequently asked questions users are asking
- Which age groups need this content most
- Confidence levels in current coverage
- Recommended content creation priorities

**Use this when:** Planning new content development

---

### ⚙️ **Performance Tab**
System health metrics:
- Response time (target: <300ms)
- System uptime (target: >99.9%)
- Message processing success rate
- Hours since last downtime

**Use this when:** Monitoring technical health or troubleshooting issues

---

## Key Metrics Explained

### Demographics
- **Age Range**: 10-14, 15-19, 20-24, 25+ - helps tailor content to audience
- **Gender**: Tracks inclusivity and who is engaging with platform
- **Language**: Shows geographic reach and language demand

### Engagement
- **Active Users**: Total engaged users in selected time period
- **Total Sessions**: Number of chat sessions started
- **Avg Engagement Time**: Minutes/seconds spent per session
- **Satisfaction Score**: 1-5 average from user ratings

### Retention
- **Day-1 Retention**: % returning next day
- **Day-7 Retention**: % returning after one week (key metric)
- **Churn Rate**: % becoming inactive

### Funnel Conversion
- **Onboarding → Chat**: What % complete first chat
- **Chat → Story Mode**: What % try educational modules
- **Chat → Pharmacy**: What % access medication information

### Safety
- **Panic Exits**: Users who activated panic button
- **Crisis Interventions**: Times crisis support was needed
- **Escalations**: Cases requiring human staff attention

---

## Period Selector

Toggle between time windows:
- **Today**: Last 24 hours of activity
- **This Week**: Rolling 7-day period
- **This Month**: Last 30 days

All metrics update when period changes.

---

## Color Coding System

### Chart/Card Colors
- 🔵 **Blue** (#0048ff): Primary/positive metrics
- 🟡 **Orange** (#ff7b6e): Warning/attention needed
- 🟢 **Green** (#10b981): Success/targets met
- 🔴 **Red** (#ef4444): Critical/immediate action

### Insight Priority Levels
- 🔴 **High**: Immediate attention required
- 🟠 **Medium**: Address within 1 week
- 🔵 **Low**: Improvement opportunity but not urgent

---

## Common Tasks

### "I want to know which topics need content development"
1. Go to **Topics** tab
2. OR go to **Content Gaps** tab
3. Look for highest inquiry counts or unmet demand
4. Review "Recommended Action" column

### "I'm concerned about user safety"
1. Go to **Safety & Crisis** tab
2. Check panic exit count (elevated = concern)
3. Check crisis interventions (shows need for support)
4. Review escalations to human staff

### "Why are users dropping off?"
1. Go to **User Journey** tab
2. Identify stage with lowest conversion %
3. Check **Insights** for recommended improvements
4. Example: If 30% drop from onboarding → chat, onboarding flow may need simplification

### "How are our educational modules performing?"
1. Go to **Content Performance** tab
2. Compare completion rates across modules
3. Check average scores (low score = confusing content)
4. Review usefulness ratings (4.5+ is excellent)

### "Are we reaching our target demographics?"
1. Go to **Overview** tab
2. Review demographic breakdown charts
3. Check language preferences
4. Adjust content/marketing if underrepresenting key groups

### "Show me what I should focus on next"
1. Go to **Insights** tab
2. Review all insights, sorted by priority
3. Look for "High Priority" items
4. Read suggested actions
5. Filter by type: Opportunities, Warnings, Recommendations

---

## Data Interpretation Tips

### Green Light Indicators ✅
- Day-7 retention >45%
- Satisfaction scores >4.0
- Funnel conversion >30% between stages
- Module completion rates >30%
- System uptime >99%

### Yellow Flag Indicators ⚠️
- Day-7 retention 30-45% (declining)
- Satisfaction scores 3.0-3.9 (moderate)
- Panic exits increasing trend
- Content gaps with high unmet demand
- Any story module completion <25%

### Red Alert Indicators 🚨
- Day-7 retention <30% (losing users)
- Multiple crisis interventions same day
- Self-harm or suicidal mentions increasing
- System uptime <95%
- Module completion rates <10% (major issues)

---

## Export & Sharing

### Export Report
1. Click **"Export Report"** button (top-right)
2. Saves comprehensive analytics PDF
3. Share with stakeholders/team

---

## Admin Mode Limitations (Demo)

Current demo uses realistic mock data. In production:
- Real user data will be tracked
- Updates will be real-time or near real-time
- More granular drill-down available
- Custom date ranges for trends
- Comparative analysis (week-over-week, etc.)

---

## Questions & Troubleshooting

### "Why can't I see admin button?"
- Mobile/tablet: Button hidden; use Analytics link in settings menu (planned)
- Desktop: Button appears in top-right corner, next to panic button

### "Do I need special admin credentials?"
- Current demo: Any email/password works
- Production: Real authentication required

### "Can I change what metrics are shown?"
- Current: Pre-configured for program effectiveness
- Custom metrics available for production integration

### "How often is this data updated?"
- Demo: Static snapshot
- Production: Real-time or (refreshed every N minutes)

---

## Next Steps for Your Organization

Recommended admin actions based on dashboard signals:

1. **If high unmet demand in Content Gaps**
   - Prioritize content creation for those topics
   - Target age groups with highest demand

2. **If low retention rates**
   - Review user onboarding experience
   - Check if early messaging is resonating
   - Improve first-chat experience

3. **If safety incidents elevated**
   - Review recent chat content for triggering material
   - Ensure crisis resources are prominent
   - Escalate for human follow-up if needed

4. **If certain topics/modules underperforming**
   - Gather user feedback on unclear areas
   - Simplify or redesign that content
   - Track improvement in next reporting period

5. **If certain demographics underrepresented**
   - Review marketing efforts to those groups
   - Ensure content culturally relevant
   - Consider language-specific outreach

---

**Pro Tip**: Review the Insights tab weekly for AI-generated recommendations. It synthesizes all metrics to give you actionable next steps.

**Last Updated**: 2024
**Questions?** Contact your analytics administrator or development team.
