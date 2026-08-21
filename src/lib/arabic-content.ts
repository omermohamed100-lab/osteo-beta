export const ARABIC_CONTENT_UNAVAILABLE = 'متاح باللغة الإنجليزية';

export function getArabicContent(value: string | null | undefined) {
  return value?.trim() || ARABIC_CONTENT_UNAVAILABLE;
}
