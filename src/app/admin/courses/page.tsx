'use client';

import { useState, useEffect } from 'react';
import ArabicContentWarning from '@/components/admin/ArabicContentWarning';
import AdminDialog from '@/components/admin/AdminDialog';

type Course = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  instructor: string;
  instructorAr: string;
  duration: string;
  durationAr: string;
  startDate: string;
  endDate: string | null;
  price: number | null;
  priceCurrency: string;
  imageUrl: string | null;
  isActive: boolean;
};

function getMissingArabicFields(course: Pick<Course, 'titleAr' | 'descriptionAr' | 'instructorAr' | 'durationAr'>) {
  return [
    !course.titleAr?.trim() && 'title',
    !course.descriptionAr?.trim() && 'description',
    !course.instructorAr?.trim() && 'instructor',
    !course.durationAr?.trim() && 'duration',
  ].filter((field): field is string => Boolean(field));
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    instructor: '',
    instructorAr: '',
    duration: '',
    durationAr: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    price: '',
    priceCurrency: '',
    imageUrl: '',
    isActive: true,
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses?admin=1');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/courses/${editingId}` : '/api/courses';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : null,
          imageUrl: formData.imageUrl || undefined,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        fetchCourses();
      } else {
        alert('Failed to save course');
      }
    } catch {
      alert('Error saving course');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      }
    } catch {
      alert('Error deleting course');
    }
  };

  const openEdit = (course: Course) => {
    setFormData({
      title: course.title,
      titleAr: course.titleAr,
      description: course.description,
      descriptionAr: course.descriptionAr,
      instructor: course.instructor,
      instructorAr: course.instructorAr,
      duration: course.duration,
      durationAr: course.durationAr,
      startDate: new Date(course.startDate).toISOString().split('T')[0],
      endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
      price: course.price?.toString() ?? '',
      priceCurrency: course.priceCurrency,
      imageUrl: course.imageUrl ?? '',
      isActive: course.isActive,
    });
    setEditingId(course.id);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      instructor: '',
      instructorAr: '',
      duration: '',
      durationAr: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      price: '',
      priceCurrency: '',
      imageUrl: '',
      isActive: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Courses</h1>
        <button
          onClick={openCreate}
          type="button"
          className="min-h-11 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div role="status" aria-live="polite" className="p-8 text-center text-gray-500">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No courses found. Create one!</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-500">{course.duration}</div>
                    <ArabicContentWarning missingFields={getMissingArabicFields(course)} compact />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(course.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" onClick={() => openEdit(course)} className="min-h-11 px-2 text-brand-600 hover:text-brand-900">Edit <span className="sr-only">{course.title}</span></button>
                    <button type="button" onClick={() => handleDelete(course.id)} className="min-h-11 px-2 text-red-600 hover:text-red-900">Delete <span className="sr-only">{course.title}</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AdminDialog onClose={() => setIsModalOpen(false)} titleId="course-dialog-title">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 id="course-dialog-title" className="text-xl font-bold text-gray-900">{editingId ? 'Edit Course' : 'Create Course'}</h2>
              <button data-dialog-initial-focus type="button" aria-label="Close course editor" onClick={() => setIsModalOpen(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="course-title" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input id="course-title" required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
              </div>
              <div>
                <label htmlFor="course-title-ar" className="block text-sm font-medium text-gray-700 mb-1">Course Title (Arabic)</label>
                <input id="course-title-ar" dir="rtl" lang="ar" type="text" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
              </div>
              <div>
                <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="course-description" required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500"></textarea>
              </div>
              <div>
                <label htmlFor="course-description-ar" className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
                <textarea id="course-description-ar" dir="rtl" lang="ar" rows={3} value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-instructor" className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                  <input id="course-instructor" required type="text" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label htmlFor="course-duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input id="course-duration" required type="text" placeholder="e.g. 2 Days" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label htmlFor="course-instructor-ar" className="block text-sm font-medium text-gray-700 mb-1">Instructor (Arabic)</label><input id="course-instructor-ar" dir="rtl" lang="ar" type="text" value={formData.instructorAr} onChange={e => setFormData({...formData, instructorAr: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" /></div>
                <div><label htmlFor="course-duration-ar" className="block text-sm font-medium text-gray-700 mb-1">Duration (Arabic)</label><input id="course-duration-ar" dir="rtl" lang="ar" type="text" value={formData.durationAr} onChange={e => setFormData({...formData, durationAr: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input id="course-start-date" required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div><label htmlFor="course-end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input id="course-end-date" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label htmlFor="course-fee" className="block text-sm font-medium text-gray-700 mb-1">Fee</label><input id="course-fee" type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" /></div>
                <div><label htmlFor="course-currency" className="block text-sm font-medium text-gray-700 mb-1">Currency code</label><input id="course-currency" maxLength={3} value={formData.priceCurrency} onChange={e => setFormData({...formData, priceCurrency: e.target.value.toUpperCase()})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" placeholder="EGP" /></div>
                <div className="flex items-center mt-6">
                  <input type="checkbox" id="course-is-active" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                  <label htmlFor="course-is-active" className="ml-2 block text-sm text-gray-900">Active (Visible to public)</label>
                </div>
              </div>
              <div><label htmlFor="course-image-url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input id="course-image-url" type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" placeholder="https://…" /></div>
              <ArabicContentWarning missingFields={getMissingArabicFields(formData)} />
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="min-h-11 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="min-h-11 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">Save Course</button>
              </div>
            </form>
        </AdminDialog>
      )}
    </div>
  );
}
