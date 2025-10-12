export type ICSInput = {
    uid?: string;
    title: string;
    description?: string;
    start: Date;
    end?: Date;
    location?: string;
    url?: string;
};

function toICSDate(d: Date): string {
    // 2025-10-12T18:30:00.000Z -> 20251012T183000Z
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function esc(text: string) {
    return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

export function buildICS(i: ICSInput): string {
    const uid = i.uid ?? crypto.randomUUID();
    const now = new Date();
    const dtstamp = toICSDate(now);
    const dtstart = toICSDate(i.start);
    const dtend = toICSDate(i.end ?? new Date(i.start.getTime() + 2 * 60 * 60 * 1000));

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:-//CineNight//EN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${esc(i.title)}`,
        i.description ? `DESCRIPTION:${esc(i.description)}` : '',
        i.location ? `LOCATION:${esc(i.location)}` : '',
        i.url ? `URL:${i.url}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    return lines.join('\r\n');
}

export function downloadICS(ics: string, filename = 'event.ics') {
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
