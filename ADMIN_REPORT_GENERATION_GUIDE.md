# Admin Report Generation - Complete Guide

## Overview

The Code4Care admin system now has a **comprehensive report generation framework** with multiple export formats, predefined templates, and future-ready scheduling capabilities.

---

## 🎯 Features

### ✅ **Export Formats**
- **PDF** - Professional formatted reports with charts and tables
- **Excel (.xlsx)** - Multi-sheet workbooks with data tables
- **CSV** - Simple data exports for spreadsheet analysis
- **JSON** - Raw data export for programmatic access

### ✅ **Report Types**
1. **Overview Report** - High-level snapshot of all metrics
2. **Activity Report** - User engagements, messages, and growth
3. **Demographics Report** - Age, gender, region distribution
4. **Safety Report** - Incidents, interventions, escalations
5. **Performance Report** - System metrics, uptime, response times
6. **Full Report** - Comprehensive export with all data
7. **Users Report** - Detailed user management data
8. **Support Report** - Support tickets and resolution metrics
9. **Custom Reports** - Build reports with specific metrics

### ✅ **Predefined Templates**
- Executive Summary
- Safety & Compliance Report
- User Engagement Analysis
- System Performance Report
- Support Requests Summary
- Monthly Comprehensive Report

---

## 📚 Implementation Details

### **New Services Created**

#### 1. **Excel Exporter** (`src/utils/excelExporter.ts`)
```typescript
import { generateAnalyticsExcelReport, exportTableToExcel } from '@/utils/excelExporter';

// Generate comprehensive Excel report
generateAnalyticsExcelReport(
  analyticsData,
  'overview',
  { startYear: 2025, endYear: 2025, label: '2025' },
  'report.xlsx'
);

// Export simple table
exportTableToExcel(
  [{ Name: 'John', Age: 25 }, { Name: 'Jane', Age: 30 }],
  'Users',
  'users.xlsx'
);
```

**Features:**
- Multi-sheet workbooks
- Auto-sized columns
- Formatted headers
- Metadata support

---

#### 2. **Report Orchestration Service** (`src/services/reportOrchestrationService.ts`)
```typescript
import { ReportOrchestrationService } from '@/services';

// Generate and export report
const report = await ReportOrchestrationService.generateAndExport({
  type: 'overview',
  period: 'month',
  format: 'excel',
  filters: {
    age_range: '15-19',
    region: 'Greater Accra'
  }
}, accessToken);

// Get report templates
const templates = ReportOrchestrationService.getReportTemplates();

// Generate custom report
const customReport = await ReportOrchestrationService.generateCustomReport(
  ['analytics', 'users', 'support'],
  'month',
  'pdf',
  accessToken
);

// Get report history
const history = ReportOrchestrationService.getReportHistory();
```

**Features:**
- Centralized report generation
- Multiple data source integration
- Template-based reports
- Report history tracking
- Custom metric selection

---

#### 3. **Admin Report Scheduler Component** (`src/components/AdminReportScheduler.tsx`)
```tsx
import { AdminReportScheduler } from '@/components/AdminReportScheduler';

<AdminReportScheduler accessToken={accessToken} />
```

**Features:**
- View scheduled reports
- Run reports on-demand
- Enable/disable schedules
- Template browser
- Recipient management (UI ready for backend)

---

## 🚀 Usage Examples

### **Example 1: Generate PDF Report**
```typescript
import { ReportOrchestrationService } from '@/services';

const generateMonthlyReport = async () => {
  const report = await ReportOrchestrationService.generateAndExport({
    type: 'full',
    period: 'month',
    format: 'pdf',
  }, accessToken);

  console.log(`Report generated: ${report.filename}`);
};
```

### **Example 2: Export Users to Excel**
```typescript
const exportUsers = async () => {
  const report = await ReportOrchestrationService.generateAndExport({
    type: 'users',
    period: 'month',
    format: 'excel',
    filters: {
      status: 'active',
      age_range: '15-19',
    },
  }, accessToken);
};
```

### **Example 3: Generate Custom Safety Report**
```typescript
const customSafetyReport = await ReportOrchestrationService.generateCustomReport(
  ['analytics', 'support'],
  'week',
  'csv',
  accessToken
);
```

### **Example 4: Use Report Template**
```typescript
const template = ReportOrchestrationService.getReportTemplate('executive-summary');

if (template) {
  const report = await ReportOrchestrationService.generateAndExport({
    type: template.type,
    period: template.defaultPeriod,
    format: template.defaultFormat,
  }, accessToken);
}
```

