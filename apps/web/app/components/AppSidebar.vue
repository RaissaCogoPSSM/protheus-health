<script setup lang="ts">
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const },
  { to: '/modulos', label: 'Módulos', icon: 'modules' as const },
  { to: '/rotinas', label: 'Rotinas AdvPL', icon: 'routines' as const },
  { to: '/base-conhecimento', label: 'Base de Conhecimento', icon: 'knowledge' as const },
  { to: '/jobs', label: 'Jobs', icon: 'jobs' as const },
  { to: '/integracoes', label: 'Integrações', icon: 'integrations' as const },
  { to: '/chamados', label: 'Chamados', icon: 'tickets' as const }
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <AppLogo :size="30" />
      <div class="brand-text">
        <strong>Protheus Hub</strong>
        <span>Porto Seco MG · Protheus 12</span>
      </div>
    </div>

    <nav class="nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        active-class="is-active"
      >
        <NavIcon :name="item.icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--border);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.brand-text strong {
  font-size: 14px;
  color: var(--ink);
}

.brand-text span {
  font-size: 11px;
  color: var(--ink-faint);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: background 0.12s ease, color 0.12s ease;
}

.nav-item:hover {
  background: var(--bg);
  color: var(--ink);
}

.nav-item.is-active {
  background: var(--accent-soft);
  color: var(--accent-strong);
}
</style>
