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
                <template v-else-if="column.key === 'Update'">
                    <a-tooltip title="修改用户资料">
                        <a-button @click="ClickUser(record)" type="dashed" shape="circle">
                            <template #icon>
                                <edit-two-tone />
                            </template>
                        </a-button>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
        <a-modal :mask="false" v-model:visible="visible" title="修改用户资料" @ok="handleOk" @cancel="handleCancel"
            cancelText="取消" okText="确定">
            <a-form class="updateuserform" :model="formState" name="basic" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }" autocomplete="off">
                <a-form-item label="ID" name="UserID">
                    <a-input disabled v-model:value="formState.UserID" />
                </a-form-item>

                <a-form-item label="注册日期" name="UserRegisterDate">
                    <a-input disabled v-model:value="formState.UserRegisterDate" />
                </a-form-item>

                <a-form-item label="用户名" name="UserName" :rules="[{ required: true, message: '用户名为必填项!' }]">
                    <a-input v-model:value="formState.UserName" />
                </a-form-item>

                <a-form-item label="账号" name="UserAccount" :rules="[{ required: true, message: '账号为必填项!' }]">
                    <a-input v-model:value="formState.UserAccount" />
                </a-form-item>

                <a-form-item label="邮箱" name="UserEmail" :rules="[{ required: true, message: '邮箱为必填项!' }]">
                    <a-input v-model:value="formState.UserEmail" />
                </a-form-item>

                <a-form-item label="密码" name="UserPassword" :rules="[{ required: true, message: '密码为必填项!' }]">
                    <a-input v-model:value="formState.UserPassword" />
                </a-form-item>

                <a-form-item label="简介" name="UserDescription" :rules="[{ required: true, message: '用户简介为必填项!' }]">
                    <a-textarea v-model:value="formState.UserDescription" />
                </a-form-item>

                <a-form-item label="性别" name="UserGender" :rules="[{ required: true, message: '性别为必填项!' }]">
                    <a-dropdown>
                        <a class="ant-dropdown-link" @click.prevent>
                            {{ currentsex }}
                            <DownOutlined />
                        </a>
                        <template #overlay>
                            <a-menu @click="onSexClick">
                                <a-menu-item key="1">男</a-menu-item>
                                <a-menu-item key="0">女</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { EditTwoTone, DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue';
const visible = ref<boolean>(false);
const showModal = () => {
    visible.value = true;
};

const currentsex = ref<string>('')

interface FormState {
    UserID: string;
    UserName: string;
    UserPassword: string;
    UserAccount: string;
    UserEmail: string;
    UserDescription: string;
    UserRegisterDate: string;
    UserGender: string
}
let formState = reactive<FormState>({
    UserID: '',
    UserName: '',
    UserPassword: '',
    UserAccount: '',
    UserEmail: '',
    UserDescription: '',
    UserRegisterDate: '',
    UserGender: ''
});
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
        title: '修改',
        key: 'Update'
    }
]
// 加载所有用户
let fdata = ref([])
const loadUsers = () => fetch('http://localhost:1314/api/user/GetAllUsers').then(req => req.json()).then(data => {
    fdata.value = data
})
loadUsers()
// 获取点击的用户ID
const ClickUser = (record: any) => {
    formState = record
    currentsex.value = record['UserGender']
    showModal()
}
const handleOk = () => {
    fetch('http://localhost:1314/api/user/UpdateUser', {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(formState)
    }).then(res => res.json()).then(data => {
        if (data == 'SUCCESS') {
            visible.value = false
            loadUsers()
        } else {
            console.log(`ERROR${data}`)
        }
    })
};
const handleCancel = () => {
    console.log('点击了取消');
}
const onSexClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
        case '1':
            currentsex.value = '男'
            formState.UserGender = '男'
            break;
        case '0':
            currentsex.value = '女'
            formState.UserGender = '女'
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

.updateuserform {
    position: relative;
    left: -10%;
}
</style>