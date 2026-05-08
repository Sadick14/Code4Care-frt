/**
 * Excel Export Utility
 * Generates Excel (.xlsx) files from report data
 * Uses SheetJS (xlsx) library for Excel generation
 */

import * as XLSX from 'xlsx';
import { formatLocaleLabel } from '@/utils/labelUtils';

export interface ExcelSheetData {
  sheetName: string;
  data: Array<Record<string, string | number | boolean>>;
  columnWidths?: number[];
}

export interface ExcelReportOptions {
  filename: string;
  sheets: ExcelSheetData[];
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    company?: string;
  };
}

/**
 * Generate and download Excel file from multiple sheets
 */
export function generateExcelReport(options: ExcelReportOptions): void {
  const workbook = XLSX.utils.book_new();

  // Set workbook metadata
  if (options.metadata) {
    workbook.Props = {
      Title: options.metadata.title || 'Report',
      Author: options.metadata.author || 'Code4Care Admin',
      Subject: options.metadata.subject || 'Analytics Report',
      Company: options.metadata.company || 'Code4Care',
      CreatedDate: new Date(),
    };
  }

  // Add each sheet
  options.sheets.forEach((sheetData) => {
    const worksheet = XLSX.utils.json_to_sheet(sheetData.data);

    // Set column widths if provided
    if (sheetData.columnWidths) {
      worksheet['!cols'] = sheetData.columnWidths.map((width) => ({ wch: width }));
    } else {
      // Auto-calculate column widths
      const cols: { wch: number }[] = [];
      const keys = Object.keys(sheetData.data[0] || {});

      keys.forEach((key) => {
        const maxLength = Math.max(
          key.length,
          ...sheetData.data.map((row) => String(row[key] || '').length)
        );
        cols.push({ wch: Math.min(maxLength + 2, 50) });
      });

      worksheet['!cols'] = cols;
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.sheetName);
  });

  // Generate and download file
  XLSX.writeFile(workbook, options.filename);
}

/**
 * Generate comprehensive analytics Excel report
 */
export function generateAnalyticsExcelReport(
  analyticsData: any,
  reportType: string,
  reportRange: { startYear: number; endYear: number; label: string },
  filename: string
): void {
  const sheets: ExcelSheetData[] = [];

  // Summary sheet
  sheets.push({
    sheetName: 'Summary',
    data: [
      {
        Metric: 'Report Type',
        Value: reportType,
      },
      {
        Metric: 'Report Period',
        Value: reportRange.label,
      },
      {
        Metric: 'Generated At',
        Value: new Date().toLocaleString(),
      },
      {
        Metric: 'Total Active Users',
        Value: analyticsData.demographics?.totalActiveUsers || 0,
      },
      {
        Metric: 'Total Conversations',
        Value: analyticsData.summary?.conversations_in_period || 0,
      },
      {
        Metric: 'Total Messages',
        Value: analyticsData.summary?.messages_in_period || 0,
      },
      {
        Metric: 'System Uptime',
        Value: `${analyticsData.performance?.systemUptime || 0}%`,
      },
      {
        Metric: 'Avg Response Time',
        Value: `${analyticsData.performance?.avgResponseTime || 0} ms`,
      },
    ],
  });

  // Activity trends sheet
  if (reportType === 'activity' || reportType === 'overview' || reportType === 'full') {
    sheets.push({
      sheetName: 'Activity Trends',
      data: (analyticsData.trends || []).map((trend: any) => ({
        Date: trend.date,
        Engagements: trend.engagements,
        'Unique Users': trend.uniqueUsers,
        'Total Messages': trend.totalMessages,
        'Avg Satisfaction': trend.satisfactionAverage?.toFixed(2) || '0.00',
      })),
    });
  }

  // Demographics sheet
  if (reportType === 'demographics' || reportType === 'overview' || reportType === 'full') {
    const ageData = Object.entries(analyticsData.demographics?.ageRange || {}).map(
      ([ageRange, total]: [string, any]) => ({
        'Age Range': ageRange,
        Users: total,
        Percentage: `${Math.round((total / (analyticsData.demographics?.totalActiveUsers || 1)) * 100)}%`,
      })
    );

    const regionData = Object.entries(analyticsData.demographics?.regions || {}).map(
      ([region, total]: [string, any]) => ({
        Region: formatLocaleLabel(region, 'en'),
        Users: typeof total === 'object' ? ((total.count ?? total.value ?? Number(total)) || 0) : total,
        Percentage: `${Math.round(((typeof total === 'object' ? ((total.count ?? total.value ?? Number(total)) || 0) : total) / (analyticsData.demographics?.totalActiveUsers || 1)) * 100)}%`,
      })
    );

    sheets.push({
      sheetName: 'Demographics - Age',
      data: ageData,
    });

    sheets.push({
      sheetName: 'Demographics - Region',
      data: regionData,
    });
  }

  // Safety incidents sheet
  if (reportType === 'safety' || reportType === 'overview' || reportType === 'full') {
    sheets.push({
      sheetName: 'Safety Incidents',
      data: [
        {
          'Incident Type': 'Panic Exits',
          Count: analyticsData.safety?.panicExitsTotal || 0,
        },
        {
          'Incident Type': 'Crisis Interventions',
          Count: analyticsData.safety?.crisisInterventionsTriggered || 0,
        },
        {
          'Incident Type': 'Self-Harm Mentions',
          Count: analyticsData.safety?.selfHarmMentionsDetected || 0,
        },
        {
          'Incident Type': 'Suicidal Ideation',
          Count: analyticsData.safety?.suicidalIdeationMentions || 0,
        },
        {
          'Incident Type': 'Abuse Mentions',
          Count: analyticsData.safety?.abuseMentionsDetected || 0,
        },
        {
          'Incident Type': 'Escalated Risks',
          Count: analyticsData.safety?.risksEscalatedToHuman || 0,
        },
        {
          'Incident Type': 'Users Followed Up',
          Count: analyticsData.safety?.concernedUsersFollowedUp || 0,
        },
      ],
    });
  }

  // Performance metrics sheet
  if (reportType === 'performance' || reportType === 'overview' || reportType === 'full') {
    sheets.push({
      sheetName: 'Performance Metrics',
      data: [
        {
          Metric: 'Avg Response Time',
          Value: analyticsData.performance?.avgResponseTime || 0,
          Unit: 'ms',
        },
        {
          Metric: 'System Uptime',
          Value: analyticsData.performance?.systemUptime || 0,
          Unit: '%',
        },
        {
          Metric: 'Message Processing Success',
          Value: analyticsData.performance?.messageProcessingSuccess || 0,
          Unit: '%',
        },
        {
          Metric: 'Consecutive Hours Stable',
          Value: analyticsData.performance?.consecutiveHours || 0,
          Unit: 'hours',
        },
        {
          Metric: 'Errors or Crashes',
          Value: analyticsData.performance?.crashesOrErrors || 0,
          Unit: 'count',
        },
      ],
    });
  }

  // Generate Excel file
  generateExcelReport({
    filename,
    sheets,
    metadata: {
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      subject: `Analytics Report - ${reportRange.label}`,
      author: 'Code4Care Admin Dashboard',
      company: 'Code4Care',
    },
  });
}

/**
 * Export simple data table to Excel
 */
export function exportTableToExcel(
  data: Array<Record<string, string | number>>,
  sheetName: string,
  filename: string
): void {
  generateExcelReport({
    filename,
    sheets: [
      {
        sheetName,
        data,
      },
    ],
  });
}
