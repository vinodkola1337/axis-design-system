import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import Button from '../button/Button.vue'
import Card from './Card.vue'

const menuImages = {
  citrusSalad: '/menu/citrus-salad.png',
  margheritaPizza: '/menu/margherita-pizza.png',
  pastaPesto: '/menu/pasta-pesto.png',
} as const

const menuItems = [
  {
    title: 'Margherita pizza',
    price: '$12.00',
    description: 'Fresh mozzarella, tomato, basil, and olive oil.',
    image: menuImages.margheritaPizza,
    imageAlt: 'Margherita pizza with basil',
  },
  {
    title: 'Pasta al pesto',
    price: '$14.00',
    description: 'Basil pesto, parmesan, pine nuts, and cherry tomatoes.',
    image: menuImages.pastaPesto,
    imageAlt: 'Pasta with pesto and tomatoes',
  },
  {
    title: 'Citrus salad',
    price: '$9.00',
    description: 'Seasonal greens, orange, fennel, and toasted seeds.',
    image: menuImages.citrusSalad,
    imageAlt: 'Colorful citrus salad',
  },
] as const

type CardStoryArgs = InstanceType<typeof Card>['$props'] & {
  click?: [event: MouseEvent | KeyboardEvent]
  onClick: (event: MouseEvent | KeyboardEvent) => void
}

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    disabled: false,
    interactive: false,
    mediaAlt: 'Margherita pizza with basil',
    mediaSrc: menuImages.margheritaPizza,
    onClick: fn(),
    orientation: 'vertical',
    padding: 'md',
    selected: false,
    subtitle: '$12.00',
    title: 'Margherita pizza',
    variant: 'outlined',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Heading text rendered in the default card header.',
      table: {
        type: { summary: 'string' },
      },
    },
    subtitle: {
      control: 'text',
      description: 'Secondary header text rendered below the title.',
      table: {
        type: { summary: 'string' },
      },
    },
    mediaSrc: {
      control: 'text',
      description: 'Image source rendered in the media region.',
      table: {
        type: { summary: 'string' },
      },
    },
    mediaAlt: {
      control: 'text',
      description: 'Alternative text for the default media image. Use an empty string for decorative images.',
      table: {
        defaultValue: { summary: "''" },
        type: { summary: 'string' },
      },
    },
    variant: {
      control: 'select',
      description: 'Sets the card surface treatment.',
      options: ['outlined', 'raised'],
      table: {
        defaultValue: { summary: 'outlined' },
        type: { summary: "'outlined' | 'raised'" },
      },
    },
    padding: {
      control: 'select',
      description: 'Controls the interior spacing around card content.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    orientation: {
      control: 'select',
      description: 'Controls whether media and content stack vertically or sit side by side.',
      options: ['vertical', 'horizontal'],
      table: {
        defaultValue: { summary: 'vertical' },
        type: { summary: "'vertical' | 'horizontal'" },
      },
    },
    interactive: {
      control: 'boolean',
      description: 'Adds button-like semantics and keyboard activation for selectable card behavior.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Applies selected styling. Interactive cards expose this state with aria-pressed.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction when the card is interactive and applies disabled styling.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      control: false,
      table: {
        disable: true,
      },
    },
    click: {
      control: false,
      description: 'Emitted when the card is clicked and not disabled.',
      table: {
        category: 'Events',
        type: { summary: '[event: MouseEvent | KeyboardEvent]' },
      },
    },
  },
  render: (args) => ({
    components: { Button, Card },
    setup: () => ({ args }),
    template: `
      <div style="width: min(22rem, 80vw);">
        <Card
          :disabled="args.disabled"
          :interactive="args.interactive"
          :media-alt="args.mediaAlt"
          :media-src="args.mediaSrc"
          :orientation="args.orientation"
          :padding="args.padding"
          :selected="args.selected"
          :subtitle="args.subtitle"
          :title="args.title"
          :variant="args.variant"
          @click="args.onClick"
        >
          <p>Fresh mozzarella, tomato, basil, and olive oil.</p>
          <template v-if="!args.interactive" #footer>
            <Button label="Add" size="sm" />
          </template>
        </Card>
      </div>
    `,
  }),
} satisfies Meta<CardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Card
  title="Margherita pizza"
  subtitle="$12.00"
  media-src="/menu/margherita-pizza.png"
  media-alt="Margherita pizza with basil"
>
  <p>Fresh mozzarella, tomato, basil, and olive oil.</p>
  <template #footer>
    <Button label="Add" size="sm" />
  </template>
