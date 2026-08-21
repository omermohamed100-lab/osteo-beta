import type { SiteLanguage } from '@/lib/i18n-routing';

export type PublicPageMeta = {
  title: string;
  description: string;
};
export const PUBLIC_PAGE_META: Record<
  string,
  Record<SiteLanguage, PublicPageMeta>
> = {
  '/': {
    en: {
      title: 'Egyptian Society of Osteopathic Medicine (EGSOM)',
      description:
        'EGSOM advances responsible osteopathic practice through professional education, clear standards, and practical information for the public.',
    },
    ar: {
      title: 'الجمعية المصرية لطب الأوستيوباثية (EGSOM)',
      description:
        'تعمل الجمعية على تطوير الممارسة المسؤولة للأوستيوباثي من خلال التعليم المهني والمعايير الواضحة والمعلومات المفيدة للجمهور.',
    },
  },
  '/about': {
    en: {
      title: 'About · EGSOM',
      description:
        'Learn about the Egyptian Society of Osteopathic Medicine, its mission, vision, and professional values.',
    },
    ar: {
      title: 'عن الجمعية · EGSOM',
      description:
        'تعرّف على الجمعية المصرية لطب الأوستيوباثية ورسالتها ورؤيتها وقيمها المهنية.',
    },
  },
  '/courses': {
    en: {
      title: 'Courses & Training · EGSOM',
      description:
        'Explore EGSOM osteopathic education, workshops, training programs, and professional development opportunities.',
    },
    ar: {
      title: 'الدورات والتدريب · EGSOM',
      description:
        'استكشف برامج التعليم وورش العمل والتدريب وفرص التطوير المهني في الأوستيوباثي لدى الجمعية.',
    },
  },
  '/activities': {
    en: {
      title: 'Activities & Events · EGSOM',
      description:
        'Explore EGSOM seminars, conferences, workshops, and community activities.',
    },
    ar: {
      title: 'الأنشطة والفعاليات · EGSOM',
      description:
        'تعرّف على ندوات الجمعية ومؤتمراتها وورش عملها وأنشطتها المجتمعية.',
    },
  },
  '/find-osteopath': {
    en: {
      title: 'Find an Osteopath · EGSOM',
      description:
        'Search the EGSOM directory for listed osteopathic practitioners in Egypt.',
    },
    ar: {
      title: 'دليل الممارسين · EGSOM',
      description:
        'ابحث في دليل الجمعية عن ممارسي الأوستيوباثي المدرجين في مصر.',
    },
  },
  '/practitioners': {
    en: {
      title: 'Practitioner Resources · EGSOM',
      description:
        'Professional information, education pathways, directory guidance, and enquiry routes for osteopathic practitioners.',
    },
    ar: {
      title: 'موارد الممارسين · EGSOM',
      description:
        'معلومات مهنية ومسارات تعليمية وإرشادات الدليل وقنوات الاستفسار لممارسي الأوستيوباثي.',
    },
  },
  '/gallery': {
    en: {
      title: 'Gallery · EGSOM',
      description:
        'Browse photos from EGSOM training sessions, workshops, conferences, and community initiatives.',
    },
    ar: {
      title: 'معرض الصور · EGSOM',
      description:
        'تصفّح صور جلسات الجمعية التدريبية وورش العمل والمؤتمرات والمبادرات المجتمعية.',
    },
  },
  '/contact': {
    en: {
      title: 'Contact · EGSOM',
      description:
        'Contact EGSOM about membership, courses, partnerships, or osteopathic medicine in Egypt.',
    },
    ar: {
      title: 'تواصل معنا · EGSOM',
      description:
        'تواصل مع الجمعية للاستفسار عن العضوية أو الدورات أو الشراكات أو الطب الأوستيوباثي في مصر.',
    },
  },
  '/privacy': {
    en: {
      title: 'Privacy · EGSOM',
      description:
        'Learn how EGSOM handles contact messages, directory information, security data, and privacy requests.',
    },
    ar: {
      title: 'الخصوصية · EGSOM',
      description:
        'تعرّف على كيفية تعامل الجمعية مع رسائل التواصل وبيانات الدليل وبيانات الأمان وطلبات الخصوصية.',
    },
  },
};
