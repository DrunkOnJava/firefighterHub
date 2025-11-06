/**
 * Calendar MaterialM Preview
 *
 * Shows what the FirefighterHub calendar would look like with MaterialM styling.
 * This is a visual mockup using MaterialM colors and Flowbite components.
 */

import { Card } from "flowbite-react";
import { colorsM3 } from "../styles";

export function CalendarMaterialMPreview() {
  return (
    <Card className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: colorsM3.error.error }} className="w-10 h-10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
              Hold Calendar
            </h2>
            <p className="text-sm" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
              Click any date to schedule or manage holds
            </p>
          </div>
        </div>
        <div style={{ backgroundColor: colorsM3.primary.primary }} className="px-3 py-1.5 text-white rounded-full text-sm font-medium">
          SHIFT A
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button className="p-2 hover:bg-white/8 rounded-lg transition-colors" style={{ color: colorsM3.neutral.onSurface }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
          November 2025
        </h3>
        <button className="p-2 hover:bg-white/8 rounded-lg transition-colors" style={{ color: colorsM3.neutral.onSurface }}>
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
            className="text-center text-xs font-medium py-2"
            style={{ color: colorsM3.neutral.onSurfaceVariant }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Sample Calendar Days (MaterialM Style) */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day with holds */}
        <div style={{
          backgroundColor: colorsM3.surface.containerLow,
          borderColor: colorsM3.neutral.outline
        }} className="min-h-[100px] p-2 rounded-lg border hover:border-opacity-60 cursor-pointer transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
              4
            </span>
            <span style={{ backgroundColor: colorsM3.error.error }} className="w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-medium">
              2
            </span>
          </div>
          <div className="space-y-1">
            <div style={{ backgroundColor: colorsM3.primary.primary }} className="text-[10px] px-1.5 py-0.5 text-white rounded font-medium truncate">
              J. Bryson
            </div>
            <div style={{ backgroundColor: colorsM3.primary.primary }} className="text-[10px] px-1.5 py-0.5 text-white rounded font-medium truncate">
              C. McCauley
            </div>
          </div>
        </div>

        {/* Empty day */}
        <div style={{
          backgroundColor: colorsM3.surface.container,
          borderColor: colorsM3.neutral.outline
        }} className="min-h-[100px] p-2 rounded-lg border hover:border-opacity-60 cursor-pointer transition-colors">
          <span className="text-sm font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
            5
          </span>
        </div>

        {/* Today */}
        <div style={{
          backgroundColor: colorsM3.primary.primaryContainer,
          borderColor: colorsM3.primary.primary,
          borderWidth: '2px'
        }} className="min-h-[100px] p-2 rounded-lg cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: colorsM3.primary.primary }}>
              6
            </span>
            <span style={{ backgroundColor: colorsM3.primary.primary }} className="text-[10px] px-1.5 py-0.5 text-white rounded-full font-medium">
              Today
            </span>
          </div>
        </div>

        {/* More sample days */}
        {[7, 8, 9, 10].map((day) => (
          <div
            key={day}
            style={{
              backgroundColor: colorsM3.surface.container,
              borderColor: colorsM3.neutral.outline
            }}
            className="min-h-[100px] p-2 rounded-lg border hover:border-opacity-60 cursor-pointer transition-colors"
          >
            <span className="text-sm font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4" style={{ borderTopColor: colorsM3.neutral.outline }} className="flex gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: colorsM3.primary.primary }} className="w-3 h-3 rounded"></div>
          <span className="text-xs" style={{ color: colorsM3.neutral.onSurfaceVariant }}>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: colorsM3.success.success }} className="w-3 h-3 rounded"></div>
          <span className="text-xs" style={{ color: colorsM3.neutral.onSurfaceVariant }}>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{
            backgroundColor: colorsM3.primary.primary,
            boxShadow: `0 0 0 2px ${colorsM3.primary.primary}33`
          }} className="w-3 h-3 rounded"></div>
          <span className="text-xs" style={{ color: colorsM3.neutral.onSurfaceVariant }}>Today</span>
        </div>
      </div>
    </Card>
  );
}
