/**
 * DashboardPage - Comprehensive overview for firefighters
 *
 * Shows:
 * - Large calendar of this month's holds across all shifts
 * - All three rotation lists (A, B, C) with last hold dates
 * - Key statistics and metrics
 */

import { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedMainCalendar } from '@/features/schedule/components/calendar/OptimizedMainCalendar';
import { FirefighterList } from '@/features/roster/components/FirefighterList';
import { Firefighter, ScheduledHold, Shift } from '@/lib/supabase';
import { Calendar as CalendarIcon, Users, TrendingUp, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

interface DashboardPageProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  firefightersA: Firefighter[];
  firefightersB: Firefighter[];
  firefightersC: Firefighter[];
  scheduledHolds: ScheduledHold[];
  isLoading?: boolean;
  isAdminMode?: boolean;
  deactivatedFirefightersA?: Firefighter[];
  deactivatedFirefightersB?: Firefighter[];
  deactivatedFirefightersC?: Firefighter[];
  onAddFirefighter?: (shift: Shift) => void;
  onCompleteHold?: (id: string) => void;
  onDeleteFirefighter?: (id: string) => void;
  onDeactivateFirefighter?: (id: string) => void;
  onReactivateFirefighter?: (id: string, position: number) => void;
  onTransferShift?: (id: string) => void;
  onResetAll?: (shift: Shift) => void;
  onReorderFirefighters?: (firefighters: Firefighter[], shift: Shift) => void;
  onVolunteerHold?: (id: string) => void;
}

