<template>
    <div class="container">
        <a-form class="registerform" :model="formState" name="basic" :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                用户名:
                <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                密码:
                <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item name="role" :rules="[{ required: true, message: '请选择角色组!' }]">
                <div style="width: 90px;">
                    角色组:
                </div>
                <a-dropdown>
                    <a class="ant-dropdown-link" @click.prevent>
                        {{ currentrole }}
                        <DownOutlined />
                    </a>
                    <template #overlay>
                        <a-menu @click="onClick">
                            <a-menu-item key="1">Admin</a-menu-item>
                            <a-menu-item key="2">User</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">添加</a-button>
            </a-form-item>
        </a-form>
        <a-table :columns="columns" :data-source="fdata" :pagination="{ pageSize: 7 }">
            <template #headerCell="{ column }">
                <template v-if="column.key === 'username'">
                    <span>
                        用户名
                    </span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'username'">
                    <span>
                        {{ record.username }}
                    </span>
                </template>
                <template v-else-if="column.key === 'password'">
                    <span>
                        {{ record.password }}
                    </span>
                </template>
                <template v-else-if="column.key === 'role'">
                    <span>
                        {{ record.role }}
                    </span>
                </template>
            </template>
        </a-table>
        <a-modal v-model:visible="modalVisible" :title=dialogtitle :mask=false centered @ok="modalVisible = false"
            :width="500" :okText="'确定'" :cancelText="'取消'">
            {{ dialogreason }}
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
interface FormState {
    username: string;
    password: string;
    role: string
}
const formState = reactive<FormState>({
    username: '',
    password: '',
    role: 'User'
})
const currentrole = ref<string>('User')
const modalVisible = ref<boolean>(false);
const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')
const users = ref<string>()
const columns = [
    {
        name: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true
    },
    {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
        ellipsis: true
    },
    {
        title: '角色组',
        dataIndex: 'role',
        key: 'role',
        ellipsis: true
    }
]
let fdata = ref([])

const loadUsers = () => fetch('http://localhost:1314/api/getAllUsers').then(req => req.json()).then(data => {
    fdata.value = data
})
loadUsers()
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}

const onFinish = (values: any) => {
    fetch('http://localhost:1314/api/register', {
        method: 'POST',
        credentials: 'omit',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
        }),
        body: new URLSearchParams([['username', values.username], ['password', values.password], ['role', values.role]]).toString()
    }).then(res => res.text()).then(message => {
        if (message !== 'Success') {
            dialogtitle.value = '失败'
            dialogreason.value = '该用户已存在'
        } else {
            dialogtitle.value = '成功'
            dialogreason.value = '注册成功'
            loadUsers()
        }
        setModalVisible(true)
        fetch('http://localhost:1314/api/getAllUsers').then(req => req.text()).then(data => {
            users.value = data
        })
    })
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
}

const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
        case '1':
            currentrole.value = 'Admin'
            formState.role = 'Admin'
            break;
        case '2':
            currentrole.value = 'User'
            formState.role = 'User'
            break;
        default:
            break;
    }
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

.registerform {
    display: flex;
    justify-content: center;
    align-items: center;
}

.ant-form-item-label>label,
.ant-dropdown-link {
    color: black;
}

.ant-input,
.ant-input-password {
    width: 200px;
}
</style>