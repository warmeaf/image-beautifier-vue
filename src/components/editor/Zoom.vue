<template>
  <div class="absolute z-10 bottom-4 gap-2 right-4 flex items-center">
    <div
      class="flex bg-white dark:bg-black overflow-hidden rounded-full shadow-md"
    >
      <a-button
        type="text"
        class="icon-btn"
        :icon="h(Icon.ZoomIn, { size: 16 })"
        @click="
          () => {
            handleZoom('in')
          }
        "
      />
      <a-dropdown placement="top">
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="item in items"
              :key="item.key"
              @click="
                () => {
                  handleMenuClick(item)
                }
              "
            >
              {{ item.label }}
            </a-menu-item>
          </a-menu>
        </template>
        <a-button type="text">{{ editorStore.scale }}%</a-button>
      </a-dropdown>
      <a-button
        type="text"
        class="icon-btn"
        :icon="h(Icon.ZoomOut, { size: 16 })"
        @click="
          () => {
            handleZoom('out')
          }
        "
      />
    </div>
    <div class="rounded-full bg-white dark:bg-black shadow-md overflow-hidden">
      <a-button
        type="text"
        class="icon-btn"
        :icon="h(Icon.Maximize, { size: 16 })"
        @click="
          () => {
            handleMenuClick({ key: 4 })
          }
        "
      />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

import Icon from '@components/Icon'
import stores from '@stores/index'

defineOptions({
  name: 'EZoom',
})

const editorStore = stores.useEditorStore()

const items = [
  {
    key: 0.5,
    label: '50%',
  },
  {
    key: 1,
    label: '100%',
  },
  {
    key: 1.5,
    label: '150%',
  },
  {
    key: 2,
    label: '200%',
  },
]

const handleZoom = (key) => {
  editorStore.app?.tree.zoom(key)
  editorStore.setScale(editorStore.app?.tree.scale)
}
const handleMenuClick = (item) => {
  const num = Number(item.key)
  if (num === 4) {
    editorStore.app?.tree.zoom('fit', 100)
  } else {
    editorStore.app?.tree.zoom(num)
  }
  editorStore.setScale(editorStore.app?.tree.scale)
}
</script>
