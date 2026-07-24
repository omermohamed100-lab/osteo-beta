import Link from 'next/link';

const boxes = [
  {
    id: 'about',
    title: 'About Us',
    desc: 'Learn about our mission, vision, and the history of osteopathy in Egypt.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    href: '/about',
  },
  {
    id: 'courses',
    title: 'Courses',
    desc: 'Explore our comprehensive training programs and certification courses.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    href: '/courses',
  },
  {
    id: 'activities',
    title: 'Activities',
    desc: 'Stay updated with our latest workshops, seminars, and community events.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    href: '/activities',
  },
  {
    id: 'find-osteopath',
    title: 'Find an Osteopath',
    desc: 'Search our directory of certified osteopathic practitioners near you.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    href: '/find-osteopath',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    desc: 'Browse photos and videos from our past initiatives and training sessions.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    href: '/gallery',
  },
  {
    id: 'contact',
    title: 'Contact',
    desc: 'Get in touch for inquiries, partnerships, or membership details.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    href: '/contact',
  },
];

export default function AnimatedBoxes() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-gray-200 max-w-6xl mx-auto"
    >
      {boxes.map((box, index) => {
        const num = String(index + 1).padStart(2, '0');

        return (
          <Link
            key={box.id}
            href={box.href}
            className="group relative flex min-h-[180px] touch-manipulation flex-col overflow-hidden border-b border-r border-gray-200 bg-white p-6 transition-[background-color,transform] duration-200 hover:bg-brand-950 active:scale-[0.99] active:bg-brand-950 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset sm:min-h-[220px] sm:p-8"
          >
            {/* Large background number */}
            <span className="absolute top-3 right-4 sm:right-5 font-display text-[3.75rem] sm:text-[5.5rem] font-semibold leading-none text-gray-100 group-hover:text-white/[0.04] group-active:text-white/[0.04] transition-colors duration-300 select-none">
              {num}
            </span>

            <div className="relative z-10 flex flex-col flex-grow">
              {/* Icon */}
              <div className="w-9 h-9 rounded-full border border-gray-200 group-hover:border-white/15 group-active:border-white/15 flex items-center justify-center mb-7 transition-colors duration-300">
                <svg
                  className="w-[18px] h-[18px] text-brand-600 group-hover:text-white/80 group-active:text-white/80 transition-colors duration-300"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  aria-hidden="true"
                >
                  {box.icon}
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-white group-active:text-white transition-colors duration-300 mb-2 tracking-tight">
                {box.title}
              </h3>

              {/* Rule */}
              <div className="h-px w-7 bg-brand-500 group-hover:bg-gold group-hover:w-12 group-active:bg-gold group-active:w-12 transition-all duration-300 mb-4" />

              {/* Description */}
              <p className="text-gray-500 group-hover:text-white/60 group-active:text-white/60 text-sm leading-relaxed transition-colors duration-300 flex-grow">
                {box.desc}
              </p>

              {/* Arrow */}
              <div className="mt-6 inline-flex items-center gap-2 text-brand-600 group-hover:text-gold group-active:text-gold transition-colors duration-300 text-[11px] font-medium tracking-[0.25em] uppercase">
                <span>Explore</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
