import { Home, Calendar, Activity, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'calendar' | 'activity' | 'menu';
  onTabChange: (tab: 'home' | 'calendar' | 'activity' | 'menu') => void;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Roster', icon: Home },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'activity' as const, label: 'Activity', icon: Activity },
    { id: 'menu' as const, label: 'Menu', icon: Menu },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
