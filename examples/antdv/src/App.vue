<template>
  <a-steps :current="1">
    <a-step>
      <!-- <span slot="title">Finished</span> -->
      <template #title>
        Finished
      </template>
      <template #description>
        <span>This is a description.</span>
      </template>
    </a-step>
    <a-step
      title="In Progress"
      sub-title="Left 00:00:08"
      description="This is a description."
    />
    <a-step title="Waiting" description="This is a description." />
  </a-steps>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Title"
    sub-title="This is a subtitle"
    @back="() => null"
  />
  <a-descriptions title="User Info">
    <a-descriptions-item label="UserName">
      Zhou Maomao
    </a-descriptions-item>
    <a-descriptions-item label="Telephone">
      1810000000
    </a-descriptions-item>
    <a-descriptions-item label="Live">
      Hangzhou, Zhejiang
    </a-descriptions-item>
    <a-descriptions-item label="Remark">
      empty
    </a-descriptions-item>
    <a-descriptions-item label="Address">
      No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
    </a-descriptions-item>
  </a-descriptions>
  <a-image-preview-group>
    <a-image :width="200" src="https://alicdn.antdv.com/vue.png" />
    <a-image :width="200" src="https://alicdn.antdv.com/logo.png" />
  </a-image-preview-group>

  <a-table :columns="columns" :data-source="data">
    <template #name="{ text }">
      <a>{{ text }}</a>
    </template>
    <template #customTitle>
      <span> Name </span>
    </template>
    <template #tags="{ text: tags }">
      <span>
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="
            tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'
          "
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
    </template>
    <template #action="{ record }">
      <span>
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions </a>
      </span>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const columns = ref([
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    slots: { customRender: 'tags' },
  },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' },
  },
])

const data = ref([
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
])
</script>
