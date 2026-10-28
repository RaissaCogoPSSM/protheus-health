<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 32" :height="size ?? 32" viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg">
    <circle cx="290" cy="290" r="290" fill="var(--accent)" />
    <circle cx="290" cy="290" r="232" fill="#fff" />
    <path
      d="M220 182 L220 232 L360 232 L360 182 L480 290 L360 398 L360 348 L220 348 L220 398 L100 290 Z"
      fill="var(--accent)"
    />
  </svg>
</template>
