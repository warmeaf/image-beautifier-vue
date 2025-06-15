<template>
  <div
    class="md:w-0 md:flex-1 flex flex-col justify-center items-center overflow-hidden select-none relative"
  >
    <div :class="cn('max-w-[600px]', editorStore.invalid && 'invalid')">
      <a-upload-dragger
        name="file"
        class="p-4 rounded-md bg-white dark:bg-black dark:text-gray-400 block shadow-xs"
        :show-upload-list="false"
        :accept="supportImg.join(',')"
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
        class="flex justify-between mt-2 py-4 px-6 rounded-md bg-white dark:bg-black shadow-xs"
      >
        <a-tooltip
          placement="top"
          :arrow="false"
          title="Take a screenshot of desktop windows"
        >
          <a-button
            shape="round"
            type="default"
            size="large"
            :icon="h(Icon.Camera, { size: 20 })"
          />
        </a-tooltip>
        <a-tooltip placement="top" :arrow="false" title="Beautify text">
          <a-button
            shape="round"
            type="default"
            size="large"
            :icon="h(Icon.Type, { size: 20 })"
          />
        </a-tooltip>
        <a-tooltip placement="top" :arrow="false" title="Beautify Code">
          <a-button
            shape="round"
            type="default"
            size="large"
            :icon="h(Icon.CodeXml, { size: 20 })"
          />
        </a-tooltip>
        <a-tooltip placement="top" :arrow="false" title="Create gif animate">
          <a-button
            shape="round"
            type="default"
            size="large"
            :icon="h(Icon.ImagePlay, { size: 20 })"
          />
        </a-tooltip>
      </div>
      <button
        class="w-full mt-1 rounded-md bg-white dark:bg-black border border-dotted dark:border-gray-700 shadow-xs flex justify-between items-center p-1 hover:bg-slate-50 dark:hover:bg-gray-900 hover:px-1.5"
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
import { h } from 'vue'
import stores from '@stores/index'
import { supportImg, cn } from '@utils/utils'
import Icon from '@components/Icon'
import demoPng from '@assets/demo.png'
import { useSetImg } from '@hooks/useSetImg'

const ImagePlus = Icon.ImagePlus

defineOptions({
  name: 'EInit',
})

const editorStore = stores.useEditorStore()
const optionOptions = stores.useOptionStore()
const { getFile } = useSetImg({
  editor: editorStore,
  option: optionOptions
})

const handleTry = () => {
  getFile(demoPng, 'dataURL')
}
</script>
