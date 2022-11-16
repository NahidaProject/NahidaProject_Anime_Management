<template>
    <div class="container">
        <a-table :dataSource="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="['username', 'password', 'role'].includes(column.dataIndex)">
                    <div>
                        <a-input v-if="editableData[record.id]"
                            v-model:value="editableData[record.id][column.dataIndex]" style="margin: -5px 0" />
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>

                <template v-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                        <span v-if="editableData[record.id]">
                            <a-typography-link @click="save(record.id)">保存</a-typography-link>
                            <a-popconfirm title="取消编辑吗?" @confirm="cancel(record.id)" ok-text="确定" cancel-text="取消">
                                <a>取消</a>
                            </a-popconfirm>
                        </span>
                        <span v-else>
                            <a @click="edit(record.id)">编辑</a>
                        </span>
                    </div>
                </template>
            </template>
        </a-table>
    </div>
    <a-modal v-model:visible="modalVisible" :title=dialogtitle :mask=false centered @ok="modalVisible = false"
        :width="500" :okText="'确定'" :cancelText="'取消'">
        {{ dialogreason }}
    </a-modal>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { reactive, ref } from 'vue';
const editableData: any = reactive({});
const modalVisible = ref<boolean>(false);
const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const columns = [
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: '25%',
    },
    {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
        width: '25%',
    },
    {
        title: '用户组',
        dataIndex: 'role',
        key: 'role',
        width: '15%',
    },
    {
        title: '编辑',
        dataIndex: 'operation',
        key: 'operation',
    }
]
interface DataItem {
    id: string;
    username: string;
    password: string;
    role: string;
}
const tbdata: DataItem[] = [];
const dataSource = ref(tbdata);

const save = (id: string) => {
    Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id]);
    const _data = editableData[id]
    fetch('http://localhost:1314/api/updateUser', {
        method: 'POST',
        credentials: 'omit',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
        }),
        body: new URLSearchParams([['id', _data.id], ['username', _data.username], ['password', _data.password], ['role', _data.role], ['currentUser', document.cookie.split('=')[1]]]).toString()
    }).then(req => req.text()).then(data => {
        if (data == 'Success') {
            dialogtitle.value = '成功'
            dialogreason.value = '修改成功!'
            delete editableData[id];
        } else {
            dialogtitle.value = '失败'
            dialogreason.value = '非法身份, 请联系管理员进行修改操作!'
        }
        setModalVisible(true)
    })
}
const edit = (id: string) => {
    editableData[id] = cloneDeep(dataSource.value.filter(item => id === item.id)[0]);
}
const cancel = (id: string) => {
    delete editableData[id];
    loadUsers()
}
const loadUsers = () => fetch('http://localhost:1314/api/getAllUsers').then(req => req.json()).then(data => {
    dataSource.value = data
})
loadUsers()
</script>

<style scoped>
.editable-row-operations a {
    margin-right: 8px;
}
</style>