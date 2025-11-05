/**
 * Calendar MaterialM Preview
 *
 * Shows what the FirefighterHub calendar would look like with MaterialM styling.
 * This is a visual mockup using MaterialM colors and Flowbite components.
 */

import { Card } from "flowbite-react";

export function CalendarMaterialMPreview() {
  return (
    <Card className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hold Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click any date to schedule or manage holds
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium">
          SHIFT A
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          November 2025
        </h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Sample Calendar Days (MaterialM Style) */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day with holds */}
        <div className="min-h-[100px] p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              4
            </span>
            <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              2
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded font-medium truncate">
              J. Bryson
            </div>
            <div className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded font-medium truncate">
              C. McCauley
            </div>
          </div>
        </div>

        {/* Empty day */}
        <div className="min-h-[100px] p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            5
          </span>
        </div>

        {/* Today */}
        <div className="min-h-[100px] p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              6
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded-full font-medium">
              Today
            </span>
          </div>
        </div>

        {/* More sample days */}
        {[7, 8, 9, 10].map((day) => (
          <div
            key={day}
            className="min-h-[100px] p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors"
          >
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-600 rounded"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded ring-2 ring-blue-500/30"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
        </div>
      </div>
    </Card>
  );
}
