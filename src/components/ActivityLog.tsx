import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Award } from 'lucide-react';

interface ActivityEntry {
  id: string;
  firefighter_name: string;
  action_type: string;
  details: string | null;
  created_at: string;
}

interface CompletedHold {
  id: string;
  firefighter_name: string;
  hold_date: string;
  fire_station: string | null;
  completed_at: string;
  shift: string;
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [completedHolds, setCompletedHolds] = useState<CompletedHold[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'holds'>('recent');

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
  }, [loadData]);

  async function loadData() {
    await Promise.all([loadActivities(), loadCompletedHolds()]);
  }

  async function loadActivities() {
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
  }

  async function loadCompletedHolds() {
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
  }

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'added':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800';
      case 'removed':
        return 'bg-red-950/70 text-red-400 border-red-800';
      case 'completed_hold':
        return 'bg-sky-950/70 text-sky-400 border-sky-800';
      case 'on_duty':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800';
      case 'off_duty':
        return 'bg-red-950/70 text-red-400 border-red-800';
      default:
        return 'bg-slate-900/70 text-slate-400 border-slate-700';
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
      <div className="border-b border-gray-700 px-6 pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
              activeTab === 'recent'
                ? 'text-blue-400 border-blue-500'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('holds')}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'holds'
                ? 'text-orange-400 border-orange-500'
                : 'text-gray-400 border-transparent hover:text-gray-300'
            }`}
          >
            <Award size={16} />
            Completed Holds
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : activeTab === 'recent' ? (
          activities.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No activity yet</p>
              <p className="text-sm text-gray-500 mt-2">Every change you make is logged here for your records</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white text-lg">{activity.firefighter_name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getActionColor(activity.action_type)}`}>
                          {formatActionType(activity.action_type)}
                        </span>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-gray-400 mb-2">{activity.details}</p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center gap-1">
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
            <Award size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No completed holds yet</p>
            <p className="text-sm text-gray-500 mt-2">Completed holds are permanently logged here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedHolds.map((hold) => (
              <div
                key={hold.id}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-900/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-amber-400" />
                      <span className="font-bold text-white text-lg">{hold.firefighter_name}</span>
                      <span className="px-2 py-1 rounded text-xs font-bold border bg-amber-950/70 text-amber-400 border-amber-800">
                        COMPLETED
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm text-gray-300">
                        Hold Date: <span className="font-semibold">{new Date(hold.hold_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                      {hold.fire_station && (
                        <p className="text-sm text-gray-300">
                          Station: <span className="font-semibold">#{hold.fire_station}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-300">
                        Shift: <span className="font-semibold">{hold.shift}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      Completed {formatTime(hold.completed_at)}
                    </p>
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
