/**
 * MaterialM Pilot Component
 *
 * Demonstrates MaterialM/Flowbite design system compared to current design.
 * Toggle between old and new designs to see the difference.
 */

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Label,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { ShiftBadge } from "./ShiftBadge";
import { CalendarMaterialMPreview } from "./CalendarMaterialMPreview";

export function MaterialMPilot() {
  const [useMaterialM, setUseMaterialM] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* MaterialM Calendar Preview (Full Width) */}
      {useMaterialM && (
        <div className="fixed inset-4 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setUseMaterialM(false)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">MaterialM Calendar Preview</h2>
              <button
                onClick={() => setUseMaterialM(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close Preview
              </button>
            </div>
            <CalendarMaterialMPreview />
          </div>
        </div>
      )}

      {/* Pilot Control Panel */}
      <div className="fixed bottom-4 right-4 z-50 max-w-md">
        <Card className="bg-white dark:bg-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">MaterialM Preview</h3>
          <button
            onClick={() => setUseMaterialM(!useMaterialM)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Toggle: {useMaterialM ? "MaterialM" : "Current"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Shift Badges Comparison */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Shift Badges:
            </p>
            {useMaterialM ? (
              <div className="flex gap-2">
                <Badge color="success" size="sm">
                  ● A
                </Badge>
                <Badge color="failure" size="sm">
                  ■ B
                </Badge>
                <Badge color="info" size="sm">
                  ◆ C
                </Badge>
              </div>
            ) : (
              <div className="flex gap-2">
                <ShiftBadge shift="A" />
                <ShiftBadge shift="B" />
                <ShiftBadge shift="C" />
              </div>
            )}
          </div>

          {/* Button Comparison */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Primary Button:
            </p>
            {useMaterialM ? (
              <Button color="blue" size="md">
                Schedule Hold
              </Button>
            ) : (
              <button className="h-[42px] px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Schedule Hold
              </button>
            )}
          </div>

          {/* Card Preview */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Card Style:
            </p>
            {useMaterialM ? (
              <Card>
                <h5 className="text-base font-semibold">MaterialM Card</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rounded corners, subtle shadow, Flowbite design
                </p>
              </Card>
            ) : (
              <div className="bg-slate-700 rounded-lg p-4 shadow-md">
                <h5 className="text-base font-semibold text-slate-100">
                  Current Card
                </h5>
                <p className="text-sm text-slate-400">
                  Current dark slate design
                </p>
              </div>
            )}
          </div>

          {/* Form Input Comparison */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Form Input:
            </p>
            {useMaterialM ? (
              <div className="space-y-2">
                <Label htmlFor="name">Firefighter Name</Label>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter name..."
                  sizing="md"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-100">
                  Firefighter Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Button Variants */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Button Variants:
            </p>
            {useMaterialM ? (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" color="success">
                  Save
                </Button>
                <Button size="sm" color="failure">
                  Delete
                </Button>
                <Button size="sm" color="gray" outline>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
                  Save
                </button>
                <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
                  Delete
                </button>
                <button className="px-3 py-1.5 border border-slate-600 text-slate-100 hover:bg-slate-700 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Modal Demo Button */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Modal Dialog:
            </p>
            <Button size="sm" onClick={() => setShowModal(true)}>
              Show Modal Example
            </Button>
          </div>

          <div className="pt-2 border-t border-slate-600">
            <p className="text-xs text-gray-500">
              Live preview with {useMaterialM ? "Flowbite/MaterialM" : "current"} design. Click Toggle to compare.
            </p>
          </div>
        </div>
      </Card>

      {/* MaterialM Modal Example */}
      {useMaterialM && showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <ModalHeader>Schedule Hold</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                This is how modals look in MaterialM/Flowbite design.
              </p>
              <div>
                <Label htmlFor="firefighter">Select Firefighter</Label>
                <TextInput
                  id="firefighter"
                  type="text"
                  placeholder="Choose firefighter..."
                />
              </div>
              <div>
                <Label htmlFor="date">Hold Date</Label>
                <TextInput id="date" type="date" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setShowModal(false)}>Submit</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
      </div>
    </>
  );
}
