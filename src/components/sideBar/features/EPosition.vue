<template>
  <a-popover
    trigger="click"
    :arrow="false"
    placement="bottomRight"
    :overlayClassName="cn('shoteasy-components')"
    :open="open"
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
      :class="cn(open && 'shadow-md')"
      :icon="h(Icon.LayoutGrid, { size: 18 })"
      @click="() => (open = !open)"
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
const open = ref(false)
const handleOpenChange = (val) => {
  open.value = val
}
const handleSelect = (val) => {
  optionStore.setAlign(val)
}
</script>
