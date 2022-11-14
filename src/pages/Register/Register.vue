<template>
    <div class="container">
        <div class="logo" data-tauri-drag-region></div>
        <div class="loginform" data-tauri-drag-region>
            <!-- <div class="cover"></div> -->
            <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>
                <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
                <a-form-item label="角色组" name="role" :rules="[{ required: true, message: '请选择角色组!' }]">
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
                <div style="display: flex;justify-content: space-around;">
                    <a-form-item>
                        <a-button type="primary">
                            <router-link to="/">返回登录</router-link>
                        </a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit">注册</a-button>
                    </a-form-item>
                </div>
            </a-form>
        </div>
    </div>
    <a-modal v-model:visible="modalVisible" :title=dialogtitle :mask=false centered @ok="modalVisible = false"
        :width="500" :okText="'确定'" :cancelText="'取消'">
        {{ dialogreason }}
    </a-modal>
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
});
const currentrole = ref<string>('User')

const modalVisible = ref<boolean>(false);

const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')

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
        }
        setModalVisible(true)
    })
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
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
};
</script>

<style scoped>
.container {
    height: 100vh;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    user-select: none;
}

.container .loginform .cover {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.466);
    filter: blur(50%);
    height: 300px;
    width: 500px;
    border-radius: 14px;
}

.container .logo {
    background: url('../../assets/NahidaMain.png') no-repeat;
    background-position: center;
    background-size: 100%;
    width: 350px;
    height: 100vh;
    border-radius: 14px;
    z-index: 99;
}

.container .loginform {
    /* background: url(http://www.cilicili.cc/api/images/bg); */
    background: url('../../assets/Nahida.png');
    background-color: rgb(0, 0, 0);
    background-position: center;
    background-size: cover;
    height: 300px;
    width: 500px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    margin-left: -150px;
}
</style>
<style>
.ant-form-item-label>label,
.ant-dropdown-link {
    color: white;
}
</style>