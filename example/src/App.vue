<template>
  <div class="block">
    <h1>Basic (4)</h1>
    <ComponentA msg="a" />
    <component-b msg="b" />
    <ComponentC msg="c" />
    <ComponentD />
    <h1>SVG Component (2)</h1>
    <SvgComponent />
    <img src="./components/svg-component.svg" alt="">
    <h3>Recursive Components</h3>
    <recursive :data="tree" />
  </div>

  <div class="block">
    <h1>Namespaced (4)</h1>
    <!-- Index -->
    <Book />
    <UiButton />
    <UiNestedCheckbox />
    <!-- Global -->
    <Avatar />
  </div>

  <div class="block">
    <h1>Markdown (2)</h1>
    <MarkdownA />
    <MarkdownB />
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'

const tree = ref({
  label: 'Top Level',
  children: [
    { label: 'First Level' },
    { label: 'First Level', children: [{ label: 'Second Level' }] },
  ],
})
</script>

<style scoped>
.block {
  padding: 0px 20px 10px 20px;
  margin: 20px 20px;
  border: 1px solid #888;
  border-radius: 5px;
}
</style>
