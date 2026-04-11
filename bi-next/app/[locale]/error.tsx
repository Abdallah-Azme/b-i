'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
        {t('somethingWentWrong') || 'Something went wrong!'}
      </h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        {error.message || t('unexpectedError') || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button onClick={() => reset()} variant="default">
        {t('tryAgain') || 'Try again'}
      </Button>
    </div>
  );
}
