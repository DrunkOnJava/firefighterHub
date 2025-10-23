/**
 * EXAMPLE USAGE OF CONFIRM DIALOG
 *
 * This file demonstrates how to replace native confirm() with the custom ConfirmDialog component.
 *
 * CURRENT IMPLEMENTATION (to be replaced):
 * ```typescript
 * if (!confirm('Delete this firefighter?')) return;
 * await deleteFirefighter(id);
 * ```
 *
 * NEW IMPLEMENTATION:
 */

import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export function ExampleComponent() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      // Perform the actual deletion
      await deleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  async function deleteItem(id: string) {
    // Your deletion logic here
    console.log('Deleting item:', id);
  }

  return (
    <div>
      <button onClick={() => handleDeleteClick('item-1')}>
        Delete Item
      </button>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Firefighter"
        message="Are you sure you want to remove this firefighter from the roster?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        consequences={[
          'Any scheduled holds will be cancelled',
          'This action cannot be undone',
          'All history will be permanently deleted'
        ]}
        isDarkMode={true}
      />
    </div>
  );
}

/**
 * PLACES TO UPDATE (native confirm() usage):
 *
 * 1. src/hooks/useFirefighters.ts:
 *    - deleteFirefighter() - line 270
 *    - resetAll() - line 293
 *    - masterReset() - lines 310, 312
 *    - deactivateFirefighter() - line 374
 *
 * 2. Future implementations:
 *    - Cancel hold confirmation
 *    - Transfer shift confirmation
 *    - Bulk delete confirmation
 */
