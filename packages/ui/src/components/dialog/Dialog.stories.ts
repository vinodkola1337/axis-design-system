import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { fn } from 'storybook/test'
import Button from '../button/Button.vue'
import Dialog from './Dialog.vue'

type DialogStoryArgs = InstanceType<typeof Dialog>['$props'] & {
  close?: [reason: 'escape' | 'scrim' | 'close-button' | 'programmatic']
  open?: []
  'update:modelValue'?: [value: boolean]
  onClose: (reason: 'escape' | 'scrim' | 'close-button' | 'programmatic') => void
  onOpen: () => void
  onUpdateModelValue: (value: boolean) => void
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    closeLabel: 'Close dialog',
    closeOnEscape: true,
    closeOnScrim: true,
    description: 'Review the item before adding it to the order.',
    initialFocus: '',
    modelValue: false,
    onClose: fn(),
    onOpen: fn(),
    onUpdateModelValue: fn(),
    padding: 'md',
    role: 'dialog',
    showCloseButton: true,
    size: 'md',
    title: 'Add menu item',
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Controls whether the dialog is open.',
      table: {
        category: 'Props',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    title: {
      control: 'text',
      description: 'Heading text rendered in the default dialog header.',
      table: {
        category: 'Props',
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: 'Supporting text rendered below the title.',
      table: {
        category: 'Props',
        type: { summary: 'string' },
      },
    },
    role: {
      control: 'select',
      description: 'Sets the dialog landmark role.',
      options: ['dialog', 'alertdialog'],
      table: {
        category: 'Props',
        defaultValue: { summary: 'dialog' },
        type: { summary: "'dialog' | 'alertdialog'" },
      },
    },
    size: {
      control: 'select',
      description: 'Controls the dialog max width.',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Props',
        defaultValue: { summary: 'md' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    padding: {
      control: 'select',
      description: 'Controls the interior spacing around dialog content.',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Props',
        defaultValue: { summary: 'md' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Allows Escape to request the dialog to close.',
      table: {
        category: 'Props',
        defaultValue: { summary: 'true' },
      },
    },
    closeOnScrim: {
      control: 'boolean',
      description: 'Allows clicking the scrim to request the dialog to close.',
      table: {
        category: 'Props',
        defaultValue: { summary: 'true' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Shows an icon button in the header for explicit dismissal.',
      table: {
        category: 'Props',
        defaultValue: { summary: 'true' },
      },
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible label for the close button.',
      table: {
        category: 'Props',
        defaultValue: { summary: 'Close dialog' },
        type: { summary: 'string' },
      },
    },
    initialFocus: {
      control: 'text',
      description: 'Optional CSS selector for the element that receives focus when the dialog opens.',
      table: {
        category: 'Props',
        type: { summary: 'string' },
      },
    },
    onClose: {
      control: false,
      table: {
        disable: true,
      },
    },
    onOpen: {
      control: false,
      table: {
        disable: true,
      },
    },
    onUpdateModelValue: {
      control: false,
      table: {
        disable: true,
      },
    },
    close: {
      control: false,
      description: 'Emitted after the dialog closes, with the close reason.',
      table: {
        category: 'Events',
        type: { summary: "['escape' | 'scrim' | 'close-button' | 'programmatic']" },
      },
    },
    open: {
      control: false,
      description: 'Emitted when the dialog opens.',
      table: {
        category: 'Events',
      },
    },
    'update:modelValue': {
      control: false,
      description: 'Emitted when Dialog requests a change to its open state.',
      table: {
        category: 'Events',
        type: { summary: '[value: boolean]' },
      },
    },
    default: {
      control: false,
      description: 'Main dialog content.',
      table: {
        category: 'Slots',
      },
    },
    titleSlot: {
      name: 'title',
      control: false,
      description: 'Dialog title content. Prefer the title prop for standard text headings.',
      table: {
        category: 'Slots',
      },
    },
    descriptionSlot: {
      name: 'description',
      control: false,
      description: 'Supporting text rendered below the title. Prefer the description prop for standard text.',
      table: {
        category: 'Slots',
      },
    },
    footer: {
      control: false,
      description: 'Footer actions, usually aligned to the end.',
      table: {
        category: 'Slots',
      },
    },
  },
  render: (args) => ({
    components: { Button, Dialog },
    setup() {
      const isOpen = ref(args.modelValue)

      watch(
        () => args.modelValue,
        (value) => {
          isOpen.value = value
        },
      )

      function updateOpen(value: boolean) {
        isOpen.value = value
        args.onUpdateModelValue(value)
      }

      return { args, isOpen, updateOpen }
    },
    template: `
      <Button label="Open dialog" @click="isOpen = true" />
      <Dialog
        v-model="isOpen"
        :close-label="args.closeLabel"
        :close-on-escape="args.closeOnEscape"
        :close-on-scrim="args.closeOnScrim"
        :description="args.description"
        :initial-focus="args.initialFocus || undefined"
        :padding="args.padding"
        :role="args.role"
        :show-close-button="args.showCloseButton"
        :size="args.size"
        :title="args.title"
        @close="args.onClose"
        @open="args.onOpen"
        @update:model-value="updateOpen"
      >
        <p>Margherita pizza, $12.00</p>
        <template #footer>
          <Button label="Cancel" emphasis="text" @click="isOpen = false" />
          <Button label="Add item" />
        </template>
      </Dialog>
    `,
  }),
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog } from '@vinodkola/axis-ui'

const isOpen = ref(false)
</script>

<template>
  <Button label="Open dialog" @click="isOpen = true" />
  <Dialog
    v-model="isOpen"
    title="Add menu item"
    description="Review the item before adding it to the order."
  >
    <p>Margherita pizza, $12.00</p>
    <template #footer>
      <Button label="Cancel" emphasis="text" @click="isOpen = false" />
      <Button label="Add item" />
    </template>
  </Dialog>
</template>`,
      },
    },
  },
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Dialog v-model="isOpen" size="sm" title="Small dialog">...</Dialog>
<Dialog v-model="isOpen" size="md" title="Medium dialog">...</Dialog>
<Dialog v-model="isOpen" size="lg" title="Large dialog">...</Dialog>`,
      },
    },
  },
  render: () => ({
    components: { Button, Dialog },
    setup() {
      const activeSize = ref<'sm' | 'md' | 'lg' | undefined>()
      return { activeSize }
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: var(--axis-spacing-3);">
        <Button label="Small" @click="activeSize = 'sm'" />
        <Button label="Medium" @click="activeSize = 'md'" />
        <Button label="Large" @click="activeSize = 'lg'" />
      </div>
      <Dialog
        :model-value="Boolean(activeSize)"
        :size="activeSize || 'md'"
        title="Dialog size"
        description="Use the smallest size that comfortably supports the task."
        @update:model-value="activeSize = undefined"
      >
        <p>The active size is {{ activeSize }}.</p>
      </Dialog>
    `,
  }),
}

export const AlertDialog: Story = {
  args: {
    closeOnScrim: false,
    description: 'This action removes the saved item and cannot be undone.',
    role: 'alertdialog',
    title: 'Remove saved item?',
  },
  tags: ['!dev'],
}

export const CustomSlots: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Dialog v-model="isOpen">
  <template #title>Custom heading</template>
  <template #description>Supporting text</template>
  Custom content
  <template #footer>...</template>
</Dialog>`,
      },
    },
  },
  render: () => ({
    components: { Button, Dialog },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <Button label="Open custom dialog" @click="isOpen = true" />
      <Dialog v-model="isOpen">
        <template #title>Reservation details</template>
        <template #description>Confirm the guest count and arrival time.</template>
        <dl style="display: grid; gap: var(--axis-spacing-2); margin: 0;">
          <div style="display: flex; justify-content: space-between; gap: var(--axis-spacing-4);">
            <dt>Guests</dt>
            <dd style="margin: 0;">4</dd>
          </div>
          <div style="display: flex; justify-content: space-between; gap: var(--axis-spacing-4);">
            <dt>Time</dt>
            <dd style="margin: 0;">7:30 PM</dd>
          </div>
        </dl>
        <template #footer>
          <Button label="Cancel" emphasis="text" @click="isOpen = false" />
          <Button label="Confirm" />
        </template>
      </Dialog>
    `,
  }),
}
