'use client';

import { useState, useEffect, useMemo } from 'react';
import { Clock, Banknote, GraduationCap } from 'lucide-react';
import styles from '../admin.module.css';

const CATEGORY_COLORS = {
  'Media & Creative Arts': { bg: 'rgba(240,78,62,0.1)', color: '#d43d2f' },
  'Sales & Marketing': { bg: 'rgba(57,187,161,0.1)', color: '#17877a' },
  'Personal Development': { bg: 'rgba(137,194,66,0.12)', color: '#5a8a1a' },
  'Hospitality': { bg: 'rgba(251,202,13,0.12)', color: '#9a7b00' },
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleCourse = async (course) => {
    setToggling(course.id);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: course.id, active: !course.active }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, active: updated.active } : c))
        );
      }
    } catch {
      // ignore
    } finally {
      setToggling(null);
    }
  };

  const grouped = useMemo(() => {
    const groups = {};
    courses.forEach((c) => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [courses]);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading courses…</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Courses</h1>
        <p className={styles.pageSubtitle}>{courses.length} courses configured</p>
      </div>

      {Object.entries(grouped).map(([category, items]) => {
        const catColor = CATEGORY_COLORS[category] || { bg: 'rgba(23,135,122,0.1)', color: '#17877a' };

        return (
          <div key={category}>
            <h2 className={styles.courseGroupTitle}>{category}</h2>
            <div className={styles.courseGrid}>
              {items.map((course, idx) => {
                const appCount = course._count?.applications ?? 0;

                return (
                  <div
                    key={course.id}
                    className={`${styles.courseCard} ${!course.active ? styles.courseInactive : ''}`}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    <div className={styles.courseCardTop}>
                      <span
                        className={styles.courseCategoryBadge}
                        style={{ background: catColor.bg, color: catColor.color }}
                      >
                        {category}
                      </span>
                      <button
                        className={`${styles.courseToggle} ${
                          course.active ? styles.courseToggleActive : styles.courseToggleInactive
                        }`}
                        onClick={() => toggleCourse(course)}
                        disabled={toggling === course.id}
                        title={course.active ? 'Deactivate' : 'Activate'}
                      />
                    </div>
                    <div className={styles.courseName}>{course.name}</div>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseMetaItem}>
                        <Clock size={13} strokeWidth={2.2} /> {course.duration}
                      </span>
                      <span className={styles.courseMetaItem}>
                        <Banknote size={13} strokeWidth={2.2} /> {course.price}
                      </span>
                    </div>
                    <div className={styles.courseApps}>
                      <strong>{appCount}</strong> application
                      {appCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {courses.length === 0 && (
        <div className={styles.emptyState}>
          <GraduationCap className={styles.emptyIcon} size={44} strokeWidth={1.8} />
          <div className={styles.emptyTitle}>No courses found</div>
          <p className={styles.emptyText}>Seed the database to add courses.</p>
        </div>
      )}
    </div>
  );
}
