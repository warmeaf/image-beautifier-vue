<template>
  <div
    class="flex items-center justify-center shrink-0 gap-3 bg-white dark:bg-black py-2 px-5 border-b border-b-gray-50 dark:border-b-gray-700 shadow-xs relative z-[11] select-none"
  >
    <div class="flex-1">
      <e-logo />
    </div>
    <div class="flex gap-1 justify-center items-center">
      <template v-for="(item, index) in toolList">
        <emoji-select
          v-if="item === 'Smile'"
          :key="`${item}${index}`"
          :disabled="false"
          :emoji-mart-props="{
            data: data,
            locale: 'en',
            theme: editorStore.isDark ? 'dark' : 'light',
            onEmojiSelect: handleSelectEmoji,
          }"
        />
        <a-button
          v-else
          shape="circle"
          type="text"
          class="icon-btn"
          :class="toolBtnClass(item)"
          :key="item"
          :icon="getIcon(item)"
          @click="selectTool(item)"
        />
      </template>
    </div>
    <a-divider type="vertical" />
    <div class="flex gap-1 justify-center items-center">
      <color-picker
        :value="editorStore.annotateColor"
        @change="handleColorChange"
      />
      <width-dropdown
        :value="editorStore.strokeWidth"
        @change="handleWidthChange"
      />
      <a-button
        type="text"
        shape="circle"
        :class="[
          'icon-btn',
          isMove &&
            'text-[#1677ff]! bg-sky-100/50! hover:bg-sky-100! hover:text-[#1677ff]!',
        ]"
        :icon="h(Icon.Hand, { size: 16 })"
        @click="toggleMove"
      />
    </div>
    <media-logo>
      <!-- 关闭主题切换 -->
      <!-- <a-button
        type="text"
        shape="circle"
        class="icon-btn"
        :icon="
          editorStore.isDark
            ? h(Icon.Moon, { size: 16 })
            : h(Icon.Sun, { size: 16 })
        "
        @click="handleSetTheme"
      /> -->
    </media-logo>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue'
import { icons } from 'lucide-vue-next'
import data from '@emoji-mart/data'
import { nanoid } from '@utils/utils'

import ELogo from '@components/header/Logo'
import Icon from '@components/Icon'
import ColorPicker from '@components/ColorPicker'
import WidthDropdown from '@components/header/WidthDropdown'
import MediaLogo from '@components/header/MediaLogo'
import EmojiSelect from '@components/header/EmojiSelect'

import stores from '@stores/index'
const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

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

const toolBtnClass = computed(() => {
  return (type) => {
    if (editorStore.useTool === type) {
      return [
        'text-[#1a79ff]! [&_.border]:border-[#1a79ff]! bg-sky-100/50! hover:bg-sky-100! hover:text-[#1a79ff]! [&_.border]:hover:text-[#1a79ff]!',
      ]
    } else {
      return ''
    }
  }
})

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
      editorStore.nextStep
    )
  } else {
    const Icons = icons[item]
    icon = h(Icons, { name: item, size: 16 })
  }
  return icon
}
const selectTool = (type) => {
  if (!editorStore.isEditing) return
  const { useTool } = editorStore
  editorStore.setUseTool(useTool === type ? null : type)
  isMove.value = false
  if (type === 'Magnifier') editorStore.createSnap('init')
}
const toggleMove = () => {
  if (!editorStore.isEditing) return
  const is = !isMove.value
  editorStore.setUseTool(null)
  isMove.value = is
  editorStore.app.config.move.drag = is
}
const handleColorChange = (tinyColor) => {
  editorStore.setAnnotateColor(tinyColor.toHexString())
}
const handleWidthChange = (width) => {
  editorStore.setStrokeWidth(width)
}
const handleSetTheme = () => {
  editorStore.setTheme()
  localStorage.setItem('SHOTEASY_BEAUTIFIER_THEME', editorStore.theme)
}
const handleSelectEmoji = ({ native }) => {
  if (!editorStore.isEditing) return
  const x = optionStore.frameConf.width / 2 - 24
  const y = optionStore.frameConf.height / 2 - 24
  editorStore.setUseTool(null)
  isMove.value = false
  editorStore.addShape({
    id: nanoid(),
    type: 'emoji',
    text: native,
    zIndex: editorStore.shapes.size + 1,
    x,
    y,
    editable: true,
  })
}
</script>
