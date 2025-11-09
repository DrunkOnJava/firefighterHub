/**
 * Mobile Bottom Navigation Bar
 * 
 * Fixed bottom tab navigation for mobile devices with safe-area support.
 */

import { Calendar, Clock, Home } from 'lucide-react';
import { useDevice } from '../../hooks/useDevice';
import { useHapticFeedback } from '../../hooks/useTouchGestures';
import { Button } from '@/components/ui/button';

type TabId = 'home' | 'calendar' | 'activity';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const device = useDevice();
  const haptic = useHapticFeedback();

  if (!device.isMobile) return null;

  const handleTabClick = (tab: TabId) => {
    haptic.light();
    onTabChange(tab);
  };

  const tabs = [
    { id: 'home' as TabId, label: 'Roster', icon: Home },
    { id: 'calendar' as TabId, label: 'Calendar', icon: Calendar },
    { id: 'activity' as TabId, label: 'Activity', icon: Clock },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1
                min-h-[56px] w-full py-2 rounded-none
                transition-colors
                ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}
              `}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
