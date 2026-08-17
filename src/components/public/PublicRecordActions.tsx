'use client';

import Link from '@/components/i18n/LocalizedLink';
import LocalizedText from '@/components/i18n/LocalizedText';

function calendarDate(value: string) {
  return new Date(value).toISOString().slice(0, 10).replaceAll('-', '');
}

function nextCalendarDay(value: string) {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + 1);
  return calendarDate(date.toISOString());
}

function escapeCalendarText(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
}

export default function PublicRecordActions({
  title,
  description,
  start,
  end,
  location,
}: {
  title: string;
  description: string;
  start: string;
  end?: string | null;
  location?: string;
}) {
  const startDate = calendarDate(start);
  const endDate = nextCalendarDay(end || start);
  const calendarBody = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EGSOM//Public calendar//EN',
    'BEGIN:VEVENT',
    `UID:${encodeURIComponent(`${title}-${startDate}`)}@egsom`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    location ? `LOCATION:${escapeCalendarText(location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  const calendarHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(calendarBody)}`;

  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/contact" className="inline-flex min-h-12 items-center justify-center bg-brand-950 px-5 text-sm font-semibold text-bone hover:bg-brand-800 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">
        <LocalizedText en="Ask about this listing" ar="استفسر عن هذا الإعلان" />
      </Link>
      <a href={calendarHref} download="egsom-calendar.ics" className="inline-flex min-h-12 items-center justify-center border border-brand-950/20 px-5 text-sm font-semibold text-brand-800 hover:border-brand-700 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">
        <LocalizedText en="Add to calendar" ar="أضف إلى التقويم" />
      </a>
    </div>
  );
}
