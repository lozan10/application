'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  GraduationCap,
  User,
  Phone,
  BookOpen,
  Wallet,
  Settings2,
  Images,
  IdCard,
  Award,
  FileText,
  Eye,
  ExternalLink,
} from 'lucide-react';
import Lightbox from '@/components/admin/Lightbox';
import styles from '../../admin.module.css';

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const isImageUrl = (url) => !!url && IMAGE_EXT.test(url);

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

export default function ApplicationDetail() {
  const params = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/applications?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setApp(null);
        } else {
          setApp(data);
          setStatus(data.status);
          setNotes(data.notes || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');

    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, status, notes }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApp(updated);
        setSaveMsg('Changes saved successfully!');
        setTimeout(() => setSaveMsg(''), 3000);
      } else {
        setSaveMsg('Failed to save. Please try again.');
      }
    } catch {
      setSaveMsg('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading application…</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className={styles.emptyState}>
        <Search className={styles.emptyIcon} size={44} strokeWidth={1.8} />
        <div className={styles.emptyTitle}>Application not found</div>
        <p className={styles.emptyText}>This application may have been removed.</p>
        <Link href="/admin/applications" className="btn-ghost" style={{ marginTop: 16 }}>
          <ArrowLeft size={15} strokeWidth={2.4} /> Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <Link href="/admin/applications" className={styles.backLink}>
        ← Back to Applications
      </Link>

      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          {app.photoUrl ? (
            <img
              src={app.photoUrl}
              alt={app.fullName}
              className={styles.detailPhoto}
              onClick={() => setLightbox({ src: app.photoUrl, title: `${app.fullName} — Photo` })}
              style={{ cursor: 'zoom-in' }}
            />
          ) : (
            <div className={styles.detailPhotoPlaceholder}>
              {app.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className={styles.detailName}>{app.fullName}</h1>
            <div className={styles.detailRef}>{app.refNo}</div>
          </div>
        </div>
        <span className={STATUS_BADGE[app.status] || 'badge'}>
          {STATUS_LABEL[app.status] || app.status}
        </span>
      </div>

      {/* Course Info */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <GraduationCap className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Course
        </h3>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Course</span>
            <span className={styles.fieldValue}>{app.course?.name || '—'}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Category</span>
            <span className={styles.fieldValue}>{app.course?.category || '—'}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Duration</span>
            <span className={styles.fieldValue}>{app.course?.duration || '—'}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Price</span>
            <span className={styles.fieldValue}>{app.course?.price || '—'}</span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <User className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Personal Information
        </h3>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Full Name</span>
            <span className={styles.fieldValue}>{app.fullName}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Date of Birth</span>
            <span className={styles.fieldValue}>{app.dob}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Gender</span>
            <span className={styles.fieldValue}>{app.gender}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <Phone className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Contact Information
        </h3>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Phone</span>
            <span className={styles.fieldValue}>{app.phone}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Email</span>
            <span className={styles.fieldValue}>{app.email}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Address</span>
            <span className={styles.fieldValue}>{app.address}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>City</span>
            <span className={styles.fieldValue}>{app.city || '—'}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Country</span>
            <span className={styles.fieldValue}>{app.country}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Next of Kin</span>
            <span className={styles.fieldValue}>{app.kinName}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Kin Phone</span>
            <span className={styles.fieldValue}>{app.kinPhone}</span>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <BookOpen className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Education
        </h3>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Education Level</span>
            <span className={styles.fieldValue}>{app.education}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>School</span>
            <span className={styles.fieldValue}>{app.school}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Year Completed</span>
            <span className={styles.fieldValue}>{app.yearDone || '—'}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Currently Working</span>
            <span className={styles.fieldValue}>{app.working || '—'}</span>
          </div>
        </div>
      </div>

      {/* Funding */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <Wallet className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Funding
        </h3>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Funding Method</span>
            <span className={styles.fieldValue}>{app.funding}</span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Heard From</span>
            <span className={styles.fieldValue}>{app.heardFrom || '—'}</span>
          </div>
        </div>
      </div>

      {/* Documents & Photos */}
      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <Images className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Documents & Photos
        </h3>

        {!app.photoUrl && !app.idDocUrl && !app.certDocUrl ? (
          <div className={styles.docEmpty}>No documents or photos uploaded</div>
        ) : (
          <div className={styles.docsGrid}>
            {app.photoUrl && (
              <DocCard
                url={app.photoUrl}
                label="Applicant Photo"
                icon={User}
                onPreview={() => setLightbox({ src: app.photoUrl, title: `${app.fullName} — Photo` })}
              />
            )}
            {app.idDocUrl && (
              <DocCard
                url={app.idDocUrl}
                label="ID Document"
                icon={IdCard}
                onPreview={() => setLightbox({ src: app.idDocUrl, title: `${app.fullName} — ID Document` })}
              />
            )}
            {app.certDocUrl && (
              <DocCard
                url={app.certDocUrl}
                label="Certificate"
                icon={Award}
                onPreview={() => setLightbox({ src: app.certDocUrl, title: `${app.fullName} — Certificate` })}
              />
            )}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />
      )}

      {/* Status Change & Notes */}
      <div className={styles.statusChangeCard}>
        <h3 className={styles.sectionTitle}>
          <Settings2 className={styles.sectionIcon} size={18} strokeWidth={2.2} /> Update Application
        </h3>

        <div className={styles.statusForm}>
          <div className={styles.fieldItem} style={{ flex: 1, minWidth: 180 }}>
            <span className={styles.fieldLabel}>Status</span>
            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ alignSelf: 'flex-end' }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
        </div>

        <textarea
          className={styles.notesArea}
          placeholder="Add admin notes about this application…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Metadata */}
      <div className={styles.detailSection} style={{ opacity: 0.7 }}>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Applied On</span>
            <span className={styles.fieldValue}>
              {new Date(app.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className={styles.fieldItem}>
            <span className={styles.fieldLabel}>Last Updated</span>
            <span className={styles.fieldValue}>
              {new Date(app.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocCard({ url, label, icon: Icon, onPreview }) {
  if (isImageUrl(url)) {
    return (
      <button type="button" className={styles.docCard} onClick={onPreview}>
        <img src={url} alt={label} className={styles.docThumbImg} />
        <div className={styles.docOverlay}>
          <span className={styles.docOverlayLabel}>
            <Eye size={13} strokeWidth={2.4} /> View
          </span>
        </div>
        <span className={styles.docCaption}>
          <Icon size={13} strokeWidth={2.2} /> {label}
        </span>
      </button>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.docCard}>
      <div className={styles.docFileIconWrap}>
        <FileText size={30} strokeWidth={1.6} />
      </div>
      <div className={styles.docOverlay}>
        <span className={styles.docOverlayLabel}>
          <ExternalLink size={13} strokeWidth={2.4} /> Open
        </span>
      </div>
      <span className={styles.docCaption}>
        <Icon size={13} strokeWidth={2.2} /> {label}
      </span>
    </a>
  );
}
