<template>
    <div class="container">
        <a-table :columns="columns" :data-source="fdata" :pagination="{ pageSize: 7 }">
            <template #headerCell="{ column }">
                <template v-if="column.key === 'UserName'">
                    <span>
                        用户名
                    </span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'UserName'">
                    <span>
                        {{ record.UserName }}
                    </span>
                </template>
                <template v-else-if="column.key === 'UserAccount'">
                    <span>
                        {{ record.UserAccount }}
                    </span>
                </template>
                <template v-else-if="column.key === 'UserEmail'">
                    <span>
                        {{ record.UserEmail }}
                    </span>
                </template>
                <template v-else-if="column.key === 'UserRegisterDate'">
                    <span>
                        {{ record.UserRegisterDate }}
                    </span>
                </template>
                <template v-else-if="column.key === 'delete'">
                    <a-tooltip title="删除用户">
                        <a-button @click="ClickUser(record)" type="dashed" shape="circle">
                            <template #icon>
                                <close-circle-two-tone two-tone-color="#eb2f96" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
    </div>
    <a-modal v-model:visible="modalVisible" title="提示" :mask=false centered @ok="DeleteUser" :width="500" :okText="'确定'"
        :cancelText="'取消'">
        确定删除这个用户吗?
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CloseCircleTwoTone } from '@ant-design/icons-vue'
const modalVisible = ref<boolean>(false);
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const columns = [
    {
        name: '用户名',
        dataIndex: 'UserName',
        key: 'UserName',
        ellipsis: true
    },
    {
        title: '账号',
        dataIndex: 'UserAccount',
        key: 'UserAccount',
        ellipsis: true
    },
    {
        title: '邮箱',
        dataIndex: 'UserEmail',
        key: 'UserEmail',
        ellipsis: true
    },
    {
        title: '注册日期',
        dataIndex: 'UserRegisterDate',
        key: 'UserRegisterDate',
        ellipsis: true
    },
    {
        title: '删除',
        key: 'delete'
    }
]
let fdata = ref([])

const loadUsers = () => fetch('http://localhost:1314/api/user/GetAllUsers').then(req => req.json()).then(data => {
    fdata.value = data
})
loadUsers()
// 获取点击的用户ID
const toDeleteUserID = ref('')
const ClickUser = (record: any) => {
    toDeleteUserID.value = record['UserID']
    setModalVisible(true)
}
const DeleteUser = () => {
    fetch('http://localhost:1314/api/user/DeleteUser', {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            UserID: toDeleteUserID.value
        })
    }).then(res => res.json()).then(data => {
        if (data === 'SUCCESS') {
            loadUsers()
            setModalVisible(false)
        }
    })
}
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