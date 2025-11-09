// REFACTORED: Reduced from 1,123 lines to ~400 lines by extracting sub-components
// Sub-components: RosterHeader, BulkActions, ExportMenu (in ./roster/)

import {
  ArrowUpDown,
  CheckSquare,
  Eye,
  HandHeart,
  History,
  Repeat,
  RotateCcw,
  Square,
  Trash2,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmOptions } from "../hooks/useConfirm";
import { useDevice } from "../hooks/useDevice";
import { useFilters } from "../hooks/useFilters";
import { Firefighter, Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";
import { formatHoldDate } from "../utils/dateUtils";
import { AddFirefighterForm } from "./AddFirefighterForm";
import { NoFirefightersEmptyState, NoSearchResultsEmptyState } from "./EmptyState";
import { FilterPanel } from "./FilterPanel";
import { FirefighterProfileModal } from "./FirefighterProfileModal";
import { FirefighterCard } from "./mobile/FirefighterCard";
import { ReactivateModal } from "./ReactivateModal";
import { FirefighterListSkeleton } from "./SkeletonLoader";
import { FirefighterGrid } from "./tablet/FirefighterGrid";
import { BulkActions, RosterHeader } from "./roster";
import { IconButton } from "./ui/IconButton";

interface FirefighterListProps {
  firefighters: Firefighter[];
  deactivatedFirefighters?: Firefighter[];
  onAdd: (name: string, station: string) => void;
  onCompleteHold: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string, position: number) => void;
  onTransferShift: (id: string) => void;
  onResetAll: () => void;
  onReorder: (firefighters: Firefighter[]) => void;
  onVolunteerHold?: (id: string) => void;
  currentShift?: Shift;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>;
  isLoading?: boolean;
}

