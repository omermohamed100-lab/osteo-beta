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
      title: 'Find an Osteopath & Training in Egypt | EGSOM',
      description:
        'EGSOM helps the public find listed osteopaths and helps professionals explore osteopathic education and directory listing opportunities in Egypt.',
    },
    ar: {
      title: 'ابحث عن ممارس وتدريب الأوستيوباثي في مصر | EGSOM',
      description:
        'تساعد الجمعية الجمهور في العثور على ممارسي الأوستيوباثي المدرجين، وتساعد المهنيين في استكشاف فرص التعليم والإدراج في الدليل في مصر.',
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
  '/standards': {
    en: {
      title: 'Directory Review & Credential Status | EGSOM',
      description:
        'Understand how EGSOM reviews directory applications, publishes profiles, displays recorded credential status, and handles correction requests.',
    },
    ar: {
      title: 'مراجعة الدليل وحالة المؤهلات | EGSOM',
      description:
        'تعرّف على كيفية مراجعة طلبات الدليل ونشر الملفات وعرض حالة المؤهلات المسجلة والتعامل مع طلبات التصحيح لدى الجمعية.',
    },
  },
  '/courses': {
    en: {
      title: 'Osteopathy Courses & Training in Egypt | EGSOM',
      description:
        'Explore published osteopathy courses, workshops and professional training opportunities from EGSOM in Egypt.',
    },
    ar: {
      title: 'دورات وتدريب الأوستيوباثي في مصر | EGSOM',
      description:
        'استكشف دورات الأوستيوباثي وورش العمل وفرص التدريب المهني المنشورة من الجمعية في مصر.',
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
      title: 'Find an Osteopath in Egypt | EGSOM Directory',
      description:
        'Find listed osteopaths in Egypt. Compare published training, practice locations and contact details, then contact a practitioner directly.',
    },
    ar: {
      title: 'ابحث عن ممارس أوستيوباثي في مصر | دليل EGSOM',
      description:
        'ابحث عن ممارسي الأوستيوباثي المدرجين في مصر، وقارن التدريب المنشور ومواقع الممارسة وبيانات التواصل، ثم تواصل مع الممارس مباشرة.',
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
  '/practitioners/apply': {
    en: {
      title: 'Practitioner Listing Application · EGSOM',
      description:
        'Submit a new practitioner listing or profile update application for individual EGSOM review.',
    },
    ar: {
      title: 'طلب إدراج ممارس · EGSOM',
      description:
        'قدّم طلب إدراج ممارس جديد أو تحديث ملف مهني لمراجعته بصورة فردية من الجمعية.',
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
