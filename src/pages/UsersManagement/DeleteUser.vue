<template>
  <div class="container">
    <a-table bordered :data-source="dataSource" :columns="columns" :pagination="{ pageSize: 7 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm v-if="dataSource.length" ok-text="确定" cancel-text="取消" title="确认删除该用户?"
            @confirm="onDelete(record.username)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

interface DataItem {
  id: string;
  username: string;
  password: string;
  role: string;
}
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    ellipsis: true
  },
  {
    title: '密码',
    dataIndex: 'username',
    ellipsis: true
  },
  {
    title: '用户组',
    dataIndex: 'role',
    ellipsis: true
  },
  {
    title: '删除',
    dataIndex: 'operation',
  },
]
const dataSource: Ref<DataItem[]> = ref([])

const onDelete = (username: string) => {
  fetch('http://localhost:1314/api/delete', {
    method: 'POST',
    credentials: 'omit',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    }),
    body: new URLSearchParams([['username', username]]).toString()
  }).then(res => res.text()).then(message => {
    if (message == 'Success') {
      loadUsers()
    }
  })
}

const loadUsers = () => fetch('http://localhost:1314/api/getAllUsers').then(req => req.json()).then(data => {
  dataSource.value = data
})
loadUsers()
</script>

<style scoped>
.container {
  width: 650px;
  height: 600px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>