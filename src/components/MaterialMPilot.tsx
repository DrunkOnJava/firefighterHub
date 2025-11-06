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
import { colorsM3 } from "../styles";
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
                style={{ backgroundColor: colorsM3.primary.primary }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
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
        <Card className="p-6 shadow-2xl" style={{ backgroundColor: colorsM3.surface.container }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colorsM3.neutral.onSurface }}>MaterialM Preview</h3>
          <button
            onClick={() => setUseMaterialM(!useMaterialM)}
            style={{ backgroundColor: colorsM3.primary.primary }}
            className="px-3 py-1 text-white rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            Toggle: {useMaterialM ? "MaterialM" : "Current"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Shift Badges Comparison */}
          <div>
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
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
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
              Primary Button:
            </p>
            {useMaterialM ? (
              <Button color="blue" size="md">
                Schedule Hold
              </Button>
            ) : (
              <button style={{ backgroundColor: colorsM3.primary.primary }} className="h-[42px] px-5 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity">
                Schedule Hold
              </button>
            )}
          </div>

          {/* Card Preview */}
          <div>
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
              Card Style:
            </p>
            {useMaterialM ? (
              <Card>
                <h5 className="text-base font-semibold">MaterialM Card</h5>
                <p className="text-sm" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
                  Rounded corners, subtle shadow, Flowbite design
                </p>
              </Card>
            ) : (
              <div style={{ backgroundColor: colorsM3.surface.containerHigh }} className="rounded-lg p-4 shadow-md">
                <h5 className="text-base font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
                  Current Card
                </h5>
                <p className="text-sm" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
                  Current M3 design
                </p>
              </div>
            )}
          </div>

          {/* Form Input Comparison */}
          <div>
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
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
                <label className="text-sm font-semibold" style={{ color: colorsM3.neutral.onSurface }}>
                  Firefighter Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  style={{
                    backgroundColor: colorsM3.surface.containerLow,
                    borderColor: colorsM3.neutral.outline,
                    color: colorsM3.neutral.onSurface
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Button Variants */}
          <div>
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
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
                <button style={{ backgroundColor: colorsM3.success.success }} className="px-3 py-1.5 hover:opacity-90 text-white rounded-lg text-sm transition-opacity">
                  Save
                </button>
                <button style={{ backgroundColor: colorsM3.error.error }} className="px-3 py-1.5 hover:opacity-90 text-white rounded-lg text-sm transition-opacity">
                  Delete
                </button>
                <button style={{ borderColor: colorsM3.neutral.outline, color: colorsM3.neutral.onSurface }} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-white/8 transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Modal Demo Button */}
          <div>
            <p className="text-sm mb-2" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
              Modal Dialog:
            </p>
            <Button size="sm" onClick={() => setShowModal(true)}>
              Show Modal Example
            </Button>
          </div>

          <div className="pt-2" style={{ borderTopColor: colorsM3.neutral.outline }} className="pt-2 border-t">
            <p className="text-xs" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
              Live preview with {useMaterialM ? "Flowbite/MaterialM" : "MaterialM"} design. Click Toggle to compare.
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
              <p className="text-sm" style={{ color: colorsM3.neutral.onSurfaceVariant }}>
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
