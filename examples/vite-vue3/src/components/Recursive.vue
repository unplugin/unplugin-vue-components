<template>
  <div>
    <div>{{ data.label }}</div>
    <div class="child">
      <recursive v-for="(item, idx) in data.children" :key="idx" :data="item" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Recursive',
  props: {
    data: Object,
  },
}
</script>

<style>
.child {
  margin-left: 2rem;
}
</style>
