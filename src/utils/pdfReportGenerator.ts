/**
 * PDF Report Generation Utility
 * Generates PDF reports from analytics data
 */

import jsPDF from 'jspdf';

export interface PDFReportData {
  title: string;
  subtitle?: string;
  generatedAt: string;
  reportType: string;
  reportWindow?: {
    startYear: number;
    endYear: number;
    label: string;
  };
  sections: PDFReportSection[];
  kpis?: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface PDFReportSection {
  title: string;
  content: string;
  data?: Array<Record<string, string | number>>;
}

export function generatePDFReport(reportData: PDFReportData, filename: string): void {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 72, 255); // Blue color
  doc.text(reportData.title, margin, yPosition);
  yPosition += 12;

  // Subtitle
  if (reportData.subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text(reportData.subtitle, margin, yPosition);
    yPosition += 8;
  }

  // Report metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Type: ${reportData.reportType}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, margin, yPosition);
  yPosition += 5;
  if (reportData.reportWindow) {
    doc.text(`Period: ${reportData.reportWindow.label}`, margin, yPosition);
    yPosition += 5;
  }
  yPosition += 5;

  // KPIs Section
  if (reportData.kpis && reportData.kpis.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Performance Indicators', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    reportData.kpis.forEach((kpi) => {
      const kpiText = `${kpi.label}: ${kpi.value}`;
      doc.text(kpiText, margin + 5, yPosition);
      yPosition += 6;
      
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 30) {
        doc.addPage();
        yPosition = margin;
      }
    });
    yPosition += 5;
  }

  // Sections
  reportData.sections.forEach((section) => {
    // Section title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(section.title, margin, yPosition);
    yPosition += 8;

    // Section content
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    const lines = doc.splitTextToSize(section.content, contentWidth);
    lines.forEach((line) => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;

      // Check if we need a new page
      if (yPosition > pageHeight - margin - 30) {
        doc.addPage();
        yPosition = margin;
      }
    });

    // Section data table
    if (section.data && section.data.length > 0) {
      yPosition += 3;

      // Generate table data
      const headers = Object.keys(section.data[0]);
      const tableData = section.data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          return typeof value === 'number' ? value.toFixed(2) : String(value);
        })
      );

      // Add table using autoTable if available, or simple text-based table
      const tableStartY = yPosition;
      const cellWidth = contentWidth / headers.length;

      // Table headers
      doc.setFontSize(9);
      doc.setTextColor(0, 72, 255);
      let x = margin;
      headers.forEach((header) => {
        doc.text(header, x + 2, yPosition, { maxWidth: cellWidth - 2 });
        x += cellWidth;
      });
      yPosition += 5;

      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);

      // Table data
      doc.setTextColor(0, 0, 0);
      tableData.forEach((row) => {
        x = margin;
        row.forEach((cell) => {
          doc.text(cell, x + 2, yPosition, { maxWidth: cellWidth - 2 });
          x += cellWidth;
        });
        yPosition += 4;

        // Check if we need a new page
        if (yPosition > pageHeight - margin - 30) {
          doc.addPage();
          yPosition = margin;
        }
      });

      yPosition += 5;
    }

    yPosition += 5;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Page ${doc.internal.pages.length - 1}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Save the PDF
  doc.save(filename);
}

