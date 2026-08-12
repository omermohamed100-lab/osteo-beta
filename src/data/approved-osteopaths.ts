export type ApprovedOsteopath = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  country: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  profileImage: string;
  directoryCities?: string[];
};

// Public directory entries approved by their practitioners on 12 August 2026.
export const approvedOsteopaths: ApprovedOsteopath[] = [
  {
    id: 'mariam-mohamed-sayed-gelwa',
    name: 'Mariam Mohamed Sayed Gelwa',
    specialty: 'Visceral Osteopathy',
    city: 'Cairo',
    country: 'Egypt',
    location: 'New Cairo: Stern Clinic, Banafsig 4, First New Cairo; Radix Clinic, 9 Ismail Kabani, Nasr City, Cairo.',
    phone: '+20 110 211 1993',
    email: 'drmariamgelwa32@gmail.com',
    bio: 'Bachelor of Physiotherapy, Cairo University (2011). Completed five years of osteopathic training at IAO Ghent, Belgium, with further certification in women’s health care, the Mechanical Link Course (Scoliosis), cupping therapy, and nutrition and obesity management.',
    profileImage: '/images/osteopaths/mariam-gelwa-cutout.png',
  },
  {
    id: 'yahya-fathy-elsamman',
    name: 'Yahya Fathy Elsamman',
    specialty: 'General Practice',
    city: 'Sohag',
    country: 'Egypt',
    location: 'Misr Hospital, Sohag (Saturday and Tuesday, 12–4); Dr Yahya Elsamman Center, Gerga; and Zamzam Hospital, Gerga.',
    phone: '+20 101 054 8390',
    email: 'Yahya.do20@gmail.com',
    bio: 'Experienced Osteopath and Physiotherapy Specialist.',
    profileImage: '/images/osteopaths/yahya-elsamman-cutout.png',
  },
  {
    id: 'loay-mohamed-monir-serour',
    name: 'Loay Mohamed Monir Serour',
    specialty: 'General Practice',
    city: 'Cairo',
    country: 'Egypt',
    location: 'Menoufia: Dr Loay Serour Clinic, Al Fayrouz Tower, 1st Floor, Midan Sharaf, Shebin El-Kom. Sheikh Zayed: SODIC Medical District, Beverly Hills, Sheikh Zayed City, Giza.',
    phone: '+20 101 606 1010',
    email: 'loaysoror@gmail.com',
    bio: 'Orthopedic and spine specialist, with osteopathy and manual therapy training at IAO, Belgium. Focused on non-surgical care for spine and joint disorders, musculoskeletal pain, and rehabilitation.',
    profileImage: '/images/osteopaths/loay-serour-cutout.png',
    directoryCities: ['Cairo', 'Menoufia'],
  },
  {
    id: 'samira-sayed-mahmoud',
    name: 'Samira Sayed Mahmoud',
    specialty: 'General Practice',
    city: 'Cairo',
    country: 'Egypt',
    location: 'Not available right now.',
    phone: '+20 100 839 2867',
    email: 'meros.frd@gmail.com',
    bio: 'Diploma of Osteopathy; Bachelor of Physical Therapy.',
    profileImage: '/images/osteopaths/samira-mahmoud-cutout.png',
  },
];
