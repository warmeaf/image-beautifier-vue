<template>
  <div class="shrink-0 py-4 px-6 flex gap-2 justify-center items-center">
    <a-config-provider
      :theme="{
        components: {
          Button: {
            colorPrimary: editorStore.isDark ? '#2b4acb' : '#000',
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
            :icon="h(Icon.ImageDown, { size: 18 })"
            @click="toDownload"
            class="icon-btn rounded-se-none! flex-1! rounded-ee-none! me-[-1px]! hover:z-[1]! border-r-white/30!"
            :class="{
              'hover:bg-[#4a67c5]!': editorStore.isDark,
              'hover:bg-[#0d0d0d]!': !editorStore.isDark,
            }"
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
            :icon="h(Icon.Copy, { size: 18 })"
            :loading="loading"
            class="icon-btn rounded-ss-none! rounded-es-none! border-l-white/30! hover:bg-[#0d0d0d]!"
            :class="{
              'hover:bg-[#4a67c5]!': editorStore.isDark,
              'hover:bg-[#0d0d0d]!': !editorStore.isDark,
            }"
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
        :open="open"
        :overlay-style="{
          width: '320px',
        }"
        @open-change="handleOpenChange"
      >
        <template #content>
          <div>
            <div
              class="p-2 [&_.ant-segmented]:w-full [&_.ant-segmented-item]:w-[33%]"
            >
              <div class="text-xs text-gray-400 mb-2">Format</div>
              <a-radio-group :value="format" @change="setFormat">
                <a-radio-button value="png">png</a-radio-button>
                <a-radio-button value="jpg">jpg</a-radio-button>
                <a-radio-button value="webp">webp</a-radio-button>
              </a-radio-group>
              <div class="text-xs text-gray-400 mt-2 mb-2">Pixel Ratio</div>
              <a-radio-group :value="ratio" @change="setRatio">
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
          :icon="h(Icon.Settings2, { size: 18 })"
        />
      </a-popover>
      <a-popconfirm
        v-if="editorStore.img?.src"
        title="Delete the screenshot"
        description="Are you sure to delete this screenshot?"
        placement="topRight"
        ok-text="Yes"
        cancel-text="No"
        @confirm="confirm"
      >
        <a-button
          size="large"
          class="icon-btn"
          :icon="h(Icon.Trash2, { size: 18 })"
        />
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup>
import { h, ref, computed } from 'vue'
import Icon from '@components/Icon'
import { toDownloadFile, nanoid, modKey } from '@utils/utils'
import stores from '@stores/index'
const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

const loading = ref(false)
const ratio = ref(1)
const format = ref('png')

const downloadText = computed(() => {
  return `Download ${modKey} + S`
})
const copyText = computed(() => {
  return `Copy ${modKey} + C`
})
const ratioText = computed(() => {
  return `${ratio.value}x as ${format.value.toLocaleUpperCase()}`
})
const sizeText = computed(() => {
  return `${optionStore.frameConf.width * ratio.value} x
  ${optionStore.frameConf.height * ratio.value}`
})

const toDownload = async () => {
  if (!editorStore.isEditing) return
  if (loading.value) return
  const option = {
    pixelRatio: ratio.value,
  }
  if (['jpg', 'webp'].includes(format.value)) {
    option.quality = 0.9
    option.fill = '#ffffff'
  }
  const key = nanoid()
  loading.value = true
  editorStore.message.open({
    key,
    type: 'loading',
    content: 'Downloading...',
  })
  await editorStore.app.tree
    .export(format.value, option)
    .then((result) => {
      let name = `ShotEasy`
      if (ratio.value > 1) name += `@${ratio.value}`
      toDownloadFile(result.data, `${name}.${format.value}`)
      editorStore.message.open({
        key,
        type: 'success',
        content: 'Download Success!',
      })
    })
    .catch(() => {
      editorStore.message.open({
        key,
        type: 'error',
        content: 'Download failed!',
      })
    })
  loading.value = false
}
const toCopy = async () => {
  if (!editorStore.isEditing) return
  if (loading.value) return
  const key = nanoid()
  loading.value = true
  editorStore.message.open({
    key,
    type: 'loading',
    content: 'Copying...',
  })

  try {
    const result = await editorStore.app.tree.export('png', {
      blob: true,
      pixelRatio: ratio.value,
    })
    const { data } = result
    await navigator.clipboard.write([
      new ClipboardItem({
        [data.type]: data,
      }),
    ])
    editorStore.message.open({
      key,
      type: 'success',
      content: 'Copy Success!',
    })
  } catch (_) {
    console.log(_)
    editorStore.message.open({
      key,
      type: 'error',
      content: 'Copy failed!',
    })
  } finally {
    loading.value = false
  }
}

const confirm = () => {
  editorStore.destroy()
  editorStore.clearImg()
  editorStore.clearFun && editorStore.clearFun()
}

const open = ref(false)
const handleOpenChange = (val) => {
  open.value = val
}
const setFormat = (e) => {
  format.value = e.target.value
}
const setRatio = (e) => {
  ratio.value = e.target.value
}
</script>
