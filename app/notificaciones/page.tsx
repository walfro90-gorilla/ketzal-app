import { Suspense } from 'react';
import NotificationsPage from './notifications-page';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NotificationsPage />
    </Suspense>
  );
}
