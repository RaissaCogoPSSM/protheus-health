<template>
  <div class="shell">
    <AppSidebar />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
}
</style>
