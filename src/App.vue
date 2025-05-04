<script setup>
import EHeader from '@components/header/Header'
import EInit from '@components/init/Init'
import SideBar from '@components/sidebar/SideBar'
</script>

<template>
  <div>
    <a-style-provider>
      <a-config-provider>
        <div
          id="shoteasy-container"
          class="polka flex flex-col overflow-hidden antialiased w-full h-[100vh] dark:bg-black"
        >
          <e-header />
          <div class="flex flex-col flex-1 h-0 md:flex-row md:items-stretch">
            <e-init />
            <SideBar />
          </div>
        </div>
      </a-config-provider>
    </a-style-provider>
  </div>
</template>
