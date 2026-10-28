<template>
  <div class="master-detail">
    <UiCard class="list-pane">
      <slot name="list" />
    </UiCard>
    <UiCard class="detail-pane">
      <slot name="detail" />
    </UiCard>
  </div>
</template>

<style scoped>
.master-detail {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 16px;
  align-items: start;
}

.list-pane {
  padding: 8px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.detail-pane {
  padding: 22px 24px;
  min-height: calc(100vh - 160px);
}

@media (max-width: 860px) {
  .master-detail {
    grid-template-columns: 1fr;
  }
}
</style>
