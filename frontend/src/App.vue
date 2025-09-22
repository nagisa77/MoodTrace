<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink class="brand" to="/">MoodTrace</RouterLink>
      <nav class="app-nav">
        <RouterLink class="nav-link" to="/">日志列表</RouterLink>
        <RouterLink class="nav-link" to="/new">新建日志</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>保持好奇与温柔，慢慢感受每一次变化。</p>
    </footer>
  </div>
</template>
