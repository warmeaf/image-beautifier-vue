<script setup>
import { computed } from 'vue'
import { theme, message } from 'ant-design-vue'
const [messageApi, contextHolder] = message.useMessage()

import EHeader from '@components/header/Header'
import EEditor from '@components/editor/Editor'
import EInit from '@components/init/Init'
import SideBar from '@components/sideBar'

import stores from '@stores/index'
const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

editorStore.setMessage(messageApi)
const hasImgSrc = computed(() => optionStore.img?.src)
const algorithm = computed(() =>
  editorStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
)
const dataMode = computed(() => (editorStore.isDark ? 'dark' : 'light'))
</script>

<template>
  <div>
    <a-style-provider>
      <a-config-provider
        :theme="{
          algorithm: algorithm,
        }"
      >
        <contextHolder />
        <div
          id="shoteasy-container"
          class="polka flex flex-col overflow-hidden antialiased w-full h-[100vh] dark:bg-black"
          :data-mode="dataMode"
        >
          <e-header />
          <div class="flex flex-col flex-1 h-0 md:flex-row md:items-stretch">
            <e-editor v-if="hasImgSrc" />
            <e-init v-else />
            <side-bar />
          </div>
        </div>
      </a-config-provider>
    </a-style-provider>
  </div>
</template>
