import { useEffect, useState } from "react";
import { Firefighter, Shift } from "@/lib/supabase";
import { ConfirmOptions } from "@/hooks/useConfirm";
import { useDevice } from "@/hooks/useDevice";
import { useFilters } from "@/features/roster/hooks/useFilters";
// Card wrapper removed - handled by parent component
import { AddFirefighterForm } from "./AddFirefighterForm";
import { NoFirefightersEmptyState, NoSearchResultsEmptyState } from '@/components/EmptyState';
import { FilterPanel } from "@/components/layout/FilterPanel";
import { FirefighterProfileModal } from "./FirefighterProfileModal";
import { FirefighterCard } from '@/components/mobile/FirefighterCard';
import { ReactivateModal } from "./ReactivateModal";
import { FirefighterListSkeleton } from '@/components/SkeletonLoader';
import { FirefighterGrid } from '@/components/tablet/FirefighterGrid';
import { BulkActions } from "./roster";
import { RosterTable } from "./roster/table";
import { DeactivatedFirefightersList } from "./roster/DeactivatedFirefightersList";

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
  searchInputRef?: React.RefObject<HTMLInputElement>;
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>;
  isLoading?: boolean;
}

export function FirefighterList({
  firefighters,
  deactivatedFirefighters = [],
  onAdd,
  onCompleteHold: _onCompleteHold,
  onDelete,
  onDeactivate,
  onReactivate,
  onTransferShift,
  onResetAll: _onResetAll,
  onReorder,
  onVolunteerHold,
  confirmAction,
  // currentShift, // Unused - shift filtering handled by parent
  isAdminMode = false,
  searchInputRef: _searchInputRef,
  isLoading = false,
}: FirefighterListProps) {
  // Maintain backwards compatibility
  void _onCompleteHold;
  void _onResetAll;
  void _searchInputRef;

  const device = useDevice();
  const [localFirefighters, setLocalFirefighters] = useState<Firefighter[]>(firefighters || []);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedFirefighter, setSelectedFirefighter] = useState<Firefighter | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  // const [showExportMenu, setShowExportMenu] = useState(false); // Export feature temporarily disabled

  const {
    filters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    activeFilterCount,
  } = useFilters();

  // Sync local state with prop changes
  useEffect(() => {
    if (firefighters) {
      setLocalFirefighters(firefighters);
    }
  }, [firefighters]);

  // Get next in rotation
  const nextInRotation = (localFirefighters || [])
    .filter((ff) => ff.is_available)
    .sort((a, b) => a.order_position - b.order_position)[0] || null;

  // Apply filters
  const filteredAndAdvancedFiltered = (localFirefighters || []).filter((ff) => {
    // Station filter
    if (filters.stations.length > 0 && ff.fire_station && !filters.stations.includes(ff.fire_station)) {
      return false;
    }
    // Availability filter
    if (filters.availability !== "all") {
      if (filters.availability === "available" && !ff.is_available) return false;
      if (filters.availability === "unavailable" && ff.is_available) return false;
    }
    // Cert level filter (using certifications field from filters)
    if (filters.certifications.length > 0 && ff.certification_level && !filters.certifications.includes(ff.certification_level)) {
      return false;
    }
    // Qualifications filter
    if (filters.qualifications.includes("FTO") && !ff.is_fto) return false;
    if (filters.qualifications.includes("BLS") && !ff.is_bls) return false;
    if (filters.qualifications.includes("ALS") && !ff.is_als) return false;

    return true;
  });

  // Get available stations
  const availableStations = Array.from(
    new Set(
      (firefighters || [])
        .map((ff) => ff.fire_station)
        .filter((station): station is string => Boolean(station))
    )
  ).sort();

  // Drag handlers
  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDragOverId(id);
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!draggedId || draggedId === targetId || !localFirefighters) return;

    const draggedIndex = localFirefighters.findIndex((ff) => ff.id === draggedId);
    const targetIndex = localFirefighters.findIndex((ff) => ff.id === targetId);

    const newOrder = [...localFirefighters];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    const reordered = newOrder.map((ff, index) => ({
      ...ff,
      order_position: index,
    }));

    setLocalFirefighters(reordered);
    onReorder(reordered);
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  // Selection handlers
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

  // Bulk action handlers
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
      : confirm(`Delete ${selectedIds.size} selected firefighters?\n\nThis action cannot be undone.`);

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

  function handleViewProfile(firefighter: Firefighter) {
    setSelectedFirefighter(firefighter);
    setShowProfileModal(true);
  }

  function handleReactivateClick(firefighter: Firefighter) {
    setSelectedFirefighter(firefighter);
    setShowReactivateModal(true);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {isLoading ? (
        <FirefighterListSkeleton />
      ) : (
        <>
          {/* Content - table auto-fits to container */}
          <div className="p-0 flex-1 overflow-hidden min-h-0">
            {/* Add Firefighter Form */}
            {isAdminMode && showAddForm && (
              <div className="px-6 my-6">
                <AddFirefighterForm
                  onAdd={(name, station) => {
                    onAdd(name, station);
                    setShowAddForm(false);
                  }}
                />
              </div>
            )}

            {/* Bulk Actions */}
            <div className="px-6">
              <BulkActions
                selectedCount={selectedIds.size}
                totalCount={filteredAndAdvancedFiltered.length}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onBulkDelete={handleBulkDelete}
                onBulkDeactivate={handleBulkDeactivate}
                isAdminMode={isAdminMode}
              />
            </div>

            {/* Main Content - auto-fit table to container height */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {!firefighters || firefighters.length === 0 ? (
                <div className="px-6">
                  <NoFirefightersEmptyState
                    onAddFirefighter={() => setShowAddForm(true)}
                    isAdminMode={isAdminMode}
                  />
                </div>
              ) : filteredAndAdvancedFiltered.length === 0 ? (
                <div className="px-6">
                  <NoSearchResultsEmptyState
                    searchTerm="your filters"
                    onClearSearch={clearAllFilters}
                  />
                </div>
              ) : device.isMobile ? (
                /* Mobile View: Card Layout */
                <div className="flex flex-col gap-3 px-6">
                  {filteredAndAdvancedFiltered.map((firefighter) => (
                    <FirefighterCard
                      key={firefighter.id}
                      firefighter={firefighter}
                      onCompleteHold={onDelete}
                      onTransferShift={onTransferShift}
                      onDeactivate={onDeactivate}
                      onSelect={handleViewProfile}
                      isAdminMode={isAdminMode}
                      isNextInRotation={nextInRotation?.id === firefighter.id}
                    />
                  ))}
                </div>
              ) : device.isTablet ? (
                /* Tablet View: 2-Column Grid */
                <div className="px-6">
                  <FirefighterGrid
                    firefighters={filteredAndAdvancedFiltered}
                    onCompleteHold={onDelete}
                    onTransferShift={onTransferShift}
                    onDeactivate={onDeactivate}
                    onSelect={handleViewProfile}
                    isAdminMode={isAdminMode}
                    columns={2}
                  />
                </div>
              ) : (
                /* Desktop View: Table with aggressive auto-fit (no scrolling) */
                <div
                  className="h-full overflow-hidden"
                  style={{
                    // Dynamic row height based on available space
                    // Container height / (rows + header) with min/max bounds
                    '--row-height': `max(24px, calc((100% - 40px) / ${filteredAndAdvancedFiltered.length}))`,
                    fontSize: filteredAndAdvancedFiltered.length > 15
                      ? '0.7rem'
                      : filteredAndAdvancedFiltered.length > 10
                        ? '0.75rem'
                        : '0.875rem'
                  } as React.CSSProperties}
                >
                  <RosterTable
                    firefighters={filteredAndAdvancedFiltered}
                    isAdminMode={isAdminMode}
                    selectedIds={selectedIds}
                    nextInRotation={nextInRotation}
                    draggedId={draggedId}
                    dragOverId={dragOverId}
                    onToggleSelection={toggleSelection}
                    onSelectAll={selectAll}
                    onDeselectAll={deselectAll}
                    onViewProfile={handleViewProfile}
                    onVolunteerHold={onVolunteerHold}
                    onCompleteHold={onDelete}
                    onTransferShift={onTransferShift}
                    onDeactivate={onDeactivate}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              )}

              {/* Deactivated Firefighters Section */}
              {isAdminMode && deactivatedFirefighters.length > 0 && (
                <div className="px-6 mt-8 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                    Deactivated Firefighters ({deactivatedFirefighters.length})
                  </h3>
                  <DeactivatedFirefightersList
                    firefighters={deactivatedFirefighters}
                    onViewProfile={handleViewProfile}
                    onReactivate={handleReactivateClick}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
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
