'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Inbox } from 'lucide-react';
import styles from '../admin.module.css';

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

export default function ApplicationsList() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
    });

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);

    fetch(`/api/admin/applications?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, debouncedSearch, statusFilter]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Applications</h1>
        <p className={styles.pageSubtitle}>{total} total application{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, email, or reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Loading applications…</p>
            </div>
          ) : applications.length === 0 ? (
            <div className={styles.emptyState}>
              <Inbox className={styles.emptyIcon} size={44} strokeWidth={1.8} />
              <div className={styles.emptyTitle}>No applications found</div>
              <p className={styles.emptyText}>
                {debouncedSearch || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filters.'
                  : 'Applications will appear here as they come in.'}
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className={styles.tableRowClickable}>
                    <td>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        style={{ color: 'var(--primary)', fontWeight: 600 }}
                      >
                        {app.refNo}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{app.fullName}</td>
                    <td>{app.email}</td>
                    <td>{app.course?.name || '—'}</td>
                    <td>
                      {new Date(app.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className={STATUS_BADGE[app.status] || 'badge'}>
                        {STATUS_LABEL[app.status] || app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Page {page} of {totalPages} · {total} result{total !== 1 ? 's' : ''}
            </span>
            <div className={styles.paginationButtons}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Prev
              </button>
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
