export type SocialSettings = {
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  x?: string;
  whatsapp?: string;
  facebookEnabled?: boolean;
  youtubeEnabled?: boolean;
  linkedinEnabled?: boolean;
  xEnabled?: boolean;
  whatsappEnabled?: boolean;
  facebookOrder?: number;
  youtubeOrder?: number;
  linkedinOrder?: number;
  xOrder?: number;
  whatsappOrder?: number;
};

export type SocialLink = { platform: 'facebook' | 'youtube' | 'linkedin' | 'x' | 'whatsapp'; href: string; order: number };

export function whatsappHref(value: string) {
  const phone = value.replace(/\D/g, '').replace(/^00/, '');
  return phone.length >= 8 && phone.length <= 15 ? `https://wa.me/${phone}` : '';
}

export function getSocialLinks(settings: SocialSettings | null | undefined): SocialLink[] {
  if (!settings) return [];
  const links: SocialLink[] = [
    { platform: 'facebook', href: settings.facebook ?? '', order: settings.facebookOrder ?? 0 },
    { platform: 'youtube', href: settings.youtube ?? '', order: settings.youtubeOrder ?? 1 },
    { platform: 'linkedin', href: settings.linkedin ?? '', order: settings.linkedinOrder ?? 2 },
    { platform: 'x', href: settings.x ?? '', order: settings.xOrder ?? 3 },
    { platform: 'whatsapp', href: whatsappHref(settings.whatsapp ?? ''), order: settings.whatsappOrder ?? 4 },
  ];
  return links
    .filter((link) => settings[`${link.platform}Enabled` as keyof SocialSettings] !== false && link.href)
    .sort((a, b) => a.order - b.order || a.platform.localeCompare(b.platform));
}
