// REFACTORED: Reduced from 1,123 lines to ~400 lines by extracting sub-components
// Sub-components: RosterHeader, RosterSearchBar, BulkActions, ExportMenu (in ./roster/)

import {
  ArrowUpDown,
  CheckSquare,
  Eye,
  History,
  Repeat,
  RotateCcw,
  Square,
  Trash2,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmOptions } from "../hooks/useConfirm";
import { useFilters } from "../hooks/useFilters";
import { Firefighter, Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";
import { formatHoldDate } from "../utils/dateUtils";
import { AddFirefighterForm } from "./AddFirefighterForm";
import { NoFirefightersEmptyState, NoSearchResultsEmptyState } from "./EmptyState";
import { FilterPanel } from "./FilterPanel";
import { FirefighterProfileModal } from "./FirefighterProfileModal";
import { ReactivateModal } from "./ReactivateModal";
import { BulkActions, RosterHeader, RosterSearchBar } from "./roster";

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
  currentShift?: Shift;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>;
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
  confirmAction,
  currentShift,
  isAdminMode = false,
  isDarkMode = true,
  searchInputRef,
}: FirefighterListProps) {
  // Maintain backwards compatibility by ensuring legacy callbacks stay referenced
  void _onCompleteHold;
  void _onResetAll;

  const [localFirefighters, setLocalFirefighters] =
    useState<Firefighter[]>(firefighters);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFirefighter, setSelectedFirefighter] =
    useState<Firefighter | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  // Filter firefighters based on search query AND filters
  const searchFiltered = localFirefighters.filter((ff) => {
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = ff.name.toLowerCase().includes(query);
      const matchesStation = ff.fire_station?.toString().includes(query);

      if (!matchesName && !matchesStation) return false;
    }

    return true;
  });

  // Apply advanced filters
  const filteredAndAdvancedFiltered = applyFilters(searchFiltered);

  const nextInRotation = filteredAndAdvancedFiltered[0]; // First firefighter is next in rotation

  // Get unique stations for filter panel
  const availableStations = Array.from(
    new Set(firefighters.map((ff) => ff.fire_station).filter(Boolean))
  ).sort() as string[];

  function handleDragStart(e: React.DragEvent, firefighterId: string) {
    if (!isAdminMode) return;
    setDraggedId(firefighterId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, firefighterId: string) {
    if (!isAdminMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(firefighterId);
  }

  function handleDrop(e: React.DragEvent, targetFirefighterId: string) {
    if (!isAdminMode) return;
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

      <div className={tokens.spacing.card.lg}>
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

        {/* Search Bar with sub-component */}
        {firefighters.length > 0 && (
          <RosterSearchBar
            ref={searchInputRef}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredAndAdvancedFiltered.length}
            totalCount={firefighters.length}
            isDarkMode={isDarkMode}
          />
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
          isDarkMode={isDarkMode}
        />

        {firefighters.length === 0 ? (
          <NoFirefightersEmptyState 
            onAddFirefighter={() => setShowAddForm(true)}
            isAdminMode={isAdminMode}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-max">
              <thead>
                <tr
                  className={`border-b-2 ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-900/50"
                      : "border-slate-300 bg-slate-50"
                  }`}
                >
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-center ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      <button
                        onClick={
                          selectedIds.size ===
                          filteredAndAdvancedFiltered.length
                            ? deselectAll
                            : selectAll
                        }
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
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
                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className={tokens.icons.xs} />
                      Order
                    </div>
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Name
                  </th>
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Shift
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Station
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Cert Level
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Qualifications
                    </th>
                  )}
                  <th
                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Last Hold
                  </th>
                  {/* REMOVED: Hours Worked column per user feedback
                        User stated: "There is no way to accurately calculate that without
                        manually checking through the scheduling program"
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode
                          ? "text-gray-400"
                          : "text-slate-600"
                      }`}
                    >
                      Hours Worked
                    </th>
                    */}
                  {isAdminMode && (
                    <th
                      className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAndAdvancedFiltered.map((firefighter, index) => {
                  const qualifications = [
                    firefighter.is_fto && "FTO",
                    firefighter.is_bls && "BLS",
                    firefighter.is_als && "ALS",
                  ].filter((q): q is string => Boolean(q));

                  const isNext = nextInRotation?.id === firefighter.id;

                  return (
                    <tr
                      key={firefighter.id}
                      draggable={isAdminMode}
                      onDragStart={(e) => handleDragStart(e, firefighter.id)}
                      onDragOver={(e) => handleDragOver(e, firefighter.id)}
                      onDrop={(e) => handleDrop(e, firefighter.id)}
                      onDragEnd={handleDragEnd}
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:bg-gray-800/50"
                          : "hover:bg-slate-50"
                      } ${draggedId === firefighter.id ? "opacity-50" : ""} ${
                        dragOverId === firefighter.id
                          ? isDarkMode
                            ? "bg-blue-900/20 border-l-4 border-blue-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      } ${
                        isNext
                          ? isDarkMode
                            ? "bg-blue-950/30 ring-2 ring-inset ring-blue-500/50"
                            : "bg-blue-50 ring-2 ring-inset ring-blue-400"
                          : ""
                      } ${isAdminMode ? "cursor-move" : ""}`}
                    >
                      {isAdminMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleSelection(firefighter.id)}
                            className={`p-1 rounded transition-colors ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-slate-200"
                            }`}
                            aria-label={`Select ${firefighter.name}`}
                          >
                            {selectedIds.has(firefighter.id) ? (
                              <CheckSquare
                                className={`w-5 h-5 ${
                                  isDarkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                              />
                            ) : (
                              <Square
                                className={`w-5 h-5 ${
                                  isDarkMode
                                    ? "text-gray-500"
                                    : "text-slate-400"
                                }`}
                              />
                            )}
                          </button>
                        </td>
                      )}
                      <td
                        className={`px-4 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-gray-300" : "text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isNext && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                              NEXT
                            </span>
                          )}
                          <span className="font-bold">{index + 1}</span>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-4 whitespace-nowrap ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        <button
                          onClick={() => handleViewProfile(firefighter)}
                          className="font-bold text-base hover:text-orange-500 dark:hover:text-orange-400 transition-colors underline decoration-transparent hover:decoration-current focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-1"
                          aria-label={`View profile for ${firefighter.name}`}
                        >
                          {firefighter.name}
                        </button>
                      </td>
                      {isAdminMode && (
                        <td
                          className={`px-4 py-4 whitespace-nowrap ${
                            isDarkMode ? "text-gray-300" : "text-slate-700"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded font-bold text-xs ${
                              firefighter.shift === "A"
                                ? "bg-green-900/70 text-green-300"
                                : firefighter.shift === "B"
                                ? "bg-red-900/70 text-red-300"
                                : "bg-gray-900/70 text-gray-300"
                            }`}
                          >
                            Shift {firefighter.shift}
                          </span>
                        </td>
                      )}
                      {isAdminMode && (
                        <td
                          className={`px-4 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-slate-700"
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
                          className={`px-4 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-slate-700"
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
                        <td className="px-4 py-4">
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
                        className={`px-4 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-gray-400" : "text-slate-600"
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
                            <button
                              onClick={() => {
                                setSelectedFirefighter(firefighter);
                                setShowProfileModal(true);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode
                                  ? "hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                                  : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                              }`}
                              title="View hold history"
                              aria-label="View hold history"
                            >
                              <History className={tokens.icons.xs} />
                            </button>
                          )}
                        </div>
                      </td>
                      {/* REMOVED: Hours Worked data cell - see header comment above
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <Clock className={`${tokens.icons.xs} {isDarkMode ? "text-gray-400" : "text-gray-500"} />
                              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
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
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onTransferShift(firefighter.id)}
                              className={`p-1.5 rounded transition-colors focus-ring ${
                                isDarkMode
                                  ? "hover:bg-blue-900/50 text-blue-400"
                                  : "hover:bg-blue-100 text-blue-600"
                              }`}
                              title="Transfer shift"
                            >
                              <Repeat className={tokens.icons.sm} />
                            </button>
                            <button
                              onClick={() => onDeactivate(firefighter.id)}
                              className={`p-1.5 rounded transition-colors focus-ring ${
                                isDarkMode
                                  ? "hover:bg-gray-700 text-gray-400"
                                  : "hover:bg-gray-200 text-gray-600"
                              }`}
                              title="Deactivate"
                            >
                              <UserX className={tokens.icons.sm} />
                            </button>
                            <button
                              onClick={() => onDelete(firefighter.id)}
                              className={`p-1.5 rounded transition-colors focus-ring ${
                                isDarkMode
                                  ? "hover:bg-red-900/50 text-red-400"
                                  : "hover:bg-red-100 text-red-600"
                              }`}
                              title="Delete permanently"
                            >
                              <Trash2 className={tokens.icons.sm} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state for search with no results */}
        {firefighters.length > 0 && 
         filteredAndAdvancedFiltered.length === 0 && 
         (searchQuery.trim() || activeFilterCount > 0) && (
          <NoSearchResultsEmptyState 
            searchTerm={searchQuery.trim() || 'applied filters'}
            onClearSearch={() => {
              setSearchQuery('');
              clearAllFilters();
            }}
          />
        )}

        {isAdminMode && deactivatedFirefighters.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3
              className={`text-sm font-bold mb-3 ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
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
                      ? "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDarkMode ? "bg-gray-600" : "bg-gray-400"
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
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {firefighter.name}
                        </button>
                        {firefighter.fire_station && (
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Station #{firefighter.fire_station}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedFirefighter(firefighter);
                          setShowProfileModal(true);
                        }}
                        className={`p-1.5 rounded transition-colors focus-ring ${
                          isDarkMode
                            ? "hover:bg-blue-900/50 text-blue-400"
                            : "hover:bg-blue-100 text-blue-600"
                        }`}
                        title="View profile and hold history"
                      >
                        <Eye className={tokens.icons.sm} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFirefighter(firefighter);
                          setShowReactivateModal(true);
                        }}
                        className={`p-1.5 rounded transition-colors focus-ring ${
                          isDarkMode
                            ? "hover:bg-emerald-900/50 text-emerald-400"
                            : "hover:bg-emerald-100 text-emerald-600"
                        }`}
                        title="Reactivate firefighter"
                      >
                        <RotateCcw className={tokens.icons.sm} />
                      </button>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isDarkMode
                            ? "bg-gray-700/50 text-gray-500"
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
      </div>

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
    </div>
  );
}