---

## 📊 Report Data Sources

### **Analytics Data**
- Dashboard summary (users, engagements, messages)
- Topic analytics (most discussed topics)
- User analytics (retention, demographics)
- Safety analytics (incidents, interventions)
- Performance metrics (uptime, response time)

### **User Management Data**
- User list with filters
- User details with statistics
- Chat history
- Engagement metrics
- Safety profiles

### **Support Request Data**
- Support ticket list
- Request details
- Resolution metrics
- Consultant assignments
- Queue statistics

### **System Health Data**
- API health status
- Readiness checks
- Version information
- Service availability

---

## 🎨 Report Templates

### **1. Executive Summary**
- **Type:** Overview
- **Period:** Monthly
- **Format:** PDF
- **Includes:** Total users, engagements, safety incidents, system uptime
- **Best For:** Leadership updates, board meetings

### **2. Safety & Compliance Report**
- **Type:** Safety
- **Period:** Monthly
- **Format:** Excel
- **Includes:** Panic exits, crisis interventions, escalations, follow-ups
- **Best For:** Compliance audits, safety reviews

### **3. User Engagement Analysis**
- **Type:** Users
- **Period:** Monthly
- **Format:** Excel
- **Includes:** Active users, retention, demographics, session duration
- **Best For:** Product planning, user research

### **4. System Performance Report**
- **Type:** Performance
- **Period:** Weekly
- **Format:** PDF
- **Includes:** Response time, uptime, error rate, throughput
- **Best For:** Technical reviews, SLA monitoring

### **5. Support Requests Summary**
- **Type:** Support
- **Period:** Monthly
- **Format:** Excel
- **Includes:** Total requests, resolution time, satisfaction, backlog
- **Best For:** Support team performance, capacity planning

### **6. Monthly Comprehensive Report**
- **Type:** Full
- **Period:** Monthly
- **Format:** Excel
- **Includes:** All metrics across all categories
- **Best For:** Quarterly reviews, comprehensive analysis

---

## 🔧 Integration with Existing Components

### **Update AdminReports.tsx**
```tsx
import { ReportOrchestrationService } from '@/services/reportOrchestrationService';
import { generateAnalyticsExcelReport } from '@/utils/excelExporter';

// Add Excel export button handler
const handleExportExcel = () => {
  if (!analyticsData) return;

  const filename = `code4care-${reportType}-report-${reportRangeLabel}.xlsx`;
  generateAnalyticsExcelReport(
    analyticsData,
    reportType,
    { startYear, endYear, label: reportRangeLabel },
    filename
  );
};
```

---

## 📅 Scheduled Reports (Future Backend Integration)

### **Frontend Ready Features:**
- Schedule creation UI
- Frequency selection (daily, weekly, monthly, quarterly)
- Recipient management
- Enable/disable schedules
- Run reports on-demand

### **Backend Integration Points:**
```typescript
// When backend endpoints are available

// Create scheduled report
POST /admin/reports/schedules
{
  "template_id": "executive-summary",
  "name": "Monthly Executive Summary",
  "frequency": "monthly",
  "format": "pdf",
  "recipients": ["admin@example.com"],
  "enabled": true
}

// List scheduled reports
GET /admin/reports/schedules

// Update schedule
PUT /admin/reports/schedules/{schedule_id}

// Delete schedule
DELETE /admin/reports/schedules/{schedule_id}

// Trigger immediate run
POST /admin/reports/schedules/{schedule_id}/run
```

---

## 📝 Report History

```typescript
// Get report history
const history = ReportOrchestrationService.getReportHistory();

history.forEach((report) => {
  console.log(`${report.filename} - Generated: ${report.generatedAt}`);
});

// Clear history
ReportOrchestrationService.clearReportHistory();
```

---

## 🎯 Advanced Features

### **Custom Reports**
```typescript
// Build report with specific metrics only
const report = await ReportOrchestrationService.generateCustomReport(
  ['analytics', 'users', 'health'],
  'month',
  'json',
  accessToken
);
```

### **Filtered Reports**
```typescript
const filteredReport = await ReportOrchestrationService.generateAndExport({
  type: 'users',
  period: 'month',
  format: 'csv',
  filters: {
    age_range: '20-24',
    gender: 'female',
    region: 'Greater Accra',
    status: 'active',
  },
}, accessToken);
```

### **System Health Reports**
```typescript
const healthStatus = await ReportOrchestrationService.getSystemHealthStatus();
console.log(healthStatus.health.status); // 'ok' | 'degraded' | 'down'
console.log(healthStatus.ready.database); // 'connected' | 'disconnected'
console.log(healthStatus.version.version); // API version
```

