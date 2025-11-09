import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <a
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
            aria-label="Home"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-muted-foreground" aria-hidden="true" />
            {item.active ? (
              <span className="text-foreground font-semibold px-2 py-1" aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-muted-foreground px-2 py-1">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
