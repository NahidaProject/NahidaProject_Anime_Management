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
                <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
                    <a-checkbox style="color: white;" v-model:checked="formState.remember">记住我</a-checkbox>
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
    </div>
    <a-modal v-model:visible="modalVisible" title=登录失败 :mask=false centered @ok="modalVisible = false" :width="500"
        :okText="'确定'" :cancelText="'取消'">
        用户名或密码错误
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import router from '../../router/router';
interface FormState {
    username: string;
    password: string;
    remember: boolean;
}
const formState = reactive<FormState>({
    username: '',
    password: '',
    remember: true,
});
const modalVisible = ref<boolean>(false);

const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const onFinish = (values: any) => {
    fetch('http://localhost:1314/api/login', {
        method: 'POST',
        credentials: 'omit',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
        }),
        body: new URLSearchParams([['username', values.username], ['password', values.password]]).toString()
    }).then(res => res.text()).then(message => {
        if (message == 'Success') {
            router.push('/index')
        } else {
            setModalVisible(true)
        }
    })
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
.ant-form-item-label>label {
    color: white;
}
</style>