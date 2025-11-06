// MATERIAL M3 VERSION: Orchestrates all M3 sub-components
// Based on FirefighterListLegacy but with MaterialM color system

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
import { tokens } from "../styles";
import { formatHoldDate } from "../utils/dateUtils";
import { AddFirefighterFormM3 } from "./AddFirefighterFormM3";
import { NoFirefightersEmptyState, NoSearchResultsEmptyState } from "./EmptyState";
import { FilterPanelM3 } from "./FilterPanelM3";
import { FirefighterProfileModalM3 } from "./FirefighterProfileModalM3";
import { ReactivateModalM3 } from "./ReactivateModalM3";
import { BulkActionsM3, RosterHeaderM3, RosterSearchBarM3 } from "./roster";

export interface FirefighterListM3Props {
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

// Type alias for backward compatibility
export type FirefighterListProps = FirefighterListM3Props;

export function FirefighterListM3({
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
}: FirefighterListM3Props) {
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
      className="
        bg-materialm-dark
        border-2
        border-materialm-border-dark
        rounded-xl
        shadow-2xl
        overflow-hidden
        h-full
        flex
        flex-col
      "
    >
      {/* Header with M3 sub-component */}
      <RosterHeaderM3
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

      <div className={`${tokens.spacing.card.lg} flex-shrink-0`}>
        {/* Add Firefighter Form (Collapsible) */}
        {isAdminMode && showAddForm && (
          <div className={tokens.spacing.margin.lg}>
            <AddFirefighterFormM3
              onAdd={(name, station) => {
                onAdd(name, station);
                setShowAddForm(false);
              }}
            />
          </div>
        )}

        {/* Search Bar with M3 sub-component */}
        {firefighters.length > 0 && (
          <RosterSearchBarM3
            ref={searchInputRef}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredAndAdvancedFiltered.length}
            totalCount={firefighters.length}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Bulk Actions with M3 sub-component */}
        <BulkActionsM3
          selectedCount={selectedIds.size}
          totalCount={filteredAndAdvancedFiltered.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkDeactivate={handleBulkDeactivate}
          isAdminMode={isAdminMode}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {firefighters.length === 0 ? (
          <div className={tokens.spacing.card.lg}>
            <NoFirefightersEmptyState
              onAddFirefighter={() => setShowAddForm(true)}
              isAdminMode={isAdminMode}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr
                  className="border-b-2 border-materialm-border-dark bg-materialm-darkgray"
                >
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-center text-materialm-text"
                    >
                      <button
                        onClick={
                          selectedIds.size ===
                          filteredAndAdvancedFiltered.length
                            ? deselectAll
                            : selectAll
                        }
                        className="p-1 hover:bg-materialm-dark rounded transition-colors"
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
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className={tokens.icons.xs} />
                      Order
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                  >
                    Name
                  </th>
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                    >
                      Shift
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                    >
                      Station
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                    >
                      Cert Level
                    </th>
                  )}
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                    >
                      Qualifications
                    </th>
                  )}
                  <th
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-materialm-text"
                  >
                    Last Hold
                  </th>
                  {isAdminMode && (
                    <th
                      className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-materialm-text"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-materialm-border-dark">
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
                      className={`transition-colors hover:bg-materialm-darkgray/50 ${draggedId === firefighter.id ? "opacity-50" : ""} ${
                        dragOverId === firefighter.id
                          ? "bg-materialm-primary/20 border-l-4 border-materialm-primary"
                          : ""
                      } ${
                        isNext
                          ? "bg-materialm-primary/30 ring-2 ring-inset ring-materialm-primary/50"
                          : ""
                      } ${isAdminMode ? "cursor-move" : ""}`}
                    >
                      {isAdminMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleSelection(firefighter.id)}
                            className="p-1 rounded transition-colors hover:bg-materialm-darkgray"
                            aria-label={`Select ${firefighter.name}`}
                          >
                            {selectedIds.has(firefighter.id) ? (
                              <CheckSquare
                                className="w-5 h-5 text-materialm-primary"
                              />
                            ) : (
                              <Square
                                className="w-5 h-5 text-materialm-text-disabled"
                              />
                            )}
                          </button>
                        </td>
                      )}
                      <td
                        className="px-4 py-4 whitespace-nowrap text-sm text-materialm-text"
                      >
                        <div className="flex items-center gap-2">
                          {isNext && (
                            <span className="px-2 py-1 bg-materialm-primary text-white text-xs font-bold rounded">
                              NEXT
                            </span>
                          )}
                          <span className="font-bold">{index + 1}</span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-white"
                      >
                        <button
                          onClick={() => handleViewProfile(firefighter)}
                          className="font-bold text-base hover:text-orange-500 dark:hover:text-orange-400 transition-colors underline decoration-transparent hover:decoration-current focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-materialm-dark rounded px-1"
                          aria-label={`View profile for ${firefighter.name}`}
                        >
                          {firefighter.name}
                        </button>
                      </td>
                      {isAdminMode && (
                        <td
                          className="px-4 py-4 whitespace-nowrap text-materialm-text"
                        >
                          <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded font-bold text-xs ${
                              firefighter.shift === "A"
                                ? "bg-materialm-success/70 text-materialm-success"
                                : firefighter.shift === "B"
                                ? "bg-materialm-error/70 text-materialm-error"
                                : "bg-materialm-dark/70 text-materialm-text"
                            }`}
                          >
                            Shift {firefighter.shift}
                          </span>
                        </td>
                      )}
                      {isAdminMode && (
                        <td
                          className="px-4 py-4 whitespace-nowrap text-sm text-materialm-text"
                        >
                          {firefighter.fire_station ? (
                            <span className="font-semibold">
                              Station #{firefighter.fire_station}
                            </span>
                          ) : (
                            <span
                              className="text-materialm-text-disabled"
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}
                      {isAdminMode && (
                        <td
                          className="px-4 py-4 whitespace-nowrap text-sm text-materialm-text"
                        >
                          {firefighter.certification_level ? (
                            <span
                              className="px-2 py-1 text-xs font-bold rounded bg-materialm-warning/70 text-materialm-warning"
                            >
                              {firefighter.certification_level}
                            </span>
                          ) : (
                            <span
                              className="text-materialm-text-disabled"
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
                                  className="px-1.5 py-0.5 bg-materialm-info/70 text-materialm-info text-xs font-semibold rounded"
                                >
                                  {qual}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              className="text-materialm-text-disabled"
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}
                      <td
                        className="px-4 py-4 whitespace-nowrap text-sm text-materialm-text-secondary"
                      >
                        <div className="flex items-center gap-2">
                          <span>
                            {firefighter.last_hold_date ? (
                              formatHoldDate(firefighter.last_hold_date)
                            ) : (
                              <span
                                className="text-materialm-text-disabled"
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
                              className="p-1 rounded transition-colors hover:bg-materialm-darkgray text-materialm-text-disabled hover:text-materialm-text"
                              title="View hold history"
                              aria-label="View hold history"
                            >
                              <History className={tokens.icons.xs} />
                            </button>
                          )}
                        </div>
                      </td>
                      {isAdminMode && (
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onTransferShift(firefighter.id)}
                              className="p-1.5 rounded transition-colors focus-ring hover:bg-materialm-primary/20 text-materialm-primary"
                              title="Transfer shift"
                            >
                              <Repeat className={tokens.icons.sm} />
                            </button>
                            <button
                              onClick={() => onDeactivate(firefighter.id)}
                              className="p-1.5 rounded transition-colors focus-ring hover:bg-materialm-darkgray text-materialm-text-secondary"
                              title="Deactivate"
                            >
                              <UserX className={tokens.icons.sm} />
                            </button>
                            <button
                              onClick={() => onDelete(firefighter.id)}
                              className="p-1.5 rounded transition-colors focus-ring hover:bg-materialm-error/20 text-materialm-error"
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

            {/* Empty state for search with no results */}
            {filteredAndAdvancedFiltered.length === 0 &&
             (searchQuery.trim() || activeFilterCount > 0) && (
              <div className={tokens.spacing.card.lg}>
                <NoSearchResultsEmptyState
                  searchTerm={searchQuery.trim() || 'applied filters'}
                  onClearSearch={() => {
                    setSearchQuery('');
                    clearAllFilters();
                  }}
                />
              </div>
            )}

            {isAdminMode && deactivatedFirefighters.length > 0 && (
              <div className={`mt-6 pt-6 border-t border-materialm-border-dark ${tokens.spacing.card.lg}`}>
                <h3
                  className="text-sm font-bold mb-3 text-materialm-text-secondary"
                >
                  Deactivated ({deactivatedFirefighters.length})
                </h3>
                <div className="space-y-2">
                  {deactivatedFirefighters.map((firefighter) => (
                    <div
                      key={firefighter.id}
                      className="rounded-lg p-3 border bg-materialm-darkgray/40 border-materialm-border-dark/50 hover:bg-materialm-darkgray/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-2 h-2 rounded-full bg-materialm-text-disabled"
                          />
                          <div className="flex-1">
                            <button
                              onClick={() => {
                                setSelectedFirefighter(firefighter);
                                setShowProfileModal(true);
                              }}
                              className="font-semibold text-sm text-left hover:underline focus:outline-none focus:underline text-materialm-text-secondary hover:text-materialm-text"
                            >
                              {firefighter.name}
                            </button>
                            {firefighter.fire_station && (
                              <p
                                className="text-xs text-materialm-text-disabled"
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
                            className="p-1.5 rounded transition-colors focus-ring hover:bg-materialm-primary/20 text-materialm-primary"
                            title="View profile and hold history"
                          >
                            <Eye className={tokens.icons.sm} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFirefighter(firefighter);
                              setShowReactivateModal(true);
                            }}
                            className="p-1.5 rounded transition-colors focus-ring hover:bg-materialm-success/20 text-materialm-success"
                            title="Reactivate firefighter"
                          >
                            <RotateCcw className={tokens.icons.sm} />
                          </button>
                          <span
                            className="text-xs px-2 py-1 rounded bg-materialm-darkgray/50 text-materialm-text-disabled"
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
        )}
      </div>

      <ReactivateModalM3
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

      <FirefighterProfileModalM3
        isOpen={showProfileModal}
        firefighter={selectedFirefighter}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedFirefighter(null);
        }}
        isAdminMode={isAdminMode}
      />

      <FilterPanelM3
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
