import ProtectedRoute from '@/components/common/ProtectedRoute';
import { PromptProvider } from '@/contexts/PromptContext';

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <PromptProvider>{children}</PromptProvider>
    </ProtectedRoute>
  );
}
