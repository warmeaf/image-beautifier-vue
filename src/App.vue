<script setup>
import { message } from 'ant-design-vue'
import { computed } from 'vue'

const [messageApi, contextHolder] = message.useMessage()

import EEditor from '@components/editor/Editor'
import EHeader from '@components/header/Header'
import EInit from '@components/init/Init'
import SideBar from '@components/sideBar'

import stores from '@stores/index'

const editorStore = stores.useEditorStore()
const optionStore = stores.useOptionStore()

editorStore.setMessage(messageApi)
const hasImgSrc = computed(() => optionStore.img?.src)
</script>

<template>
  <div>
    <a-style-provider>
      <a-config-provider>
        <contextHolder />
        <div
          id="shoteasy-container"
          class="polka flex flex-col overflow-hidden antialiased w-full h-[100vh]"
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
