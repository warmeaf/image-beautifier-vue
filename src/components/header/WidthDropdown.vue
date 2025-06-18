<template>
  <a-dropdown trigger="click" placement="bottom">
    <template #overlay>
      <a-menu
        :items="items"
        :selectedKeys="selectedKeys"
        @click="handleClick"
      />
    </template>
    <a-button
      type="text"
      shape="circle"
      class="icon-btn px-1.5 py-0 flex items-center justify-center"
    >
      <div class="w-4 h-4 flex items-center cursor-pointer">
        <i
          class="block w-full origin-center rounded-lg bg-slate-600 -rotate-45"
          :style="{
            height: value + 'px',
          }"
        ></i>
      </div>
    </a-button>
  </a-dropdown>
</template>

<script setup>
import { computed, h } from 'vue'

const items = [
  {
    label: h(
      'div',
      { class: 'w-4 h-3 mt-1.5 items-center cursor-pointer' },
      h('i', {
        class:
          'block w-full origin-center rounded-lg bg-slate-600 -rotate-45 h-[1px]',
      })
    ),
    key: 1,
  },
  {
    label: h(
      'div',
      { class: 'w-4 h-3 mt-1.5 items-center cursor-pointer' },
      h('i', {
        class:
          'block w-full origin-center rounded-lg bg-slate-600 -rotate-45 h-[2px]',
      })
    ),
    key: 2,
  },
  {
    label: h(
      'div',
      { class: 'w-4 h-3 mt-1.5 items-center cursor-pointer' },
      h('i', {
        class:
          'block w-full origin-center rounded-lg bg-slate-600 -rotate-45 h-[4px]',
      })
    ),
    key: 4,
  },
  {
    label: h(
      'div',
      { class: 'w-4 h-3 mt-1.5 items-center cursor-pointer' },
      h('i', {
        class:
          'block w-full origin-center rounded-lg bg-slate-600 -rotate-45 h-[6px]',
      })
    ),
    key: 6,
  },
  {
    label: h(
      'div',
      { class: 'w-4 h-3 mt-1.5 items-center cursor-pointer' },
      h('i', {
        class:
          'block w-full origin-center rounded-lg bg-slate-600 -rotate-45 h-[8px]',
      })
    ),
    key: 8,
  },
]

const props = defineProps({
  value: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['change'])
const selectedKeys = computed(() => {
  return [props.value]
})

const handleClick = ({ key }) => {
  emit('change', key)
}
</script>
