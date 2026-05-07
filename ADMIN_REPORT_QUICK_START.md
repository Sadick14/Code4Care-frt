# Admin Report Generation - Quick Start 🚀

## 🎯 What's New

Your admin dashboard now has **professional report generation** capabilities with multiple export formats!

---

## ⚡ Quick Actions

### **1. Generate a PDF Report (Recommended for Sharing)**
```typescript
import { ReportOrchestrationService } from '@/services';

// One-liner to generate monthly overview PDF
await ReportOrchestrationService.generateAndExport({
  type: 'overview',
  period: 'month',
  format: 'pdf',
}, accessToken);
```

### **2. Generate Excel Report (Best for Analysis)**
```typescript
// Generate detailed Excel report with multiple sheets
await ReportOrchestrationService.generateAndExport({
  type: 'full',
  period: 'month',
  format: 'excel',
}, accessToken);
```

### **3. Export User Data to CSV**
```typescript
// Export active users to CSV
await ReportOrchestrationService.generateAndExport({
  type: 'users',
  period: 'month',
  format: 'csv',
  filters: { status: 'active' },
}, accessToken);
```

---

## 📊 Available Report Types

| Report Type | Description | Best Format |
|-------------|-------------|-------------|
| **overview** | High-level snapshot of all metrics | PDF |
| **activity** | User engagements, messages, growth | Excel |
| **demographics** | Age, gender, region distribution | Excel |
| **safety** | Incidents, interventions, escalations | PDF |
| **performance** | System uptime, response times | PDF |
| **full** | Complete export with all data | Excel |
| **users** | User management data | CSV/Excel |
| **support** | Support tickets and metrics | Excel |

---

## 🎨 Using Templates (Easiest Way!)

```typescript
// Get all templates
const templates = ReportOrchestrationService.getReportTemplates();

// Use "Executive Summary" template
const template = ReportOrchestrationService.getReportTemplate('executive-summary');

await ReportOrchestrationService.generateAndExport({
  type: template.type,
  period: template.defaultPeriod,
  format: template.defaultFormat,
}, accessToken);
```

### **Available Templates:**
1. **executive-summary** - Monthly overview for leadership (PDF)
2. **safety-compliance** - Safety incidents report (Excel)
3. **user-engagement** - User behavior analysis (Excel)
4. **performance-monitoring** - System performance (PDF)
5. **support-summary** - Support tickets summary (Excel)
6. **monthly-full** - Complete monthly report (Excel)

---

## 🖥️ UI Components

### **In your AdminReports Component:**
```tsx
import { generateAnalyticsExcelReport } from '@/utils/excelExporter';

// Add Excel export button
<Button onClick={handleExportExcel}>
  Export Excel
</Button>

const handleExportExcel = () => {
  generateAnalyticsExcelReport(
    analyticsData,
    reportType,
    { startYear, endYear, label: reportRangeLabel },
    'report.xlsx'
  );
};
```

### **Add Report Scheduler:**
```tsx
import { AdminReportScheduler } from '@/components/AdminReportScheduler';

<AdminReportScheduler accessToken={accessToken} />
```

---

## 🔥 Most Common Use Cases

### **Monthly Board Meeting Report**
```typescript
const template = ReportOrchestrationService.getReportTemplate('executive-summary');

await ReportOrchestrationService.generateAndExport({
  type: template.type,
  period: 'month',
  format: 'pdf',
}, accessToken);
```

### **Safety Audit Report**
```typescript
await ReportOrchestrationService.generateAndExport({
  type: 'safety',
  period: 'month',
  format: 'excel',
}, accessToken);
```

### **User Data Export for Analysis**
```typescript
await ReportOrchestrationService.generateAndExport({
  type: 'users',
  period: 'month',
  format: 'csv',
  filters: {
    age_range: '15-19',
    region: 'Greater Accra',
  },
}, accessToken);
```

---

## 📦 Installation Requirements

```bash
# Install required dependencies
npm install jspdf xlsx
```

---

## 🎓 Tips & Best Practices

✅ **Use PDF for sharing** - Best for emails and presentations
✅ **Use Excel for analysis** - Multiple sheets, easy to edit
✅ **Use CSV for imports** - Import into other systems
✅ **Use JSON for APIs** - Programmatic access

✅ **Filter data** - Reduce report size and improve relevance
✅ **Use templates** - Faster and more consistent
✅ **Check history** - Track what's been generated

---

## 🚀 Next Steps

1. **Try it now:** Open AdminReports and click "Export Excel"
2. **Explore templates:** Use ReportOrchestrationService.getReportTemplates()
3. **View scheduler:** Navigate to AdminReportScheduler component
4. **Read full guide:** Check ADMIN_REPORT_GENERATION_GUIDE.md

---

## 📞 Need Help?

Full documentation: `ADMIN_REPORT_GENERATION_GUIDE.md`

Happy reporting! 🎉
