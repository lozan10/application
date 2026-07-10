'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import styles from './admin.module.css';

const STATUS_BADGE = {
  PENDING: 'badge badge-pending',
  UNDER_REVIEW: 'badge badge-review',
  ACCEPTED: 'badge badge-accepted',
  REJECTED: 'badge badge-rejected',
};

const STATUS_LABEL = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading dashboard…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.emptyState}>
        <AlertTriangle className={styles.emptyIcon} size={44} strokeWidth={1.8} />
        <div className={styles.emptyTitle}>Failed to load data</div>
        <p className={styles.emptyText}>Please try refreshing the page.</p>
      </div>
    );
  }

  const maxCategory = stats.byCategory?.length
    ? Math.max(...stats.byCategory.map((c) => c.count))
    : 1;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Overview of your application portal</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconTotal}`}>
            <FileText size={22} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.totalApplications}</div>
            <div className={styles.statLabel}>Total Applications</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPending}`}>
            <Clock size={22} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.pending}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAccepted}`}>
            <CheckCircle2 size={22} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.accepted}</div>
            <div className={styles.statLabel}>Accepted</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconRejected}`}>
            <XCircle size={22} strokeWidth={2} />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.rejected}</div>
            <div className={styles.statLabel}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Applications</h2>
          <Link href="/admin/applications" className={styles.tableCount}>
            View All →
          </Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ref #</th>
                <th>Applicant</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentApplications?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                    No applications yet
                  </td>
                </tr>
              )}
              {stats.recentApplications?.map((app) => (
                <tr key={app.id} className={styles.tableRowClickable}>
                  <td>
                    <Link href={`/admin/applications/${app.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {app.refNo}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{app.fullName}</td>
                  <td>{app.course?.name || '—'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span className={STATUS_BADGE[app.status] || 'badge'}>
                      {STATUS_LABEL[app.status] || app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications by Category */}
      {stats.byCategory?.length > 0 && (
        <div className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>Applications by Category</h2>
          {stats.byCategory.map((cat) => (
            <div key={cat.category} className={styles.categoryBar}>
              <span className={styles.categoryLabel}>{cat.category}</span>
              <div className={styles.categoryTrack}>
                <div
                  className={styles.categoryFill}
                  style={{ width: `${Math.max((cat.count / maxCategory) * 100, 8)}%` }}
                >
                  <span className={styles.categoryCount}>{cat.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
