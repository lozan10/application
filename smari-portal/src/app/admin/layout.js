'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ClipboardList, GraduationCap, LogOut, Menu } from 'lucide-react';
import Logo from '@/components/admin/Logo';
import styles from './admin.module.css';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
];

function AdminShell({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // On login page, render without shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking session
  if (status === 'loading') {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading…</p>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  const getBreadcrumb = () => {
    if (pathname === '/admin') return <><span>Dashboard</span></>;
    if (pathname === '/admin/applications') return <>Dashboard / <span>Applications</span></>;
    if (pathname.startsWith('/admin/applications/')) return <>Dashboard / Applications / <span>Detail</span></>;
    if (pathname === '/admin/courses') return <>Dashboard / <span>Courses</span></>;
    return <span>Dashboard</span>;
  };

  return (
    <div className={styles.adminShell}>
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          <Logo height={38} />
          <div className={styles.logoText}>
            <div className={styles.logoTitle}>SMARI</div>
            <div className={styles.logoSub}>Admin Portal</div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={19} strokeWidth={2.2} className={styles.navIcon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut size={19} strokeWidth={2.2} className={styles.navIcon} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className={styles.contentArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div className={styles.breadcrumb}>{getBreadcrumb()}</div>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.adminName}>{session.user?.name || 'Admin'}</span>
            <div className={styles.adminAvatar}>
              {(session.user?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
