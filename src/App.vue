<script setup></script>

<template>
  <div>
    <a-style-provider>
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#00b96b',
          },
        }"
      >
        <div
          id="shoteasy-container"
          class="polka flex flex-col overflow-hidden antialiased w-full h-[100vh] dark:bg-black"
        >
          <div class="flex flex-col flex-1 h-0 md:flex-row md:items-stretch">
            <a-button>按钮</a-button>
          </div>
        </div>
      </a-config-provider>
    </a-style-provider>
  </div>
</template>
