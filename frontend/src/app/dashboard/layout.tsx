import ProtectedRoute from '@/components/common/ProtectedRoute';
import { PromptProvider } from '@/contexts/PromptContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <PromptProvider>
        {children}
      </PromptProvider>
    </ProtectedRoute>
  );
}
