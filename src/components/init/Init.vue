<template>
  <div
    class="md:w-0 md:flex-1 flex flex-col justify-center items-center overflow-hidden select-none relative"
  >
    <div :class="cn('max-w-[600px]', editorStore.invalid && 'invalid')">
      <a-upload-dragger
        name="file"
        class="p-4! rounded-md! bg-white block! shadow-xs!"
        :show-upload-list="false"
        :accept="supportImg.join(',')"
        :before-upload="beforeUpload"
      >
        <div class="text-center p-10">
          <p class="text-2xl my-2 opacity-60">
            <image-plus class="mx-auto" :size="36" />
          </p>
          <p class="text-sm px-4">
            Click or Drag image to this area<br />or Paste image
          </p>
        </div>
      </a-upload-dragger>
      <div
        class="flex justify-between mt-2 py-4 px-6 rounded-md bg-white shadow-xs"
      >
        <a-tooltip
          v-for="(item, index) in toolButtons"
          :key="index"
          placement="top"
          :arrow="false"
          :title="item.title"
        >
          <a-button
            shape="round"
            type="default"
            size="large"
            :icon="h(Icon[item.icon], { size: 20 })"
            @click="item.action"
          />
        </a-tooltip>
      </div>
      <button
        class="w-full mt-1 rounded-md bg-white border border-dotted shadow-xs flex justify-between items-center p-1 hover:bg-slate-50 hover:px-1.5"
        @click="handleTry"
      >
        <div class="overflow-hidden rounded-sm w-8">
          <img :src="demoPng" class="w-full" />
        </div>
        <div class="text-xs text-gray-500">Give it a try ✨</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import demoPng from '@assets/demo.png'
import Icon from '@components/Icon'
import { useSetImg } from '@hooks/useSetImg'
import stores from '@stores/index'
import { captureScreen } from '@utils/captureScreen'
import { cn, supportImg } from '@utils/utils'
import { h, ref } from 'vue'

const ImagePlus = Icon.ImagePlus

defineOptions({
  name: 'EInit',
})

const editorStore = stores.useEditorStore()
const optionOptions = stores.useOptionStore()
const { getFile } = useSetImg({
  editor: editorStore,
  option: optionOptions,
})
const beforeUpload = async (file) => {
  await getFile(file)
  return Promise.reject()
}
const onCapture = async () => {
  const dataURL = await captureScreen()
  if (!dataURL) return
  getFile(dataURL, 'dataURL')
}
const comingSoon = () => {
  editorStore.message.info('Developing, Coming soon!')
}
const handleTry = () => {
  getFile(demoPng, 'dataURL')
}

const toolButtons = ref([
  {
    title: 'Take a screenshot of desktop windows',
    icon: 'Camera',
    action: onCapture,
  },
  {
    title: 'Beautify text',
    icon: 'Type',
    action: comingSoon,
  },
  {
    title: 'Beautify Code',
    icon: 'CodeXml',
    action: comingSoon,
  },
  {
    title: 'Create gif animate',
    icon: 'ImagePlay',
    action: comingSoon,
  },
])
</script>
