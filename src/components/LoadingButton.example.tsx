/**
 * LOADING BUTTON USAGE EXAMPLES
 *
 * This file demonstrates how to use LoadingButton with operation loading states.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoadingButton } from './LoadingButton';

/**
 * EXAMPLE 1: Basic usage with local loading state
 */
export function Example1() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      loadingText="Saving..."
      onClick={handleSave}
      variant="primary"
    >
      Save Changes
    </LoadingButton>
  );
}

/**
 * EXAMPLE 2: Using with useFirefighters hook
 */
export function Example2() {
  const { addFirefighter, isOperationLoading } = useFirefighters(showToast, 'A');

  return (
    <LoadingButton
      isLoading={isOperationLoading('add')}
      loadingText="Adding..."
      onClick={() => addFirefighter('John Doe', '1')}
      variant="success"
    >
      Add Firefighter
    </LoadingButton>
  );
}

/**
 * EXAMPLE 3: Delete button with operation-specific loading
 */
export function Example3({ id }: { id: string }) {
  const { deleteFirefighter, isOperationLoading } = useFirefighters(showToast, 'A');

  return (
    <LoadingButton
      isLoading={isOperationLoading('delete', id)}
      loadingText="Deleting..."
      onClick={() => deleteFirefighter(id)}
      variant="danger"
    >
      Delete
    </LoadingButton>
  );
}

/**
 * PLACES TO INTEGRATE:
 *
 * 1. AddFirefighterForm - Add button
 * 2. FirefighterList - Delete, Deactivate, Transfer buttons
 * 3. CompleteHoldModal - Complete button
 * 4. TransferShiftModal - Transfer button
 * 5. HelpModal - Reset buttons
 * 6. ReactivateModal - Reactivate button
 */

import { useState } from 'react';

// Dummy implementations for example code
function saveData() { return Promise.resolve(); }
function useFirefighters(_showToast: (msg: string, type: string) => void, _shift: string) {
  return {
    addFirefighter: () => {},
    deleteFirefighter: () => {},
    isOperationLoading: () => false
  };
}
function showToast(_msg: string, _type: string) {}
