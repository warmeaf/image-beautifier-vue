<template>
  <div
    class="bg-white dark:bg-black flex flex-col md:w-[340px] border-l border-l-gray-50 dark:border-l-gray-700 dark:text-gray-400 shadow-lg relative z-10 select-none"
  >
    <side-bar-content @show-more="setShowMore" />
    <download-bar />
    <drawer-bar :show-more="showMore" @change="setShowMore" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBarContent from './SideBarContent'
import { DownloadBar } from './bars'
import { DrawerBar } from './background'

const showMore = ref(false)
const setShowMore = (val) => {
  showMore.value = val
}
</script>
