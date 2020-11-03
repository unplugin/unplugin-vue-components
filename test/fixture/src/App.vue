<template>
  <ComponentA msg="a" />
  <component-b msg="b" />
  <ComponentC msg="c" />
  <recursive :data="tree" />
  <Book />
  <!-- If you allow Folder Names uncomment these Components -->
  <Avatar />
  <Uibutton />
</template>

<script setup lang='ts'>
import { ref } from 'vue';

export const tree = ref({
    label: 'Top Level',
    children: [
        { label: 'First Level' },
        { label: 'First Level', children: [{ label: 'Second Level' }] },
    ],
});
</script>
