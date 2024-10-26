import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased">
      <Header />
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
