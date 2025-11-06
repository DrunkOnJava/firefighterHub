import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Award } from 'lucide-react';
import { colors, tokens } from '../styles';

interface ActivityEntry {
  id: string;
  firefighter_name: string | null;
  action_type: string;
  details: string | null;
  created_at: string;
}

interface CompletedHold {
  id: string;
  firefighter_name: string | null;
  hold_date: string | null;
  fire_station: string | null;
  completed_at: string | null;
  shift: string | null;
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [completedHolds, setCompletedHolds] = useState<CompletedHold[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'holds'>('recent');

  const loadActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompletedHolds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_holds')
        .select('*')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setCompletedHolds(data || []);
    } catch (error) {
      console.error('Error loading completed holds:', error);
    }
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([loadActivities(), loadCompletedHolds()]);
  }, [loadActivities, loadCompletedHolds]);

  useEffect(() => {
    loadData();

    const activityChannel = supabase
      .channel('activity_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log' }, loadActivities)
      .subscribe();

    const holdsChannel = supabase
      .channel('completed_holds_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scheduled_holds' }, loadCompletedHolds)
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(holdsChannel);
    };
  }, [loadActivities, loadCompletedHolds, loadData]);

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'added':
        return `${colors.semantic.success.light} ${colors.semantic.success.text} ${colors.semantic.success.border}`;
      case 'removed':
        return `${colors.semantic.error.light} ${colors.semantic.error.text} ${colors.semantic.error.border}`;
      case 'completed_hold':
        return `${colors.semantic.info.light} ${colors.semantic.info.text} ${colors.semantic.info.border}`;
      case 'on_duty':
        return `${colors.semantic.success.light} ${colors.semantic.success.text} ${colors.semantic.success.border}`;
      case 'off_duty':
        return `${colors.semantic.error.light} ${colors.semantic.error.text} ${colors.semantic.error.border}`;
      default:
        return `bg-slate-900/70 ${colors.structural.text.tertiary} ${colors.structural.border.subtle}`;
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className={`border-b ${colors.structural.border.default} ${tokens.spacing.card.lg} pt-4`}>
        <div className={`flex ${tokens.spacing.gap.sm}`}>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
              activeTab === 'recent'
                ? `${colors.semantic.primary.text} ${colors.semantic.primary.border}`
                : `${colors.structural.text.tertiary} border-transparent hover:${colors.structural.text.secondary}`
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('holds')}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 flex items-center ${tokens.spacing.gap.sm} ${
              activeTab === 'holds'
                ? `${colors.semantic.warning.text} ${colors.semantic.warning.border}`
                : `${colors.structural.text.tertiary} border-transparent hover:${colors.structural.text.secondary}`
            }`}
          >
            <Award size={16} />
            Completed Holds
          </button>
        </div>
      </div>

      <div className={tokens.spacing.card.lg}>
        {loading ? (
          <div className="text-center py-12">
            <div className={`w-12 h-12 border-4 ${colors.semantic.primary.border} border-t-transparent ${tokens.borders.radius.full} animate-spin mx-auto mb-4`}></div>
            <p className={colors.structural.text.tertiary}>Loading...</p>
          </div>
        ) : activeTab === 'recent' ? (
          activities.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className={`${colors.structural.text.tertiary} mx-auto mb-4`} />
              <p className={`${colors.structural.text.tertiary} text-lg`}>No activity yet</p>
              <p className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} mt-2`}>Every change you make is logged here for your records</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-gray-900/50 border ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.spacing.card.md} hover:bg-gray-900/70 transition-colors`}
                >
                  <div className={`flex items-start justify-between ${tokens.spacing.gap.md}`}>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}>
                        <span className={`font-bold ${colors.structural.text.primary} text-lg`}>{activity.firefighter_name || 'Unknown'}</span>
                        <span className={`px-2 py-1 rounded ${tokens.typography.body.small} font-bold border ${getActionColor(activity.action_type)}`}>
                          {formatActionType(activity.action_type)}
                        </span>
                      </div>
                      {activity.details && (
                        <p className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary} mb-2`}>{activity.details}</p>
                      )}
                      <p className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} flex items-center ${tokens.spacing.gap.xs}`}>
                        <Clock size={12} />
                        {formatTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : completedHolds.length === 0 ? (
          <div className="text-center py-12">
            <Award size={48} className={`${colors.structural.text.tertiary} mx-auto mb-4`} />
            <p className={`${colors.structural.text.tertiary} text-lg`}>No completed holds yet</p>
            <p className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} mt-2`}>Completed holds are permanently logged here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedHolds.map((hold) => (
              <div
                key={hold.id}
                className={`bg-gray-900/50 border ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.spacing.card.md} hover:bg-gray-900/70 transition-colors`}
              >
                <div className={`flex items-start justify-between ${tokens.spacing.gap.md}`}>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}>
                      <Award size={18} className={colors.semantic.warning.text} />
                      <span className={`font-bold ${colors.structural.text.primary} text-lg`}>{hold.firefighter_name || 'Unknown'}</span>
                      <span className={`px-2 py-1 rounded ${tokens.typography.body.small} font-bold border ${colors.semantic.warning.light} ${colors.semantic.warning.text} ${colors.semantic.warning.border}`}>
                        COMPLETED
                      </span>
                    </div>
                    <div className={`flex items-center ${tokens.spacing.gap.md} mb-2`}>
                      {hold.hold_date && (
                        <p className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>
                          Hold Date: <span className="font-semibold">{new Date(hold.hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                      )}
                      {hold.fire_station && (
                        <p className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>
                          Station: <span className="font-semibold">#{hold.fire_station}</span>
                        </p>
                      )}
                      {hold.shift && (
                        <p className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>
                          Shift: <span className="font-semibold">{hold.shift}</span>
                        </p>
                      )}
                    </div>
                    {hold.completed_at && (
                      <p className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} flex items-center ${tokens.spacing.gap.xs}`}>
                        <Clock size={12} />
                        Completed {formatTime(hold.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