---

## 🔐 Security & Permissions

All report generation requires:
- ✅ Valid admin authentication token
- ✅ Admin or supervisor role
- ✅ Active session

Reports automatically:
- ✅ Anonymize sensitive data
- ✅ Apply data retention policies
- ✅ Log access for audit trails

---

## 📊 Report Formats Comparison

| Format | Best For | File Size | Editability | Charts | Multi-Sheet |
|--------|----------|-----------|-------------|--------|-------------|
| **PDF** | Sharing, Printing | Medium | No | ✅ Yes | No |
| **Excel** | Analysis, Editing | Large | Yes | ⚠️ Data only | ✅ Yes |
| **CSV** | Data Import | Small | Yes | No | No |
| **JSON** | API Integration | Small | No | No | No |

---

## 🚨 Troubleshooting

### **Report Generation Fails**
```typescript
try {
  const report = await ReportOrchestrationService.generateAndExport(config, accessToken);
} catch (error) {
  console.error('Report generation failed:', error);
  // Check:
  // 1. Valid access token
  // 2. Backend API is running
  // 3. Analytics data is available
}
```

### **Excel Export Issues**
Make sure `xlsx` library is installed:
```bash
npm install xlsx
```

### **PDF Generation Issues**
Make sure `jspdf` library is installed:
```bash
npm install jspdf
```

---

## 📦 Installation

### **Required Dependencies**
```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5"
  }
}
```

### **Install Command**
```bash
cd Code4Care-frt
npm install jspdf xlsx
```

---

## 🎓 Best Practices

1. **Use Templates** - Leverage predefined templates for consistency
2. **Schedule Reports** - Automate recurring reports when backend is ready
3. **Filter Data** - Use filters to reduce report size and improve relevance
4. **Choose Format Wisely** - PDF for sharing, Excel for analysis
5. **Track History** - Monitor generated reports for auditing
6. **Test Before Scheduling** - Run reports manually first

---

## 📚 Complete Example

```typescript
import { ReportOrchestrationService } from '@/services';

async function generateComprehensiveMonthlyReport() {
  // 1. Get executive summary template
  const template = ReportOrchestrationService.getReportTemplate('executive-summary');

  if (!template) {
    throw new Error('Template not found');
  }

  // 2. Generate PDF for leadership
  const pdfReport = await ReportOrchestrationService.generateAndExport({
    type: template.type,
    period: 'month',
    format: 'pdf',
  }, accessToken);

  console.log(`PDF Report: ${pdfReport.filename}`);

  // 3. Generate Excel for detailed analysis
  const excelReport = await ReportOrchestrationService.generateAndExport({
    type: 'full',
    period: 'month',
    format: 'excel',
  }, accessToken);

  console.log(`Excel Report: ${excelReport.filename}`);

  // 4. Export user data for CRM
  const usersReport = await ReportOrchestrationService.generateAndExport({
    type: 'users',
    period: 'month',
    format: 'csv',
    filters: {
      status: 'active',
    },
  }, accessToken);

  console.log(`Users CSV: ${usersReport.filename}`);

  // 5. Check report history
  const history = ReportOrchestrationService.getReportHistory();
  console.log(`Total reports generated: ${history.length}`);
}
```

---

## 🔮 Future Enhancements (Backend Integration Needed)

1. **Email Delivery** - Send reports via email
2. **Cloud Storage** - Save reports to S3/Azure
3. **Report Archives** - Historical report retrieval
4. **Custom SQL Queries** - Advanced data extraction
5. **Real-time Dashboards** - Live report generation
6. **Webhook Notifications** - Alert on report completion
7. **Report Comparison** - Compare periods side-by-side

---

## ✅ Summary

### **What's Available Now:**
- ✅ **4 Export Formats** (PDF, Excel, CSV, JSON)
- ✅ **9 Report Types**
- ✅ **6 Predefined Templates**
- ✅ **Report Orchestration Service**
- ✅ **Excel Export Utility**
- ✅ **Scheduler UI Component**
- ✅ **Report History Tracking**
- ✅ **Custom Report Builder**
- ✅ **System Health Integration**

### **Ready for Backend Integration:**
- 🔜 Automated scheduling
- 🔜 Email delivery
- 🔜 Cloud storage
- 🔜 Historical archives

---

**Your admin report generation system is now production-ready!** 🎉

All components are fully functional in the frontend and ready for backend integration when needed.
