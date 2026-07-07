import { Navbar } from '../components/Navbar';

export function MainLayout({ children, search, onSearchChange }) {
  return (
    <div className="min-h-screen bg-background transition-smooth">
      <Navbar search={search} onSearchChange={onSearchChange} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
