<template>
  <div class="shrink-0 py-4 px-6 flex gap-2 justify-center items-center">
    <a-config-provider
      :theme="{
        components: {
          Button: {
            colorPrimary: '#000',
          },
        },
      }"
    >
      <div class="ant-space-compact flex flex-1">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ downloadText }}</span>
          </template>
          <a-button
            type="primary"
            size="large"
            :loading="loading"
            :icon="h(Icon.ImageDown, { size: UI_CONFIG.ICON_SIZE.DEFAULT })"
            @click="toDownload"
            class="icon-btn rounded-se-none! flex-1! rounded-ee-none! me-[-1px]! hover:z-[1]! border-r-white/30! hover:bg-[#0d0d0d]!"
          >
            <div class="leading-4 px-2">
              <div class="text-sm leading-4 font-semibold">Download</div>
              <div class="text-xs">
                {{ ratioText }}
              </div>
            </div>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span>{{ copyText }}</span>
          </template>
          <a-button
            type="primary"
            size="large"
            :icon="h(Icon.Copy, { size: UI_CONFIG.ICON_SIZE.DEFAULT })"
            :loading="loading"
            class="icon-btn rounded-ss-none! rounded-es-none! border-l-white/30! hover:bg-[#0d0d0d]!"
            @click="toCopy"
          />
        </a-tooltip>
      </div>
    </a-config-provider>
    <div class="flex items-center gap-1">
      <a-popover
        trigger="click"
        placement="topRight"
        :arrow="false"
        :open="isSettingsOpen"
        :overlay-style="{
          width: UI_CONFIG.POPOVER.SETTINGS_WIDTH,
        }"
        @open-change="handleSettingsOpenChange"
      >
        <template #content>
          <div>
            <div
              class="p-2 [&_.ant-segmented]:w-full [&_.ant-segmented-item]:w-[33%]"
            >
              <div class="text-xs text-gray-400 mb-2">Format</div>
              <a-radio-group :value="format" @change="handleFormatChange">
                <a-radio-button value="png">png</a-radio-button>
                <a-radio-button value="jpg">jpg</a-radio-button>
                <a-radio-button value="webp">webp</a-radio-button>
              </a-radio-group>
              <div class="text-xs text-gray-400 mt-2 mb-2">Pixel Ratio</div>
              <a-radio-group :value="ratio" @change="handleRatioChange">
                <a-radio-button :value="1">1x</a-radio-button>
                <a-radio-button :value="2">2x</a-radio-button>
                <a-radio-button :value="3">3x</a-radio-button>
              </a-radio-group>
              <div
                v-if="optionStore.frameConf.width"
                class="text-xs p-3 mt-4 flex justify-between bg-black/5 rounded-md"
              >
                <span class="text-gray-400">Download Size</span>
                <span class="text-gray-700">{{ sizeText }}</span>
              </div>
            </div>
          </div>
        </template>
        <a-button
          size="large"
          class="icon-btn"
          :icon="h(Icon.Settings2, { size: UI_CONFIG.ICON_SIZE.DEFAULT })"
        />
      </a-popover>
      <a-popconfirm
        v-if="optionStore.img?.src"
        :title="MESSAGES.DELETE.TITLE"
        :description="MESSAGES.DELETE.DESCRIPTION"
        placement="topRight"
        :ok-text="MESSAGES.DELETE.CONFIRM"
        :cancel-text="MESSAGES.DELETE.CANCEL"
        @confirm="handleDeleteConfirm"
      >
        <a-button
          size="large"
          class="icon-btn"
          :icon="h(Icon.Trash2, { size: UI_CONFIG.ICON_SIZE.DEFAULT })"
        />
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup>
import Icon from '@components/Icon'
import { useExport } from '@composables/useExport'
import { useMessage } from '@composables/useMessage'
import { MESSAGES } from '@constants/messages'
import { UI_CONFIG } from '@constants/ui'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import stores from '@stores/index'
import { modKey } from '@utils/utils'
import { computed, h, ref } from 'vue'

const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

const messageHandlers = useMessage(editorStore.message)
const {
  loading,
  pixelRatio: ratio,
  format,
  download: toDownload,
  copyToClipboard: toCopy,
  setFormat: updateFormat,
  setPixelRatio: updateRatio,
} = useExport(editorStore, messageHandlers)

const downloadText = computed(() => {
  return `Download ${modKey} + S`
})

const copyText = computed(() => {
  return `Copy ${modKey} + C`
})

const ratioText = computed(() => {
  return `${ratio.value}x as ${format.value.toUpperCase()}`
})

const sizeText = computed(() => {
  if (!optionStore.frameConf.width) return ''
  return `${optionStore.frameConf.width * ratio.value} x ${optionStore.frameConf.height * ratio.value}`
})

useKeyboardShortcuts(toDownload, toCopy)

/**
 * 确认删除截图
 */
const handleDeleteConfirm = () => {
  editorStore.destroy()
  optionStore.clearImg()
  if (editorStore.clearFun) {
    editorStore.clearFun()
  }
}

const isSettingsOpen = ref(false)

/**
 * 处理设置面板打开状态变化
 * @param {boolean} isOpen - 是否打开
 */
const handleSettingsOpenChange = (isOpen) => {
  isSettingsOpen.value = isOpen
}

/**
 * 处理格式变化
 * @param {Event} event - 事件对象
 */
const handleFormatChange = (event) => {
  updateFormat(event.target.value)
}

/**
 * 处理像素比例变化
 * @param {Event} event - 事件对象
 */
const handleRatioChange = (event) => {
  updateRatio(event.target.value)
}
</script>