// Statistics Card Component with accent color
const StatCard = memo<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  accentColor?: string;
}>(({ title, value, subtitle, icon, trend, accentColor = 'border-l-primary' }) => {
  return (
    <Card className={`border-l-4 ${accentColor} shadow-xl hover:shadow-2xl transition-shadow duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 py-5">
        <CardTitle className="text-base font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-6 w-6 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-3xl sm:text-4xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
        )}
        {trend && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

// Remove RotationList - using FirefighterList instead

/**
 * DashboardPage - Main overview page
 */
export const DashboardPage = memo<DashboardPageProps>(({
  currentMonth,
  onMonthChange,
  firefightersA,
  firefightersB,
  firefightersC,
  scheduledHolds,
  isLoading = false,
  isAdminMode = false,
  deactivatedFirefightersA = [],
  deactivatedFirefightersB = [],
  deactivatedFirefightersC = [],
  onAddFirefighter,
  onCompleteHold,
  onDeleteFirefighter,
  onDeactivateFirefighter,
  onReactivateFirefighter,
  onTransferShift,
  onResetAll,
  onReorderFirefighters,
  onVolunteerHold,
}) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Holds this month
    const holdsThisMonth = scheduledHolds.filter(hold => {
      if (!hold.hold_date) return false;
      const holdDate = new Date(hold.hold_date);
      return holdDate >= monthStart && holdDate <= monthEnd;
    });

    // Total firefighters
    const totalFirefighters = firefightersA.length + firefightersB.length + firefightersC.length;

    // Available firefighters
    const availableFirefighters = [
      ...firefightersA,
      ...firefightersB,
      ...firefightersC
    ].filter(ff => ff.is_available).length;

    // Average days between holds (for firefighters with holds)
    const firefightersWithHolds = [
      ...firefightersA,
      ...firefightersB,
      ...firefightersC
    ].filter(ff => ff.last_hold_date);

    const avgDaysBetweenHolds = firefightersWithHolds.length > 0
      ? Math.round(
          firefightersWithHolds.reduce((sum, ff) => {
            const days = differenceInDays(new Date(), new Date(ff.last_hold_date!));
            return sum + days;
          }, 0) / firefightersWithHolds.length
        )
      : 0;

    return {
      holdsThisMonth: holdsThisMonth.length,
      totalFirefighters,
      availableFirefighters,
      avgDaysBetweenHolds,
    };
  }, [currentMonth, scheduledHolds, firefightersA, firefightersB, firefightersC]);

  // Combine all firefighters for calendar
  // const allFirefighters = useMemo(() => { // Unused - metrics use per-shift firefighters
  //   return [...firefightersA, ...firefightersB, ...firefightersC];
  // }, [firefightersA, firefightersB, firefightersC]);

  return (
    <main className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Dashboard</h1>
          <p className="text-base text-muted-foreground mt-2">
            Overview of hold rotation and schedules
          </p>
        </div>
        <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
          {format(currentMonth, 'MMMM yyyy')}
        </Badge>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Holds This Month"
          value={stats.holdsThisMonth}
          subtitle={`Across all ${stats.totalFirefighters} firefighters`}
          icon={<CalendarIcon className="h-6 w-6" />}
          accentColor="border-l-blue-500"
        />
        <StatCard
          title="Available"
          value={stats.availableFirefighters}
          subtitle={`${stats.totalFirefighters} total firefighters`}
          icon={<Users className="h-6 w-6" />}
          accentColor="border-l-emerald-500"
        />
        <StatCard
          title="Avg Days Between Holds"
          value={stats.avgDaysBetweenHolds}
          subtitle="Across all firefighters"
          icon={<Clock className="h-6 w-6" />}
          accentColor="border-l-orange-500"
        />
        <StatCard
          title="Active Rotations"
          value={3}
          subtitle="Shifts A, B, and C"
          icon={<TrendingUp className="h-6 w-6" />}
          accentColor="border-l-purple-500"
        />
      </div>

      {/* Main Content: Calendar + Rotation Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Large Calendar - Takes 2 columns on xl screens */}
        <Card className="xl:col-span-2 border shadow-2xl">
          <CardHeader className="pb-6 px-6 py-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">Hold Schedule</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">
              All holds across all shifts for {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OptimizedMainCalendar
              currentMonth={currentMonth}
              onMonthChange={onMonthChange}
              scheduledHolds={scheduledHolds}
              selectedFirefighterId={null}
              onDayClick={() => {}}
              isLoading={isLoading}
            />
          </CardContent>

          {/* Calendar Legend */}
          <div className="px-6 py-3 border-t bg-muted/20">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-medium text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-orange-500 to-red-600" />
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-green-600" />
                <span>Completed</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Rotation Lists - Tabs with FirefighterList */}
        <Card className="border shadow-2xl">
          <CardHeader className="pb-6 px-6 py-6">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">Rosters</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">
              All firefighters across all shifts
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <Tabs defaultValue="A" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 p-1">
                <TabsTrigger value="A" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-red-500">
                  Shift A <span className="text-xs ml-1.5 opacity-70">({firefightersA.length})</span>
                </TabsTrigger>
                <TabsTrigger value="B" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-rose-500">
                  Shift B <span className="text-xs ml-1.5 opacity-70">({firefightersB.length})</span>
                </TabsTrigger>
                <TabsTrigger value="C" className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-b-blue-500">
                  Shift C <span className="text-xs ml-1.5 opacity-70">({firefightersC.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="A" className="mt-3">
                <div className="max-h-[500px] overflow-auto">
                  <FirefighterList
                    firefighters={firefightersA}
                    deactivatedFirefighters={deactivatedFirefightersA}
                    onAdd={() => onAddFirefighter?.('A')}
                    onCompleteHold={onCompleteHold || (() => {})}
                    onDelete={onDeleteFirefighter || (() => {})}
                    onDeactivate={onDeactivateFirefighter || (() => {})}
                    onReactivate={onReactivateFirefighter || (() => {})}
                    onTransferShift={onTransferShift || (() => {})}
                    onResetAll={() => onResetAll?.('A')}
                    onReorder={(ffs) => onReorderFirefighters?.(ffs, 'A')}
                    onVolunteerHold={onVolunteerHold || (() => {})}
                    currentShift="A"
                    isAdminMode={isAdminMode}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="B" className="mt-3">
                <div className="max-h-[500px] overflow-auto">
                  <FirefighterList
                    firefighters={firefightersB}
                    deactivatedFirefighters={deactivatedFirefightersB}
                    onAdd={() => onAddFirefighter?.('B')}
                    onCompleteHold={onCompleteHold || (() => {})}
                    onDelete={onDeleteFirefighter || (() => {})}
                    onDeactivate={onDeactivateFirefighter || (() => {})}
                    onReactivate={onReactivateFirefighter || (() => {})}
                    onTransferShift={onTransferShift || (() => {})}
                    onResetAll={() => onResetAll?.('B')}
                    onReorder={(ffs) => onReorderFirefighters?.(ffs, 'B')}
                    onVolunteerHold={onVolunteerHold || (() => {})}
                    currentShift="B"
                    isAdminMode={isAdminMode}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>

              <TabsContent value="C" className="mt-3">
                <div className="max-h-[500px] overflow-auto">
                  <FirefighterList
                    firefighters={firefightersC}
                    deactivatedFirefighters={deactivatedFirefightersC}
                    onAdd={() => onAddFirefighter?.('C')}
                    onCompleteHold={onCompleteHold || (() => {})}
                    onDelete={onDeleteFirefighter || (() => {})}
                    onDeactivate={onDeactivateFirefighter || (() => {})}
                    onReactivate={onReactivateFirefighter || (() => {})}
                    onTransferShift={onTransferShift || (() => {})}
                    onResetAll={() => onResetAll?.('C')}
                    onReorder={(ffs) => onReorderFirefighters?.(ffs, 'C')}
                    onVolunteerHold={onVolunteerHold || (() => {})}
                    currentShift="C"
                    isAdminMode={isAdminMode}
                    isLoading={isLoading}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
});

DashboardPage.displayName = 'DashboardPage';
