/**
 * Component Showcase
 *
 * Interactive showcase of all MaterialM components.
 * Visit: http://localhost:5173/showcase
 *
 * This page demonstrates all MaterialM wrapper components with various
 * configurations, props, and states. Useful for:
 * - Viewing component API and behavior
 * - Testing components in isolation
 * - Reference for implementing features
 * - Visual regression testing
 */

import { useState } from 'react';
import { ButtonM3, IconButtonM3, ButtonGroupM3 } from '../components/m3/ButtonM3';
import { CardM3, CompactCardM3, MetricCardM3 } from '../components/m3/CardM3';
import {
  DialogM3,
  ConfirmDialogM3,
  AlertDialogM3,
  FullScreenDialogM3,
} from '../components/m3/DialogM3';
import {
  InputM3,
  TextareaM3,
  SelectM3,
  CheckboxM3,
  FormGroupM3,
  InlineFormM3,
} from '../components/m3/InputM3';
import {
  BadgeM3,
  StatusBadgeM3,
  CountBadgeM3,
  ShiftBadgeM3,
  BadgeGroupM3,
  AvatarBadgeM3,
} from '../components/m3/BadgeM3';

export function ComponentShowcase() {
  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shift: 'A',
    bio: '',
    notifications: false,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            MaterialM Component Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Interactive showcase of all MaterialM wrapper components
          </p>
        </div>

        {/* Buttons */}
        <Section title="Buttons" description="All button variants and sizes">
          <div className="space-y-6">
            {/* Variants */}
            <Subsection title="Variants">
              <div className="flex flex-wrap gap-4">
                <ButtonM3 variant="filled">Filled</ButtonM3>
                <ButtonM3 variant="outlined">Outlined</ButtonM3>
                <ButtonM3 variant="text">Text</ButtonM3>
                <ButtonM3 variant="elevated">Elevated</ButtonM3>
                <ButtonM3 variant="tonal">Tonal</ButtonM3>
              </div>
            </Subsection>

            {/* Colors */}
            <Subsection title="Colors">
              <div className="flex flex-wrap gap-4">
                <ButtonM3 color="primary">Primary</ButtonM3>
                <ButtonM3 color="secondary">Secondary</ButtonM3>
                <ButtonM3 color="success">Success</ButtonM3>
                <ButtonM3 color="error">Error</ButtonM3>
                <ButtonM3 color="warning">Warning</ButtonM3>
                <ButtonM3 color="info">Info</ButtonM3>
                <ButtonM3 color="neutral">Neutral</ButtonM3>
              </div>
            </Subsection>

            {/* Sizes */}
            <Subsection title="Sizes">
              <div className="flex flex-wrap items-center gap-4">
                <ButtonM3 size="xs">Extra Small</ButtonM3>
                <ButtonM3 size="sm">Small</ButtonM3>
                <ButtonM3 size="md">Medium</ButtonM3>
                <ButtonM3 size="lg">Large</ButtonM3>
                <ButtonM3 size="xl">Extra Large</ButtonM3>
              </div>
            </Subsection>

            {/* States */}
            <Subsection title="States">
              <div className="flex flex-wrap gap-4">
                <ButtonM3 loading>Loading</ButtonM3>
                <ButtonM3 disabled>Disabled</ButtonM3>
                <ButtonM3 fullWidth>Full Width</ButtonM3>
              </div>
            </Subsection>

            {/* With Icons */}
            <Subsection title="With Icons">
              <div className="flex flex-wrap gap-4">
                <ButtonM3 startIcon={<span>📥</span>}>Download</ButtonM3>
                <ButtonM3 endIcon={<span>→</span>}>Next</ButtonM3>
                <IconButtonM3 aria-label="Delete">🗑️</IconButtonM3>
              </div>
            </Subsection>

            {/* Button Group */}
            <Subsection title="Button Group">
              <ButtonGroupM3>
                <ButtonM3 size="sm">Left</ButtonM3>
                <ButtonM3 size="sm">Middle</ButtonM3>
                <ButtonM3 size="sm">Right</ButtonM3>
              </ButtonGroupM3>
            </Subsection>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards" description="Card variants and layouts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Elevated Card */}
            <CardM3 elevation={2}>
              <CardM3.Header>
                <h3 className="text-lg font-semibold">Elevated Card</h3>
              </CardM3.Header>
              <CardM3.Body>
                <p className="text-gray-600 dark:text-gray-400">
                  Card with elevation shadow for depth.
                </p>
              </CardM3.Body>
              <CardM3.Footer>
                <ButtonM3 size="sm">Action</ButtonM3>
              </CardM3.Footer>
            </CardM3>

            {/* Outlined Card */}
            <CardM3 variant="outlined">
              <CardM3.Header>
                <h3 className="text-lg font-semibold">Outlined Card</h3>
              </CardM3.Header>
              <CardM3.Body>
                <p className="text-gray-600 dark:text-gray-400">
                  Card with border instead of shadow.
                </p>
              </CardM3.Body>
            </CardM3>

            {/* Interactive Card */}
            <CardM3 interactive onClick={() => setShowDialog(true)}>
              <CardM3.Header>
                <h3 className="text-lg font-semibold">Interactive Card</h3>
              </CardM3.Header>
              <CardM3.Body>
                <p className="text-gray-600 dark:text-gray-400">
                  Click me to open a dialog!
                </p>
              </CardM3.Body>
            </CardM3>

            {/* Compact Card */}
            <CompactCardM3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Compact Card</p>
            </CompactCardM3>

            {/* Metric Cards */}
            <MetricCardM3
              title="Active Firefighters"
              value="24"
              subtitle="Currently available"
              trend={{ value: 5, direction: 'up' }}
              icon={<span className="text-2xl">👨‍🚒</span>}
            />

            <MetricCardM3
              title="Scheduled Holds"
              value="8"
              subtitle="This month"
              trend={{ value: 2, direction: 'down' }}
              icon={<span className="text-2xl">📅</span>}
            />
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges" description="Labels, statuses, and counts">
          <div className="space-y-6">
            {/* Basic Badges */}
            <Subsection title="Basic">
              <div className="flex flex-wrap gap-3">
                <BadgeM3 color="primary">Primary</BadgeM3>
                <BadgeM3 color="secondary">Secondary</BadgeM3>
                <BadgeM3 color="success">Success</BadgeM3>
                <BadgeM3 color="error">Error</BadgeM3>
                <BadgeM3 color="warning">Warning</BadgeM3>
                <BadgeM3 color="info">Info</BadgeM3>
              </div>
            </Subsection>

            {/* Variants */}
            <Subsection title="Variants">
              <div className="flex flex-wrap gap-3">
                <BadgeM3 variant="filled">Filled</BadgeM3>
                <BadgeM3 variant="outlined">Outlined</BadgeM3>
                <BadgeM3 variant="tonal">Tonal</BadgeM3>
              </div>
            </Subsection>

            {/* Status Badges */}
            <Subsection title="Status">
              <div className="flex flex-wrap gap-3">
                <StatusBadgeM3 status="active">Active</StatusBadgeM3>
                <StatusBadgeM3 status="inactive">Inactive</StatusBadgeM3>
                <StatusBadgeM3 status="pending">Pending</StatusBadgeM3>
                <StatusBadgeM3 status="error">Error</StatusBadgeM3>
                <StatusBadgeM3 status="success">Success</StatusBadgeM3>
              </div>
            </Subsection>

            {/* Shift Badges */}
            <Subsection title="Shift Badges">
              <div className="flex flex-wrap gap-3">
                <ShiftBadgeM3 shift="A" />
                <ShiftBadgeM3 shift="B" />
                <ShiftBadgeM3 shift="C" />
              </div>
            </Subsection>

            {/* Count Badges */}
            <Subsection title="Counts">
              <div className="flex flex-wrap items-center gap-3">
                <CountBadgeM3 count={5} />
                <CountBadgeM3 count={42} />
                <CountBadgeM3 count={99} />
                <CountBadgeM3 count={150} max={99} />
              </div>
            </Subsection>

            {/* Dismissible */}
            <Subsection title="Dismissible">
              <div className="flex flex-wrap gap-3">
                <BadgeM3 color="primary" onDismiss={() => alert('Dismissed!')}>
                  Dismissible
                </BadgeM3>
              </div>
            </Subsection>

            {/* Badge Group */}
            <Subsection title="Badge Group">
              <BadgeGroupM3>
                <BadgeM3 color="primary">React</BadgeM3>
                <BadgeM3 color="secondary">TypeScript</BadgeM3>
                <BadgeM3 color="success">Vite</BadgeM3>
                <BadgeM3 color="info">Tailwind</BadgeM3>
              </BadgeGroupM3>
            </Subsection>

            {/* Avatar Badge */}
            <Subsection title="Avatar Badge">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500 rounded-full" />
                  <AvatarBadgeM3 status="active" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-500 rounded-full" />
                  <AvatarBadgeM3 status="busy" />
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-400 rounded-full" />
                  <AvatarBadgeM3 status="inactive" />
                </div>
              </div>
            </Subsection>
          </div>
        </Section>

        {/* Form Inputs */}
        <Section title="Form Inputs" description="All input types and validation states">
          <div className="max-w-2xl space-y-6">
            <FormGroupM3
              title="User Information"
              description="Complete your profile information"
            >
              <InputM3
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <InputM3
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                helperText="We'll never share your email"
                startIcon={<span>📧</span>}
              />

              <InputM3
                label="With Error"
                error="This field is required"
                placeholder="Test error state"
              />

              <SelectM3
                label="Shift"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                options={[
                  { value: 'A', label: 'Shift A' },
                  { value: 'B', label: 'Shift B' },
                  { value: 'C', label: 'Shift C' },
                ]}
              />

              <TextareaM3
                label="Bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />

              <CheckboxM3
                label="Enable notifications"
                checked={formData.notifications}
                onChange={(e) =>
                  setFormData({ ...formData, notifications: e.target.checked })
                }
              />
            </FormGroupM3>

            <InlineFormM3>
              <InputM3 label="Search" placeholder="Search..." />
              <ButtonM3>Search</ButtonM3>
            </InlineFormM3>
          </div>
        </Section>

        {/* Dialogs */}
        <Section title="Dialogs" description="Modals and overlays">
          <div className="flex flex-wrap gap-4">
            <ButtonM3 onClick={() => setShowDialog(true)}>
              Show Dialog
            </ButtonM3>
            <ButtonM3 onClick={() => setShowConfirm(true)}>
              Show Confirm Dialog
            </ButtonM3>
            <ButtonM3 onClick={() => setShowAlert(true)}>
              Show Alert Dialog
            </ButtonM3>
            <ButtonM3 onClick={() => setShowFullScreen(true)}>
              Show Full Screen Dialog
            </ButtonM3>
          </div>
        </Section>
      </div>

      {/* Dialog Examples */}
      <DialogM3
        show={showDialog}
        onClose={() => setShowDialog(false)}
        title="Example Dialog"
        size="md"
      >
        <DialogM3.Body>
          <p className="text-gray-700 dark:text-gray-400">
            This is an example dialog with MaterialM styling.
          </p>
        </DialogM3.Body>
        <DialogM3.Footer>
          <ButtonM3 variant="outlined" onClick={() => setShowDialog(false)}>
            Cancel
          </ButtonM3>
          <ButtonM3 onClick={() => setShowDialog(false)}>Confirm</ButtonM3>
        </DialogM3.Footer>
      </DialogM3>

      <ConfirmDialogM3
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => alert('Confirmed!')}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        confirmColor="error"
      />

      <AlertDialogM3
        show={showAlert}
        onClose={() => setShowAlert(false)}
        title="Information"
        message="This is an informational alert dialog."
        severity="info"
      />

      <FullScreenDialogM3
        show={showFullScreen}
        onClose={() => setShowFullScreen(false)}
        title="Full Screen Dialog"
      >
        <div className="prose dark:prose-invert max-w-none">
          <h2>Full Screen Content</h2>
          <p>This dialog takes up the entire viewport.</p>
          <p>Useful for complex forms or detailed views.</p>
        </div>
      </FullScreenDialogM3>
    </div>
  );
}

/**
 * Section wrapper
 */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        {children}
      </div>
    </section>
  );
}

/**
 * Subsection wrapper
 */
function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}
