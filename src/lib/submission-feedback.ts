export function submissionFeedback(kind: 'timeout' | 'rate-limit', arabic: boolean) {
  if (kind === 'rate-limit') return arabic
    ? 'محاولات كثيرة خلال وقت قصير. يرجى الانتظار قبل المحاولة مرة أخرى.'
    : 'Too many attempts in a short time. Please wait before trying again.';
  return arabic
    ? 'استغرق تأكيد الاستلام وقتًا أطول من المتوقع. بياناتك ما زالت هنا. انتظر قليلًا ثم حاول مرة أخرى بنفس البيانات.'
    : 'Confirmation is taking longer than expected. Your information is still here. Wait a moment, then retry with the same details.';
}