</Card>`,
      },
    },
  },
}

export const Variants: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Card title="Outlined card" subtitle="Default surface">...</Card>
<Card title="Raised card" subtitle="Subtle filled surface" variant="raised">...</Card>`,
      },
    },
  },
  render: () => ({
    components: { Card },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 16rem)); gap: var(--axis-spacing-4);">
        <Card title="Outlined card" subtitle="Default surface">
          <p>Use for most grouped content on a page.</p>
        </Card>
        <Card title="Raised card" subtitle="Subtle filled surface" variant="raised">
          <p>Use when a card needs extra separation from the canvas.</p>
        </Card>
      </div>
    `,
  }),
}

export const Orientations: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Card title="Vertical card" media-src="/menu/margherita-pizza.png">...</Card>
<Card title="Horizontal card" orientation="horizontal" media-src="/menu/margherita-pizza.png">...</Card>`,
      },
    },
  },
  render: () => ({
    components: { Card },
    setup: () => ({ menuImages }),
    template: `
      <div style="display: grid; gap: var(--axis-spacing-4); width: min(36rem, 80vw);">
        <Card
          title="Vertical card"
          subtitle="$12.00"
          :media-src="menuImages.margheritaPizza"
          media-alt="Margherita pizza with basil"
        >
          <p>Best for image-led menu grids.</p>
        </Card>
        <Card
          title="Horizontal card"
          subtitle="$12.00"
          orientation="horizontal"
          :media-src="menuImages.margheritaPizza"
          media-alt="Margherita pizza with basil"
        >
          <p>Best for compact lists and carts.</p>
        </Card>
      </div>
    `,
  }),
}

export const Padding: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Card title="Small padding" padding="sm">...</Card>
<Card title="Medium padding" padding="md">...</Card>
<Card title="Large padding" padding="lg">...</Card>`,
      },
    },
  },
  render: () => ({
    components: { Card },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 13rem)); gap: var(--axis-spacing-4);">
        <Card title="Small padding" padding="sm"><p>Dense card content.</p></Card>
        <Card title="Medium padding" padding="md"><p>Standard card content.</p></Card>
        <Card title="Large padding" padding="lg"><p>Prominent card content.</p></Card>
      </div>
    `,
  }),
}

export const SelectionStates: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Card title="Available" interactive />
<Card title="Selected" interactive selected />
<Card title="Unavailable" interactive disabled />`,
      },
    },
  },
  render: () => ({
    components: { Card },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 13rem)); gap: var(--axis-spacing-4);">
        <Card title="Available" subtitle="$12.00" interactive><p>Ready to add.</p></Card>
        <Card title="Selected" subtitle="$12.00" interactive selected><p>Currently selected.</p></Card>
        <Card title="Unavailable" subtitle="Sold out" interactive disabled><p>Not available.</p></Card>
      </div>
    `,
  }),
}

export const MenuGrid: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<script setup lang="ts">
import { Button, Card } from '@vinodkola/axis-ui'

const menuItems = [
  {
    title: 'Margherita pizza',
    price: '$12.00',
    description: 'Fresh mozzarella, tomato, basil, and olive oil.',
    image: '/menu/margherita-pizza.png',
    imageAlt: 'Margherita pizza with basil',
  },
  {
    title: 'Pasta al pesto',
    price: '$14.00',
    description: 'Basil pesto, parmesan, pine nuts, and cherry tomatoes.',
    image: '/menu/pasta-pesto.png',
    imageAlt: 'Pasta with pesto and tomatoes',
  },
  {
    title: 'Citrus salad',
    price: '$9.00',
    description: 'Seasonal greens, orange, fennel, and toasted seeds.',
    image: '/menu/citrus-salad.png',
    imageAlt: 'Colorful citrus salad',
  },
]
</script>

<template>
  <Card
    v-for="item in menuItems"
    :key="item.title"
    :title="item.title"
    :subtitle="item.price"
    :media-src="item.image"
    :media-alt="item.imageAlt"
  >
    <p>{{ item.description }}</p>
    <template #footer>
      <Button label="Add" size="sm" />
    </template>
  </Card>
</template>`,
      },
    },
  },
  render: () => ({
    components: { Button, Card },
    setup: () => ({ menuItems }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 16rem)); gap: var(--axis-spacing-4);">
        <Card
          v-for="item in menuItems"
          :key="item.title"
          :title="item.title"
          :subtitle="item.price"
          :media-src="item.image"
          :media-alt="item.imageAlt"
        >
          <p>{{ item.description }}</p>
          <template #footer><Button label="Add" size="sm" /></template>
        </Card>
      </div>
    `,
  }),
}

export const CustomSlots: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: {
        code: `<Card>
  <template #media>...</template>
  <template #header>...</template>
  Custom content
</Card>`,
      },
    },
  },
  render: () => ({
    components: { Card },
    template: `
      <Card style="width: min(20rem, 80vw);">
        <template #media>
          <div style="display: grid; height: 100%; place-items: center; color: var(--axis-color-text-secondary);">
            Chef's pick
          </div>
        </template>
        <template #header>
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: var(--axis-spacing-2);">
            <h3 style="margin: 0; font-size: var(--axis-card-title-font-size);">Seasonal risotto</h3>
            <strong>$16.00</strong>
          </div>
        </template>
        <p>Mushrooms, herbs, and parmesan.</p>
      </Card>
    `,
  }),
}
