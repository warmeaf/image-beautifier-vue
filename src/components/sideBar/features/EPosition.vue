<template>
  <a-popover
    trigger="click"
    :arrow="false"
    placement="bottomRight"
    :overlayClassName="cn('shoteasy-components')"
    :open="isOpen"
    @openChange="handleOpenChange"
  >
    <template #content>
      <div :class="cn('flex flex-wrap w-24 position-block', optionStore.align)">
        <div
          v-for="item in cols"
          :key="item"
          class="w-8 h-8 border border-[var(--c-br)] rounded-sm hover:bg-[var(--c-wb)] cursor-pointer"
          @click="() => handleSelect(item)"
        />
      </div>
    </template>
    <a-button
      type="text"
      shape="circle"
      class="icon-btn"
      :class="cn(isOpen && 'shadow-md')"
      :icon="h(Icon.LayoutGrid, { size: 18 })"
      @click="() => (isOpen = !isOpen)"
    />
  </a-popover>
</template>

<script setup>
import { ref, h } from 'vue'
import stores from '@stores/index'
import Icon from '@components/Icon'

import { cn } from '@utils/utils'

const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

const cols = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
]
const isOpen = ref(false)

/**
 * 处理打开状态变化
 * @param {boolean} isOpenState - 是否打开
 */
const handleOpenChange = (isOpenState) => {
  isOpen.value = isOpenState
}

/**
 * 处理位置选择
 * @param {string} position - 位置值
 */
const handleSelect = (position) => {
  optionStore.setAlign(position)
}
</script>
