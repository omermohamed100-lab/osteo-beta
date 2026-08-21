export type ApprovedOsteopath = {
  id: string;
  name: string;
  nameAr?: string;
  specialty: string;
  specialtyAr?: string;
  city: string;
  cityAr?: string;
  country: string;
  countryAr?: string;
  location: string;
  locationAr?: string;
  phone: string;
  email: string;
  bio: string;
  bioAr?: string;
  profileImage: string;
  directoryCities?: string[];
  directoryCitiesAr?: string[];
  credentialType?: string;
  credentialTypeAr?: string;
  credentialNumber?: string;
  credentialIssuer?: string;
  credentialIssuerAr?: string;
  credentialStatus?: string;
  credentialVerifiedAt?: string | null;
  credentialExpiresAt?: string | null;
  profileReviewedAt?: string | null;
};

// Public directory entries approved by their practitioners on 12 August 2026.
export const approvedOsteopaths: ApprovedOsteopath[] = [
  {
    id: 'mariam-mohamed-sayed-gelwa',
    name: 'Mariam Mohamed Sayed Gelwa',
    nameAr: 'مريم محمد سيد جلوة',
    specialty: 'Visceral Osteopathy',
    specialtyAr: 'الأوستيوباثي الحشوي',
    city: 'Cairo',
    cityAr: 'القاهرة',
    country: 'Egypt',
    countryAr: 'مصر',
    location: 'New Cairo: Stern Clinic, Banafsig 4, First New Cairo; Radix Clinic, 9 Ismail Kabani, Nasr City, Cairo.',
    locationAr: 'القاهرة الجديدة: عيادة ستيرن، البنفسج 4، التجمع الأول، القاهرة الجديدة؛ عيادة راديكس، 9 إسماعيل القباني، مدينة نصر، القاهرة.',
    phone: '+20 110 211 1993',
    email: 'drmariamgelwa32@gmail.com',
    bio: 'Bachelor of Physiotherapy, Cairo University (2011). Completed five years of osteopathic training at IAO Ghent, Belgium, with further training in women’s health care, the Mechanical Link Course (Scoliosis), cupping therapy, and nutrition and obesity management.',
    bioAr: 'بكالوريوس العلاج الطبيعي، جامعة القاهرة (2011). أتمّت خمس سنوات من التدريب في الأوستيوباثي في الأكاديمية الدولية للأوستيوباثي (IAO) في غنت، بلجيكا، مع تدريب إضافي في رعاية صحة المرأة، ودورة الرابط الميكانيكي (الجنف)، والعلاج بالحجامة، وإدارة التغذية والسمنة.',
    profileImage: '/images/osteopaths/mariam-gelwa-cutout.webp',
    profileReviewedAt: '2026-08-12T00:00:00.000Z',
  },
  {
    id: 'yahya-fathy-elsamman',
    name: 'Yahya Fathy Elsamman',
    nameAr: 'يحيى فتحي السمان',
    specialty: 'General Practice',
    specialtyAr: 'ممارسة عامة',
    city: 'Sohag',
    cityAr: 'سوهاج',
    country: 'Egypt',
    countryAr: 'مصر',
    location: 'Misr Hospital, Sohag (Saturday and Tuesday, 12–4); Dr Yahya Elsamman Center, Gerga; and Zamzam Hospital, Gerga.',
    locationAr: 'مستشفى مصر، سوهاج (السبت والثلاثاء، 12–4)؛ مركز د. يحيى السمان، جرجا؛ ومستشفى زمزم، جرجا.',
    phone: '+20 101 054 8390',
    email: 'Yahya.do20@gmail.com',
    bio: 'Experienced Osteopath and Physiotherapy Specialist.',
    bioAr: 'ممارس أوستيوباثي وأخصائي علاج طبيعي ذو خبرة.',
    profileImage: '/images/osteopaths/yahya-elsamman-cutout.webp',
    profileReviewedAt: '2026-08-12T00:00:00.000Z',
  },
  {
    id: 'loay-mohamed-monir-serour',
    name: 'Loay Mohamed Monir Serour',
    nameAr: 'لؤي محمد منير سرور',
    specialty: 'General Practice',
    specialtyAr: 'ممارسة عامة',
    city: 'Cairo',
    cityAr: 'القاهرة',
    country: 'Egypt',
    countryAr: 'مصر',
    location: 'Menoufia: Dr Loay Serour Clinic, Al Fayrouz Tower, 1st Floor, Midan Sharaf, Shebin El-Kom. Sheikh Zayed: SODIC Medical District, Beverly Hills, Sheikh Zayed City, Giza.',
    locationAr: 'المنوفية: عيادة د. لؤي سرور، برج الفيروز، الطابق الأول، ميدان شرف، شبين الكوم. الشيخ زايد: منطقة سوديك الطبية، بيفرلي هيلز، مدينة الشيخ زايد، الجيزة.',
    phone: '+20 101 606 1010',
    email: 'loaysoror@gmail.com',
    bio: 'Orthopedic and spine specialist, with osteopathy and manual therapy training at IAO, Belgium. Focused on non-surgical care for spine and joint disorders, musculoskeletal pain, and rehabilitation.',
    bioAr: 'أخصائي عظام وعمود فقري، حاصل على تدريب في الأوستيوباثي والعلاج اليدوي في الأكاديمية الدولية للأوستيوباثي (IAO)، بلجيكا. يركز على الرعاية غير الجراحية لاضطرابات العمود الفقري والمفاصل، وآلام الجهاز العضلي الهيكلي، وإعادة التأهيل.',
    profileImage: '/images/osteopaths/loay-serour-cutout.webp',
    directoryCities: ['Cairo', 'Menoufia'],
    directoryCitiesAr: ['القاهرة', 'المنوفية'],
    profileReviewedAt: '2026-08-12T00:00:00.000Z',
  },
  {
    id: 'samira-sayed-mahmoud',
    name: 'Samira Sayed Mahmoud',
    nameAr: 'سميرة سيد محمود',
    specialty: 'General Practice',
    specialtyAr: 'ممارسة عامة',
    city: 'Cairo',
    cityAr: 'القاهرة',
    country: 'Egypt',
    countryAr: 'مصر',
    location: 'Not available right now.',
    locationAr: 'غير متاح حاليًا.',
    phone: '+20 100 839 2867',
    email: 'meros.frd@gmail.com',
    bio: 'Diploma of Osteopathy; Bachelor of Physical Therapy.',
    bioAr: 'دبلوم في الأوستيوباثي؛ بكالوريوس العلاج الطبيعي.',
    profileImage: '/images/osteopaths/samira-mahmoud-cutout.webp',
    profileReviewedAt: '2026-08-12T00:00:00.000Z',
  },
];