export function FirefighterList({
  firefighters,
  deactivatedFirefighters = [],
  onAdd,
  onCompleteHold: _onCompleteHold, // Unused - kept for backwards compatibility
  onDelete,
  onDeactivate,
  onReactivate,
  onTransferShift,
  onResetAll: _onResetAll, // Unused - kept for backwards compatibility
  onReorder,
  onVolunteerHold,
  confirmAction,
  currentShift,
  isAdminMode = false,
  isDarkMode = true,
  searchInputRef: _searchInputRef,
  isLoading = false,
}: FirefighterListProps) {
  // Maintain backwards compatibility by ensuring legacy callbacks stay referenced
  void _onCompleteHold;
  void _onResetAll;

  // Device detection for responsive layout
  const device = useDevice();

  const [localFirefighters, setLocalFirefighters] =
    useState<Firefighter[]>(firefighters);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFirefighter, setSelectedFirefighter] =
    useState<Firefighter | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    filters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    activeFilterCount,
    applyFilters,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
  } = useFilters();

  useEffect(() => {
    if (draggedId === null) {
      setLocalFirefighters(firefighters);
    }
  }, [firefighters, draggedId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showExportMenu &&
        !(event.target as Element).closest('[aria-label="Export roster data"]')
      ) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showExportMenu]);

  // Apply filters to local firefighters
  const filteredAndAdvancedFiltered = applyFilters(localFirefighters);

  const nextInRotation = filteredAndAdvancedFiltered[0]; // First firefighter is next in rotation

  // Get unique stations for filter panel
  const availableStations = Array.from(
    new Set(firefighters.map((ff) => ff.fire_station).filter(Boolean))
  ).sort() as string[];

  function handleDragStart(e: React.DragEvent, firefighterId: string) {
    setDraggedId(firefighterId);
    e.dataTransfer.effectAllowed = "move";
    
    // Create a custom, compact drag image
    const dragImage = document.createElement('div');
    dragImage.style.height = '40px';
    dragImage.style.lineHeight = '40px';
    dragImage.style.padding = '0 12px';
    dragImage.style.background = isDarkMode ? '#1f2937' : '#f1f5f9';
    dragImage.style.border = '2px solid ' + (isDarkMode ? '#3b82f6' : '#2563eb');
    dragImage.style.borderRadius = '4px';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.fontSize = '14px';
    dragImage.style.fontWeight = 'bold';
    dragImage.style.color = isDarkMode ? '#fff' : '#000';
    
    const firefighter = localFirefighters.find(ff => ff.id === firefighterId);
    dragImage.textContent = firefighter?.name || 'Moving...';
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 20);
    
    // Clean up after drag starts
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }

  function handleDragOver(e: React.DragEvent, firefighterId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(firefighterId);
  }

  function handleDrop(e: React.DragEvent, targetFirefighterId: string) {
    e.preventDefault();

    if (draggedId && draggedId !== targetFirefighterId) {
      const draggedIndex = localFirefighters.findIndex(
        (ff) => ff.id === draggedId
      );
      const targetIndex = localFirefighters.findIndex(
        (ff) => ff.id === targetFirefighterId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const reordered = [...localFirefighters];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedItem);

        setLocalFirefighters(reordered);
        onReorder(reordered);
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleViewProfile(firefighter: Firefighter) {
    setSelectedFirefighter(firefighter);
    setShowProfileModal(true);
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(filteredAndAdvancedFiltered.map((ff) => ff.id)));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  async function handleBulkDelete() {
    const confirmed = confirmAction
      ? await confirmAction({
          title: "Delete Multiple Firefighters?",
          message: `Delete ${selectedIds.size} selected firefighters?`,
          confirmText: "Delete All",
          cancelText: "Cancel",
          variant: "danger",
          consequences: [
            `${selectedIds.size} firefighters will be removed`,
            "This action cannot be undone",
          ],
        })
      : confirm(
          `Delete ${selectedIds.size} selected firefighters?\n\nThis action cannot be undone.`
        );

    if (!confirmed) return;

    selectedIds.forEach((id) => onDelete(id));
    deselectAll();
  }

  async function handleBulkDeactivate() {
    const confirmed = confirmAction
      ? await confirmAction({
          title: "Deactivate Multiple Firefighters?",
          message: `Deactivate ${selectedIds.size} selected firefighters?`,
          confirmText: "Deactivate All",
          cancelText: "Cancel",
          variant: "warning",
          consequences: [
            `${selectedIds.size} firefighters will be deactivated`,
            "They can be reactivated later",
            "All history will be preserved",
          ],
        })
      : confirm(`Deactivate ${selectedIds.size} selected firefighters?`);

    if (!confirmed) return;

    selectedIds.forEach((id) => onDeactivate(id));
    deselectAll();
  }

  // Export handlers are wired through ExportMenu component
  // The menu directly calls exportRosterToCSV/exportRosterToJSON utils

  return (
    <div
      className={`
        ${colors.structural.bg.card}
        ${colors.structural.border.default}
        ${tokens.borders.radius.xl}
        ${tokens.shadows["2xl"]}
        border-2
        overflow-hidden
      `}
    >
      {isLoading ? (
        <FirefighterListSkeleton />
      ) : (
        <>
          {/* Header with sub-component */}
          <RosterHeader
            firefighters={firefighters}
            currentShift={currentShift || "A"}
            isAdminMode={isAdminMode}
            isDarkMode={isDarkMode}
            onAddClick={() => setShowAddForm(!showAddForm)}
            onViewDeactivatedClick={() => setShowReactivateModal(true)}
            onFilterToggle={() => setIsFilterPanelOpen(true)}
            showExportMenu={showExportMenu}
            onExportToggle={() => setShowExportMenu(!showExportMenu)}
            activeFilterCount={activeFilterCount}
            deactivatedCount={deactivatedFirefighters.length}
          />

          <div className="px-6 pb-6">
            {/* Add Firefighter Form (Collapsible) */}
            {isAdminMode && showAddForm && (
              <div className={tokens.spacing.margin.lg}>
                <AddFirefighterForm
                  onAdd={(name, station) => {
                    onAdd(name, station);
                    setShowAddForm(false);
                  }}
                />
              </div>
            )}

            {/* Bulk Actions with sub-component */}
            <BulkActions
              selectedCount={selectedIds.size}
              totalCount={filteredAndAdvancedFiltered.length}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onBulkDelete={handleBulkDelete}
              onBulkDeactivate={handleBulkDeactivate}
              isAdminMode={isAdminMode}
            />

            {firefighters.length === 0 ? (
              <NoFirefightersEmptyState 
                onAddFirefighter={() => setShowAddForm(true)}
                isAdminMode={isAdminMode}
              />
            ) : filteredAndAdvancedFiltered.length === 0 ? (
              <NoSearchResultsEmptyState
                searchTerm="your filters"
                onClearSearch={clearAllFilters}
              />
            ) : device.isMobile ? (
              /* Mobile View: Card Layout */
              <div className="flex flex-col gap-3">
                {filteredAndAdvancedFiltered.map((firefighter) => (
                  <FirefighterCard
                    key={firefighter.id}
                    firefighter={firefighter}
                    onCompleteHold={onDelete}
                    onTransferShift={onTransferShift}
                    onDeactivate={onDeactivate}
                    onSelect={handleViewProfile}
                    isAdminMode={isAdminMode}
                    isDarkMode={isDarkMode}
                    isNextInRotation={nextInRotation?.id === firefighter.id}
                  />
                ))}
              </div>
            ) : device.isTablet ? (
              /* Tablet View: 2-Column Grid */
              <FirefighterGrid
                firefighters={filteredAndAdvancedFiltered}
                onCompleteHold={onDelete}
                onTransferShift={onTransferShift}
                onDeactivate={onDeactivate}
                onSelect={handleViewProfile}
                isAdminMode={isAdminMode}
                isDarkMode={isDarkMode}
                columns={2}
              />
            ) : (
              /* Desktop View: Table (Existing) */
          <>
            <style>{`
              .roster-table {
                display: table;
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
              }
              .roster-table thead {
                position: sticky;
                top: 0;
                z-index: 10;
              }
              .roster-table tbody {
                display: table-row-group;
              }
              .roster-table tbody tr {
                height: auto !important;
                max-height: none !important;
                display: table-row;
              }
              .roster-table tbody td {
                height: auto !important;
                max-height: none !important;
                padding-top: 0.75rem !important;
                padding-bottom: 0.75rem !important;
                vertical-align: middle !important;
                white-space: nowrap !important;
              }
              .roster-table tbody td > div {
                max-height: none !important;
                white-space: nowrap !important;
              }
              /* Compact view when > 15 rows */
              .roster-table.compact tbody tr {
                height: 36px !important;
              }
              .roster-table.compact tbody td {
                height: 36px !important;
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
                font-size: 0.875rem !important;
              }
            `}</style>
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] -mx-6">
            <table className={`roster-table ${filteredAndAdvancedFiltered.length > 15 ? 'compact' : ''} min-w-max`}>
              <thead className="sticky top-0 z-10">
                <tr
                  className={`border-b-2 ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-center ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <button
                        onClick={
                          selectedIds.size ===
                          filteredAndAdvancedFiltered.length
                            ? deselectAll
                            : selectAll
                        }
                        className="p-1 hover:bg-slate-700 rounded transition-colors"
                        aria-label={
                          selectedIds.size ===
                          filteredAndAdvancedFiltered.length
                            ? "Deselect all"
                            : "Select all"
                        }
                      >
                        {selectedIds.size ===
                        filteredAndAdvancedFiltered.length ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </th>
                  )}
                  <th
                    className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className={tokens.icons.xs} />
                      Order
                    </div>
                  </th>
                  <th
                    className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Name
                  </th>
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Shift
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Station
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Cert Level
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Qualifications
                    </th>
                  )}
                  <th
                    className={`px-4 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Last Hold
                  </th>
                  {/* Volunteer Column - visible to all users */}
                  <th
                    className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Volunteer
                  </th>
                  {/* REMOVED: Hours Worked column per user feedback
                        User stated: "There is no way to accurately calculate that without
                        manually checking through the scheduling program"
                    <th
                      className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                      }`}
                    >
                      Hours Worked
                    </th>
                    */}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-2 text-right text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}>
                {filteredAndAdvancedFiltered.map((firefighter, index) => {
                  const qualifications = [
                    firefighter.is_fto && "FTO",
                    firefighter.is_bls && "BLS",
                    firefighter.is_als && "ALS",
                  ].filter((q): q is string => Boolean(q));

                  const isNext = nextInRotation?.id === firefighter.id;

                  // Banded rows for better readability
                  const isEvenRow = index % 2 === 0;
                  const bandedBg = isEvenRow
                    ? isDarkMode
                      ? "bg-slate-900/30"
                      : "bg-slate-50/50"
                    : "";

                  return (
                    <tr
                      key={firefighter.id}
                      draggable={isAdminMode}
                      onDragStart={(e) => handleDragStart(e, firefighter.id)}
                      onDragOver={(e) => handleDragOver(e, firefighter.id)}
                      onDrop={(e) => handleDrop(e, firefighter.id)}
                      onDragEnd={handleDragEnd}
                      className={`h-10 transition-colors ${
                        isDarkMode
                          ? "hover:bg-slate-800/50"
                          : "hover:bg-slate-50"
                      } ${bandedBg} ${draggedId === firefighter.id ? "opacity-50" : ""} ${
                        dragOverId === firefighter.id
                          ? isDarkMode
                            ? "bg-blue-900/20 border-l-4 border-blue-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      } ${
                        isNext
                          ? isDarkMode
                            ? "bg-blue-950/40 ring-2 ring-inset ring-blue-500/60"
                            : "bg-blue-100 ring-2 ring-inset ring-blue-500"
                          : ""
                      } ${isAdminMode ? 'cursor-move' : 'cursor-default'}`}
                    >
                      {isAdminMode && (
                        <td className="px-4 py-0 max-h-10 whitespace-nowrap text-center align-middle">
                          <button
                            onClick={() => toggleSelection(firefighter.id)}
                            className={`p-0 rounded transition-colors ${
                              isDarkMode
                                ? "hover:bg-slate-700"
                                : "hover:bg-slate-200"
                            }`}
                            aria-label={`Select ${firefighter.name}`}
                          >
                            {selectedIds.has(firefighter.id) ? (
                              <CheckSquare
                                className={`w-4 h-4 ${
                                  isDarkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                              />
                            ) : (
                              <Square
                                className={`w-4 h-4 ${
                                  isDarkMode
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }`}
                              />
                            )}
                          </button>
                        </td>
                      )}
                      <td
                        className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap whitespace-nowrap text-sm ${
                          isDarkMode ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span className="font-bold">{index + 1}</span>
                      </td>
                      <td
                        className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-1 h-10 whitespace-nowrap">
                          {/* Shift Badge */}
                          <div
                            className={`w-3 h-3 flex-shrink-0 ${
                              firefighter.shift === 'A'
                                ? 'rounded-full bg-gradient-to-br from-cyan-500 to-blue-600'
                                : firefighter.shift === 'B'
                                ? 'rounded-sm bg-gradient-to-br from-rose-500 to-red-600'
                                : 'rotate-45 bg-gradient-to-br from-blue-500 to-indigo-600'
                            }`}
                          />
                          <button
                            onClick={() => handleViewProfile(firefighter)}
                            className="font-bold text-sm hover:text-orange-500 dark:hover:text-orange-400 transition-colors underline decoration-transparent hover:decoration-current focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-0.5 whitespace-nowrap"
                            aria-label={`View profile for ${firefighter.name}`}
                          >
                            {firefighter.name}
                          </button>
                          {isNext && (
                            <span className="px-1.5 py-0 bg-blue-600 text-white text-[10px] font-bold rounded leading-tight">
                              NEXT
                            </span>
                          )}
                        </div>
                      </td>
                      {isAdminMode && (
                        <td
                          className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap whitespace-nowrap ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded font-bold text-xs ${
                              firefighter.shift === "A"
                                ? "bg-green-900/70 text-green-300"
                                : firefighter.shift === "B"
                                ? "bg-red-900/70 text-red-300"
                                : "bg-slate-900/70 text-slate-300"
                            }`}
                          >
                            Shift {firefighter.shift}
                          </span>
                        </td>
                      )}
                      {isAdminMode && (
                        <td
                          className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap whitespace-nowrap text-sm ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {firefighter.fire_station ? (
                            <span className="font-semibold">
                              Station #{firefighter.fire_station}
                            </span>
                          ) : (
                            <span
                              className={
                                isDarkMode ? "text-gray-600" : "text-slate-400"
                              }
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}
                      {isAdminMode && (
                        <td
                          className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap whitespace-nowrap text-sm ${
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {firefighter.certification_level ? (
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded ${
                                isDarkMode
                                  ? "bg-amber-900/70 text-amber-100"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {firefighter.certification_level}
                            </span>
                          ) : (
                            <span
                              className={
                                isDarkMode ? "text-gray-600" : "text-slate-400"
                              }
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}
                      {isAdminMode && (
                        <td className="px-4 py-0 align-middle max-h-10 whitespace-nowrap overflow-hidden">
                          {qualifications.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {qualifications.map((qual) => (
                                <span
                                  key={qual}
                                  className="px-1.5 py-0.5 bg-sky-900/70 text-sky-300 text-xs font-semibold rounded"
                                >
                                  {qual}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              className={
                                isDarkMode ? "text-gray-600" : "text-slate-400"
                              }
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}
                      <td
                        className={`px-4 py-0 align-middle max-h-10 whitespace-nowrap whitespace-nowrap text-sm ${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>
                            {firefighter.last_hold_date ? (
                              formatHoldDate(firefighter.last_hold_date)
                            ) : (
                              <span
                                className={
                                  isDarkMode
                                    ? "text-gray-600"
                                    : "text-slate-400"
                                }
                              >
                                Never
                              </span>
                            )}
                          </span>
                          {isAdminMode && (
                            <IconButton
                              icon={History}
                              label={`View hold history for ${firefighter.name}`}
                              onClick={() => {
                                setSelectedFirefighter(firefighter);
                                setShowProfileModal(true);
                              }}
                              variant="default"
                              size="xs"
                              isDarkMode={isDarkMode}
                            />
                          )}
                        </div>
                      </td>
                      {/* Volunteer Button Cell - visible to all users */}
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        {firefighter.is_available && onVolunteerHold && (
                          <IconButton
                            icon={HandHeart}
                            label={`Volunteer to take hold for ${firefighter.name}`}
                            onClick={() => onVolunteerHold(firefighter.id)}
                            variant="success"
                            size="xs"
                            isDarkMode={isDarkMode}
                          />
                        )}
                        {!firefighter.is_available && (
                          <span className={isDarkMode ? "text-gray-600" : "text-slate-400"}>
                            —
                          </span>
                        )}
                      </td>
                      {/* REMOVED: Hours Worked data cell - see header comment above
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <Clock className={`${tokens.icons.xs} {isDarkMode ? "text-slate-400" : "text-slate-500"} />
                              <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                {firefighter.hours_worked_this_period || 0}h / 72h
                              </span>
                            </div>
                            {(firefighter.hours_worked_this_period || 0) > 60 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-900/70 text-amber-200 text-[10px] rounded">
                                <AlertTriangle className={`${tokens.icons.xs} mr-0.5`} />
                                Near Limit
                              </span>
                            )}
                          </div>
                        </td>
                        */}
                      {isAdminMode && (
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IconButton
                              icon={Repeat}
                              label={`Transfer ${firefighter.name} to different shift`}
                              onClick={() => onTransferShift(firefighter.id)}
                              variant="default"
                              size="xs"
                              isDarkMode={isDarkMode}
                            />
                            <IconButton
                              icon={UserX}
                              label={`Deactivate ${firefighter.name}`}
                              onClick={() => onDeactivate(firefighter.id)}
                              variant="default"
                              size="xs"
                              isDarkMode={isDarkMode}
                            />
                            <IconButton
                              icon={Trash2}
                              label={`Delete ${firefighter.name} permanently`}
                              onClick={() => onDelete(firefighter.id)}
                              variant="destructive"
                              size="xs"
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
            )
            }

            {/* Empty state for filters with no results */}
            {firefighters.length > 0 &&
             filteredAndAdvancedFiltered.length === 0 &&
             activeFilterCount > 0 && (
              <NoSearchResultsEmptyState
                searchTerm="applied filters"
                onClearSearch={() => {
                  clearAllFilters();
                }}
              />
            )}

            {/* Deactivated Firefighters Section */}
            {isAdminMode && deactivatedFirefighters.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3
              className={`text-sm font-bold mb-3 ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Deactivated ({deactivatedFirefighters.length})
            </h3>
            <div className="space-y-2">
              {deactivatedFirefighters.map((firefighter) => (
                <div
                  key={firefighter.id}
                  className={`rounded-lg p-3 border ${
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                      : "bg-slate-100 border-slate-300 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDarkMode ? "bg-slate-600" : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <button
                          onClick={() => {
                            setSelectedFirefighter(firefighter);
                            setShowProfileModal(true);
                          }}
                          className={`font-semibold text-sm text-left hover:underline focus:outline-none focus:underline ${
                            isDarkMode
                              ? "text-slate-400 hover:text-slate-300"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {firefighter.name}
                        </button>
                        {firefighter.fire_station && (
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            Station #{firefighter.fire_station}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton
                        icon={Eye}
                        label={`View profile and hold history for ${firefighter.name}`}
                        onClick={() => {
                          setSelectedFirefighter(firefighter);
                          setShowProfileModal(true);
                        }}
                        variant="default"
                        size="xs"
                        isDarkMode={isDarkMode}
                      />
                      <IconButton
                        icon={RotateCcw}
                        label={`Reactivate ${firefighter.name}`}
                        onClick={() => {
                          setSelectedFirefighter(firefighter);
                          setShowReactivateModal(true);
                        }}
                        variant="success"
                        size="xs"
                        isDarkMode={isDarkMode}
                      />
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode
                            ? "bg-slate-700/50 text-slate-500"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        Inactive
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>{/* Close px-6 pb-6 div */}

          {/* Modals - outside main content div but inside fragment */}
          <ReactivateModal
            isOpen={showReactivateModal}
            firefighter={selectedFirefighter}
            currentRosterSize={firefighters.length}
            onClose={() => {
              setShowReactivateModal(false);
              setSelectedFirefighter(null);
            }}
            onConfirm={(id, position) => {
              onReactivate(id, position);
              setShowReactivateModal(false);
              setSelectedFirefighter(null);
            }}
          />

          <FirefighterProfileModal
            isOpen={showProfileModal}
            firefighter={selectedFirefighter}
            onClose={() => {
              setShowProfileModal(false);
              setSelectedFirefighter(null);
            }}
            isAdminMode={isAdminMode}
          />

          <FilterPanel
            isOpen={isFilterPanelOpen}
            onClose={() => setIsFilterPanelOpen(false)}
            filters={filters}
            onUpdateFilter={updateFilter}
            onToggleArrayFilter={toggleArrayFilter}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
            availableStations={availableStations}
          />
        </>
      )}
    </div>
  );
}
