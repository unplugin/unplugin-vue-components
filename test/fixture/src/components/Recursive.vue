<template>
  <div>
    <div>{{ data.label }}</div>
    <div class="child">
      <recursive v-for="item in data.children" :data="item" />
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
