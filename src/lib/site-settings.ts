export const siteSettingsDefaults = {
  email: 'support@eg-som.com',
  facebook: 'https://www.facebook.com/profile.php?id=61595242238581',
  youtube: 'https://www.youtube.com/@egsom-media',
  linkedin: 'https://www.linkedin.com/in/egyptian-society-osteopathic-medicine-5732a8444/',
  x: 'https://x.com/Egsommedia',
  whatsapp: '201128811128',
  facebookEnabled: true,
  youtubeEnabled: true,
  linkedinEnabled: true,
  xEnabled: true,
  whatsappEnabled: true,
  facebookOrder: 0,
  youtubeOrder: 1,
  linkedinOrder: 2,
  xOrder: 3,
  whatsappOrder: 4,
  heroEyebrow: 'EGYPTIAN SOCIETY OF OSTEOPATHIC MEDICINE',
  heroEyebrowAr: 'الجمعية المصرية لطب الأوستيوباثي',
  heroHeadline: 'Find an osteopath. Explore training in Egypt.',
  heroHeadlineAr: 'ابحث عن ممارس أوستيوباثي. واستكشف التدريب في مصر.',
  heroDescription: 'EGSOM advances awareness, education, and professional osteopathic practice in Egypt, supporting practitioners across Egypt and the Middle East through training, knowledge exchange, and international partnerships.',
  heroDescriptionAr: 'تعمل الجمعية المصرية لطب الأوستيوباثي على نشر الوعي بالأوستيوباثي ودعم تعليمه وممارسته المهنية في مصر والشرق الأوسط، عبر التدريب وتبادل الخبرات والشراكات الدولية.',
  heroPrimaryLabel: 'About',
  heroPrimaryLabelAr: 'من نحن',
  heroPrimaryHref: '/about',
  heroSecondaryLabel: 'Find an Osteopath',
  heroSecondaryLabelAr: 'ابحث عن أخصائي أوستيوباثي',
  heroSecondaryHref: '/find-osteopath',
};

export function isValidPublicPath(value: string) {
  return value === '/about' || value === '/find-osteopath' || value === '/courses' || value === '/contact' || value === '/practitioners';
}
