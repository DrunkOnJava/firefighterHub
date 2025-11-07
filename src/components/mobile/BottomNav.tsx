/**
 * Mobile Bottom Navigation Bar
 * 
 * Fixed bottom tab navigation for mobile devices with safe-area support.
 */

import { Calendar, Clock, Home } from 'lucide-react';
import { useDevice } from '../../hooks/useDevice';
import { useHapticFeedback } from '../../hooks/useTouchGestures';
import { tokens } from '../../styles';

type TabId = 'home' | 'calendar' | 'activity';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isDarkMode?: boolean;
}

export function BottomNav({ activeTab, onTabChange, isDarkMode = true }: BottomNavProps) {
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
      className={`
        fixed bottom-0 left-0 right-0 z-40
        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        border-t ${tokens.shadows.lg}
      `}
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
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1
                ${tokens.touchTarget.min} w-full py-2
                ${tokens.transitions.fast}
                ${tokens.focus.noOffset}
                ${
                  isActive
                    ? isDarkMode
                      ? 'text-blue-400'
                      : 'text-blue-600'
                    : isDarkMode
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }
              `}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={24} />
              <span className={`${tokens.typography.body.small} font-medium`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