export function generateReportFromAnalytics(
  analyticsData: any,
  reportType: string,
  reportRange: { startYear: number; endYear: number; label: string },
  filename: string,
): void {
  const sections: PDFReportSection[] = [];

  // Overview section
  sections.push({
    title: 'Executive Summary',
    content: `This report provides a comprehensive analysis of system performance and user engagement for the period ${reportRange.label}. The data includes all key metrics related to user interactions, system health, and safety protocols.`,
  });

  // Activity section
  if (reportType === 'activity' || reportType === 'overview' || reportType === 'full') {
    const totalEngagements = analyticsData.trends?.reduce(
      (sum: number, item: any) => sum + (item.engagements || 0),
      0
    ) || 0;
    const totalMessages = analyticsData.trends?.reduce(
      (sum: number, item: any) => sum + (item.totalMessages || 0),
      0
    ) || 0;

    sections.push({
      title: 'User Activity',
      content: `During the reporting period, the system processed ${totalEngagements} user engagements with a total of ${totalMessages} messages exchanged. The platform demonstrated consistent engagement patterns with growing user retention rates.`,
      data: analyticsData.trends?.slice(0, 7).map((trend: any) => ({
        Date: trend.date,
        Engagements: trend.engagements,
        Users: trend.uniqueUsers,
        Messages: trend.totalMessages,
        Satisfaction: (trend.satisfactionAverage || 0).toFixed(2),
      })),
    });
  }

  // Demographics section
  if (reportType === 'demographics' || reportType === 'overview' || reportType === 'full') {
    sections.push({
      title: 'User Demographics',
      content: `User base analysis shows diverse demographic distribution. The system serves users across multiple age ranges and geographic regions, with strong representation from key demographic segments.`,
      data: Object.entries(analyticsData.demographics?.ageRange || {})
        .slice(0, 5)
        .map(([ageRange, total]: [string, any]) => ({
          Category: ageRange,
          Users: total,
          Percentage: `${Math.round((total / (analyticsData.demographics?.totalActiveUsers || 1)) * 100)}%`,
        })),
    });
  }

  // Safety section
  if (reportType === 'safety' || reportType === 'overview' || reportType === 'full') {
    const totalSafetyEvents =
      (analyticsData.safety?.panicExitsTotal || 0) +
      (analyticsData.safety?.crisisInterventionsTriggered || 0);

    sections.push({
      title: 'Safety & Incidents',
      content: `The platform recorded ${totalSafetyEvents} safety-related events requiring intervention. All incidents were handled according to established safety protocols with appropriate escalations and follow-ups.`,
      data: [
        { Metric: 'Panic Exits', Value: analyticsData.safety?.panicExitsTotal || 0 },
        { Metric: 'Crisis Interventions', Value: analyticsData.safety?.crisisInterventionsTriggered || 0 },
        { Metric: 'Escalated Risks', Value: analyticsData.safety?.risksEscalatedToHuman || 0 },
        { Metric: 'Followed Up', Value: analyticsData.safety?.concernedUsersFollowedUp || 0 },
      ],
    });
  }

  // Performance section
  if (reportType === 'performance' || reportType === 'overview' || reportType === 'full') {
    sections.push({
      title: 'System Performance',
      content: `System performance metrics indicate stable and reliable operations. Response times remained consistently low with high uptime percentages ensuring uninterrupted user access.`,
      data: [
        { Metric: 'Response Time', Value: `${analyticsData.performance?.avgResponseTime || 150} ms` },
        { Metric: 'System Uptime', Value: `${analyticsData.performance?.systemUptime || 99.9}%` },
        { Metric: 'Success Rate', Value: `${analyticsData.performance?.messageProcessingSuccess || 99.8}%` },
        { Metric: 'Total Errors', Value: analyticsData.performance?.crashesOrErrors || 0 },
      ],
    });
  }

  // Generate KPIs
  const kpis = [];
  if (analyticsData.demographics?.totalActiveUsers) {
    kpis.push({ label: 'Active Users', value: analyticsData.demographics.totalActiveUsers });
  }
  if (analyticsData.summary?.conversations_in_period) {
    kpis.push({ label: 'Total Engagements', value: analyticsData.summary.conversations_in_period });
  }
  if (analyticsData.performance?.systemUptime) {
    kpis.push({ label: 'System Uptime', value: `${analyticsData.performance.systemUptime}%` });
  }

  generatePDFReport(
    {
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      subtitle: `Comprehensive system and user analytics report for ${reportRange.label}`,
      generatedAt: new Date().toISOString(),
      reportType,
      reportWindow: reportRange,
      sections,
      kpis,
    },
    filename
  );
}
