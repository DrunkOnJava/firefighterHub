import { ChevronRight, Home } from 'lucide-react';
import { colors, tokens } from '../styles';

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
      <ol className={`flex items-center ${tokens.spacing.gap.sm} ${tokens.typography.body.secondary}`}>
        <li>
          <a
            href="/"
            className={`flex items-center gap-1.5 ${colors.structural.text.tertiary} hover:${colors.structural.text.primary} transition-colors focus-ring rounded px-2 py-1`}
            aria-label="Home"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className={`flex items-center ${tokens.spacing.gap.sm}`}>
            <ChevronRight size={16} className={colors.structural.text.tertiary} aria-hidden="true" />
            {item.active ? (
              <span className={`${colors.structural.text.primary} font-semibold px-2 py-1`} aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className={`${colors.structural.text.tertiary} hover:${colors.structural.text.primary} transition-colors focus-ring rounded px-2 py-1`}
              >
                {item.label}
              </a>
            ) : (
              <span className={`${colors.structural.text.tertiary} px-2 py-1`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
