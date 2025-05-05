<template>
  <div
    class="flex items-center justify-center shrink-0 gap-3 bg-white dark:bg-black py-2 px-5 border-b border-b-gray-50 dark:border-b-gray-700 shadow-sm relative z-[11] select-none"
  >
    <div class="flex-1">
      <e-logo />
    </div>
    <div class="flex gap-1 justify-center items-center">
      <a-button
        v-for="item in toolList"
        shape="circle"
        type="text"
        class="text-[#1a79ff] [&_.border]:border-[#1a79ff] bg-sky-100/50 hover:bg-sky-100 hover:text-[#1a79ff] [&_.border]:hover:text-[#1a79ff]"
        :key="item"
        :icon="getIcon(item)"
        @click="selectTool(item)"
      />
    </div>
    <a-divider type="vertical" />
    <div class="flex gap-1 justify-center items-center">
      <width-dropdown />
      <a-button
        type="text"
        shape="circle"
        :class="[
          isMove &&
            'text-[#1677ff] bg-sky-100/50 hover:bg-sky-100 hover:text-[#1677ff]',
        ]"
        :icon="h(Icon.Hand, { size: 16 })"
        @click="toggleMove"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { icons } from 'lucide-vue-next'

import ELogo from '@components/header/Logo'
import Icon from '@components/Icon'
import WidthDropdown from '@components/header/WidthDropdown.vue'

defineOptions({
  name: 'EHeader',
})

const toolList = [
  'Square',
  'SquareFill',
  'Circle',
  'Slash',
  'MoveDownLeft',
  'Pencil',
  'Magnifier',
  'Step',
  'Smile',
]
const isMove = ref(false)

const getIcon = (item) => {
  let icon = null
  if (item.includes('Fill')) {
    const type = item.replace('Fill', '')
    const Icons = icons[type]
    icon = h(Icons, { size: 16, fill: 'currentColor' })
  } else if (item === 'Magnifier') {
    icon = h(Icon.MessageCirclePlus, { size: 16 })
  } else if (item === 'Step') {
    icon = h(
      'div',
      {
        key: item,
        class:
          'border text-xs border-black dark:border-white w-4 h-4 rounded-full text-center leading-4',
      },
      1
    )
  } else {
    const Icons = icons[item]
    icon = h(Icons, { name: item, size: 16 })
  }
  return icon
}
const selectTool = (item) => {
  console.log(item)
}
const toggleMove = () => {
  isMove.value = !isMove.value
}
</script>
