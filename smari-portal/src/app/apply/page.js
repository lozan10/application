import ApplyWizard from '@/components/apply/ApplyWizard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Apply — SMARI Institute',
  description: 'Complete your Level 1 course application for SMARI Institute, Kampala.',
};

export default function ApplyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 20px 56px',
        boxSizing: 'border-box',
        background: 'radial-gradient(1400px 600px at 15% -10%, #f4f6f2, #e7eae5)',
      }}>
        <div style={{ width: '100%', maxWidth: 1240 }}>
          <ApplyWizard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
