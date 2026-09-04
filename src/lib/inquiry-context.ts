export const INQUIRY_TYPES = [
  'course',
  'activity',
  'upcoming-courses',
  'upcoming-activities',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export type InquiryContext = {
  type: InquiryType;
  id?: string;
  title?: string;
  titleAr?: string;
};

const cleanText = (value: string | null, maxLength: number) => {
  const cleaned = value?.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
};

export function parseInquiryContext(params: Pick<URLSearchParams, 'get'>): InquiryContext | null {
  const type = params.get('inquiry');
  if (!INQUIRY_TYPES.includes(type as InquiryType)) return null;

  const rawId = params.get('id');
  const id = rawId && /^[a-zA-Z0-9_-]{1,120}$/.test(rawId) ? rawId : undefined;
  return {
    type: type as InquiryType,
    id,
    title: cleanText(params.get('title'), 160),
    titleAr: cleanText(params.get('titleAr'), 160),
  };
}

export function inquiryHref(context: InquiryContext) {
  const params = new URLSearchParams({ inquiry: context.type });
  if (context.id) params.set('id', context.id);
  if (context.title) params.set('title', context.title);
  if (context.titleAr) params.set('titleAr', context.titleAr);
  return `/contact?${params.toString()}`;
}

export function inquiryLabel(context: InquiryContext, isArabic: boolean) {
  const generic = {
    course: isArabic ? 'دورة منشورة' : 'Published course',
    activity: isArabic ? 'نشاط منشور' : 'Published activity',
    'upcoming-courses': isArabic ? 'الدورات القادمة' : 'Upcoming courses',
    'upcoming-activities': isArabic ? 'الأنشطة القادمة' : 'Upcoming activities',
  }[context.type];
  return (isArabic ? context.titleAr || context.title : context.title) || generic;
}

export function messageWithInquiryContext(message: string, context: InquiryContext | null) {
  if (!context) return message;
  const type = context.type.replaceAll('-', ' ');
  const title = context.title || context.titleAr;
  const details = [type, title, context.id ? `ID ${context.id}` : ''].filter(Boolean).join(' — ');
  return `Inquiry context: ${details}\n\n${message}`;
}
