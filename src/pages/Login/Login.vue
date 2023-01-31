<template>
    <div class="container">
        <div class="logo" data-tauri-drag-region></div>
        <div class="loginform" data-tauri-drag-region>
            <!-- <div class="cover"></div> -->
            <a-form class="login" :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="账号" name="AdminAccount" :rules="[{ required: true, message: '请输入用户账号!' }]">
                    <a-input v-model:value="formState.AdminAccount" />
                </a-form-item>
                <a-form-item label="密码" name="AdminPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                    <a-input-password v-model:value="formState.AdminPassword" />
                </a-form-item>
                <div style="display: flex;justify-content: space-around;">
                    <a-form-item>
                        <a-button type="primary">
                            <router-link to="/register">注册</router-link>
                        </a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit">登录</a-button>
                    </a-form-item>
                </div>
            </a-form>
        </div>
        <close-circle-two-tone :style="{ fontSize: '50px' }" @click="handleClose" />
    </div>
    <a-modal v-model:visible="modalVisible" title=登录失败 :mask=false centered @ok="modalVisible = false" :width="500"
        :okText="'确定'" :cancelText="'取消'">
        用户名或密码错误
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CloseCircleTwoTone } from '@ant-design/icons-vue'
import { appWindow, getAll, WebviewWindow } from '@tauri-apps/api/window';
interface FormState {
    AdminAccount: string;
    AdminPassword: string;
}
const formState = reactive<FormState>({
    AdminAccount: '',
    AdminPassword: '',
})
const modalVisible = ref<boolean>(false);

const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}

const onFinish = (values: { AdminAccount: string; AdminPassword: string }) => {
    fetch('http://localhost:1314/api/admin/admin_login', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            AdminAccount: values.AdminAccount,
            AdminPassword: values.AdminPassword
        })
    }).then(res => res.json()).then(message => {
        if (message == 'SUCCESS') {
            document.cookie = `AdminAccount=${formState.AdminAccount.trim()}`
            let toIndex = new WebviewWindow('/index',{
                url: '/index',
                title: 'NahidaProject动漫后台管理系统',
                minWidth: 900,
                minHeight: 700,
                resizable: true,
                center: true,
                transparent: true,
                decorations:false
            })
            toIndex.once('tauri://created',()=>{
                if(getAll().find(w=>w.label==='login')){
                    getAll().find(w=>w.label==='login')?.close()
                }
            })
        } else {
            setModalVisible(true)
        }
    })
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
}

const handleClose = async () => {
    await appWindow.close()
}
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
    background-color: black;
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
.login .ant-form-item-label>label {
    color: white
}
</style>