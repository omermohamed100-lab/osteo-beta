export type SiteLanguage = 'en' | 'ar';

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
        'Promoting excellence in osteopathic education, practice, and research across Egypt and the Middle East.',
    },
    ar: {
      title: 'الجمعية المصرية لطب الأوستيوباثية (EGSOM)',
      description:
        'نرتقي بالتعليم والممارسة والبحث في مجال الطب الأوستيوباثي في مصر والشرق الأوسط.',
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
        'Explore osteopathic training programs, workshops, and professional certification courses.',
    },
    ar: {
      title: 'الدورات والتدريب · EGSOM',
      description:
        'استكشف برامج التدريب وورش العمل ودورات الاعتماد المهني في الطب الأوستيوباثي.',
    },
  },
  '/activities': {
    en: {
      title: 'Activities & Events · EGSOM',
      description:
        'Discover upcoming EGSOM workshops, seminars, conferences, and community activities.',
    },
    ar: {
      title: 'الأنشطة والفعاليات · EGSOM',
      description:
        'تعرّف على ورش العمل والندوات والمؤتمرات والأنشطة المجتمعية القادمة للجمعية.',
    },
  },
  '/find-osteopath': {
    en: {
      title: 'Find an Osteopath · EGSOM',
      description:
        'Search the EGSOM directory for certified osteopathic practitioners across Egypt and the Middle East.',
    },
    ar: {
      title: 'دليل الممارسين · EGSOM',
      description:
        'ابحث في دليل الجمعية عن ممارسي الطب الأوستيوباثي المعتمدين في مصر والشرق الأوسط.',
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
};
