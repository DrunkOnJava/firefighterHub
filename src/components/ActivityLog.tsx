import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

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
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'removed':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'completed_hold':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'on_duty':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'off_duty':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-secondary text-muted-foreground border-border';
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
      <div className="border-b border-border px-6 pt-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('recent')}
            variant={activeTab === 'recent' ? 'default' : 'ghost'}
            size="sm"
            className="border-b-2 rounded-none"
          >
            Recent Activity
          </Button>
          <Button
            onClick={() => setActiveTab('holds')}
            variant={activeTab === 'holds' ? 'default' : 'ghost'}
            size="sm"
            className="border-b-2 rounded-none"
          >
            <Award size={16} className="mr-2" />
            Completed Holds
          </Button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : activeTab === 'recent' ? (
          activities.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No activity yet</p>
              <p className="text-sm text-muted-foreground mt-2">Every change you make is logged here for your records</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card
                  key={activity.id}
                  className="p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-foreground text-lg whitespace-nowrap">{activity.firefighter_name || 'Unknown'}</span>
                        <span className={`px-2 py-1 rounded text-sm font-bold border whitespace-nowrap ${getActionColor(activity.action_type)}`}>
                          {formatActionType(activity.action_type)}
                        </span>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mb-2">{activity.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : completedHolds.length === 0 ? (
          <div className="text-center py-12">
            <Award size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No completed holds yet</p>
            <p className="text-sm text-muted-foreground mt-2">Completed holds are permanently logged here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedHolds.map((hold) => (
              <Card
                key={hold.id}
                className="p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-yellow-500" />
                      <span className="font-bold text-foreground text-lg whitespace-nowrap">{hold.firefighter_name || 'Unknown'}</span>
                      <span className="px-2 py-1 rounded text-sm font-bold border bg-yellow-500/10 text-yellow-500 border-yellow-500/30 whitespace-nowrap">
                        COMPLETED
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      {hold.hold_date && (
                        <p className="text-sm text-muted-foreground">
                          Hold Date: <span className="font-semibold">{new Date(hold.hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                      )}
                      {hold.fire_station && (
                        <p className="text-sm text-muted-foreground">
                          Station: <span className="font-semibold">#{hold.fire_station}</span>
                        </p>
                      )}
                      {hold.shift && (
                        <p className="text-sm text-muted-foreground">
                          Shift: <span className="font-semibold">{hold.shift}</span>
                        </p>
                      )}
                    </div>
                    {hold.completed_at && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        Completed {formatTime(hold.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
