// TECHNICAL DEBT: This file is 400+ lines - should be split into smaller components
// Consider extracting: BulkActions, ExportMenu, SearchBar, FirefighterCard components

import { useState, useEffect } from "react";
import { Firefighter, Shift } from "../lib/supabase"; // FIXED: Added missing Shift import
import { AddFirefighterForm } from "./AddFirefighterForm";
import { ReactivateModal } from "./ReactivateModal";
import { FirefighterProfileModal } from "./FirefighterProfileModal";
import { FilterPanel } from "./FilterPanel";
import {
  Users,
  X,
  ArrowUpDown,
  Trash2,
  UserX,
  Repeat,
  RotateCcw,
  Eye,
  Search,
  CheckSquare,
  Square,
  Download,
  FileDown,
  Filter,
  UserPlus,
  History,
} from "lucide-react";
import { exportRosterToCSV, exportRosterToJSON } from "../utils/exportUtils";
import { useFilters } from "../hooks/useFilters";

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
}

export function FirefighterList({
  firefighters,
  deactivatedFirefighters = [],
  onAdd,
  onCompleteHold,
  onDelete,
  onDeactivate,
  onReactivate,
  onTransferShift,
  onResetAll,
  onReorder,
  isAdminMode = false,
  isDarkMode = true,
  searchInputRef,
}: FirefighterListProps) {
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

  function handleBulkDelete() {
    if (
      !confirm(
        `Delete ${selectedIds.size} selected firefighters?\n\nThis action cannot be undone.`
      )
    )
      return;

    selectedIds.forEach((id) => onDelete(id));
    deselectAll();
  }

  function handleBulkDeactivate() {
    if (!confirm(`Deactivate ${selectedIds.size} selected firefighters?`))
      return;

    selectedIds.forEach((id) => onDeactivate(id));
    deselectAll();
  }

  function handleExportCSV() {
    const filename = exportRosterToCSV(
      firefighters,
      firefighters[0]?.shift || "ALL"
    );
    setShowExportMenu(false);
    console.log(`Exported roster to ${filename}`);
  }

  function handleExportJSON() {
    const filename = exportRosterToJSON(
      firefighters,
      firefighters[0]?.shift || "ALL"
    );
    setShowExportMenu(false);
    console.log(`Exported roster to ${filename}`);
  }

  return (
    <div
      className={`border-2 rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700"
          : "bg-white border-slate-300"
      }`}
    >
      <div
        className={`border-b-2 p-6 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700"
            : "bg-gradient-to-r from-red-50 to-amber-50 border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl shadow-lg ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-500/30"
              }`}
            >
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h2
                id="roster-heading"
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Firefighter Roster
              </h2>
              <p
                className={`text-base ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Add and organize your team rotation
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add Button (Admin Mode) */}
            {isAdminMode && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                aria-label="Add team member"
                title="Add team member"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            )}

            {firefighters.length > 0 && (
              <>
                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterPanelOpen(true)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300"
                  }`}
                  aria-label="Filter roster"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Export Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300"
                    }`}
                    aria-label="Export roster data"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  {showExportMenu && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border-2 overflow-hidden z-10 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      <button
                        onClick={handleExportCSV}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          isDarkMode
                            ? "hover:bg-gray-700 text-white"
                            : "hover:bg-slate-50 text-slate-900"
                        }`}
                      >
                        <FileDown className="w-4 h-4" />
                        <span className="font-medium">Export as CSV</span>
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-t ${
                          isDarkMode
                            ? "hover:bg-gray-700 text-white border-gray-700"
                            : "hover:bg-slate-50 text-slate-900 border-slate-200"
                        }`}
                      >
                        <FileDown className="w-4 h-4" />
                        <span className="font-medium">Export as JSON</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Add Firefighter Form (Collapsible) */}
          {isAdminMode && showAddForm && (
            <div className="mb-6">
              <AddFirefighterForm
                onAdd={(name, station) => {
                  onAdd(name, station);
                  setShowAddForm(false);
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* Bulk Actions Toolbar */}
          {isAdminMode && selectedIds.size > 0 && (
            <div
              className={`mb-6 p-4 rounded-lg border-2 ${
                isDarkMode
                  ? "bg-blue-900/20 border-blue-700"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <CheckSquare
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={deselectAll}
                    className={`text-sm underline ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDeactivate}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isDarkMode
                        ? "bg-yellow-900/70 hover:bg-yellow-800 text-yellow-300"
                        : "bg-yellow-100 hover:bg-yellow-200 text-yellow-900"
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    Deactivate
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isDarkMode
                        ? "bg-red-900/70 hover:bg-red-800 text-red-300"
                        : "bg-red-100 hover:bg-red-200 text-red-900"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          {firefighters.length > 0 && (
            <div className="mb-6">
              <div className="relative max-w-xs">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-slate-400"
                  }`}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-2 rounded-lg border-2 transition-all focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                  aria-label="Search firefighters by name or station"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-600 transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {(searchQuery || activeFilterCount > 0) && (
                <p
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Showing {filteredAndAdvancedFiltered.length} of{" "}
                  {firefighters.length} firefighters
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="ml-2 text-blue-500 hover:text-blue-400 underline"
                    >
                      Clear filters
                    </button>
                  )}
                </p>
              )}
            </div>
          )}

          {firefighters.length === 0 ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center ${
                isDarkMode
                  ? "bg-gray-900/50 border-gray-700"
                  : "bg-slate-50 border-slate-300"
              }`}
            >
              <Users
                className={isDarkMode ? "text-gray-600" : "text-slate-400"}
                size={64}
              />
              <p
                className={`text-lg mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Your roster is empty
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-500" : "text-slate-500"
                }`}
              >
                Add your first team member to begin scheduling holds
              </p>
            </div>
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
                        <ArrowUpDown size={14} />
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
                        Apparatus
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
                    const apparatusList = [
                      {
                        name: "Ambulance",
                        enabled: firefighter.apparatus_ambulance,
                      },
                      {
                        name: "Brush Truck",
                        enabled: firefighter.apparatus_brush_truck,
                      },
                      { name: "Engine", enabled: firefighter.apparatus_engine },
                      { name: "Tanker", enabled: firefighter.apparatus_tanker },
                      { name: "Truck", enabled: firefighter.apparatus_truck },
                      { name: "Boat", enabled: firefighter.apparatus_boat },
                      { name: "UTV", enabled: firefighter.apparatus_utv },
                      {
                        name: "Rescue Squad",
                        enabled: firefighter.apparatus_rescue_squad,
                      },
                    ].filter((item) => item.enabled);

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
                                    isDarkMode
                                      ? "text-blue-400"
                                      : "text-blue-600"
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
                              className={`px-2 py-1 rounded font-bold text-xs ${
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
                                  isDarkMode
                                    ? "text-gray-600"
                                    : "text-slate-400"
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
                                  isDarkMode
                                    ? "text-gray-600"
                                    : "text-slate-400"
                                }
                              >
                                —
                              </span>
                            )}
                          </td>
                        )}
                        {isAdminMode && (
                          <td className="px-4 py-4">
                            {apparatusList.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {apparatusList.map((apparatus) => {
                                  let colorClass = "";
                                  switch (apparatus.name) {
                                    case "Ambulance":
                                      colorClass = isDarkMode
                                        ? "bg-red-900/80 text-white border border-red-700"
                                        : "bg-red-600 text-white";
                                      break;
                                    case "Engine":
                                      colorClass = isDarkMode
                                        ? "bg-orange-900/70 text-orange-300"
                                        : "bg-orange-600 text-white";
                                      break;
                                    case "Truck":
                                      colorClass = isDarkMode
                                        ? "bg-yellow-900/70 text-yellow-300"
                                        : "bg-yellow-600 text-white";
                                      break;
                                    case "Tanker":
                                      colorClass = isDarkMode
                                        ? "bg-blue-900/70 text-blue-300"
                                        : "bg-blue-600 text-white";
                                      break;
                                    case "Brush Truck":
                                      colorClass = isDarkMode
                                        ? "bg-green-900/70 text-green-300"
                                        : "bg-green-600 text-white";
                                      break;
                                    case "Boat":
                                      colorClass = isDarkMode
                                        ? "bg-cyan-900/70 text-cyan-300"
                                        : "bg-cyan-600 text-white";
                                      break;
                                    case "UTV":
                                      colorClass = isDarkMode
                                        ? "bg-amber-900/70 text-amber-300"
                                        : "bg-amber-600 text-white";
                                      break;
                                    case "Rescue Squad":
                                      colorClass = isDarkMode
                                        ? "bg-rose-900/70 text-rose-300"
                                        : "bg-rose-600 text-white";
                                      break;
                                    default:
                                      colorClass = isDarkMode
                                        ? "bg-gray-900/70 text-gray-300"
                                        : "bg-gray-600 text-white";
                                  }
                                  return (
                                    <span
                                      key={apparatus.name}
                                      className={`px-1.5 py-0.5 text-xs font-semibold rounded ${colorClass}`}
                                    >
                                      {apparatus.name}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span
                                className={
                                  isDarkMode
                                    ? "text-gray-600"
                                    : "text-slate-400"
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
                                  isDarkMode
                                    ? "text-gray-600"
                                    : "text-slate-400"
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
                                new Date(
                                  firefighter.last_hold_date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
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
                                <History size={14} />
                              </button>
                            )}
                          </div>
                        </td>
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
                                <Repeat size={16} />
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
                                <UserX size={16} />
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
                                <Trash2 size={16} />
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
                          <Eye size={16} />
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
                          <RotateCcw size={16} />
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
        isDarkMode={isDarkMode}
        availableStations={availableStations}
      />
    </div>
  );
}
