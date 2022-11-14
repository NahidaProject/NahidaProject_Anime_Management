<template>
    <a-layout>
        <a-layout-header class="header">
            <div class="logo" />
            <span class="title">Anime</span>
            <a-popover placement="bottomRight">
                <template #content>
                    <p>退出登录</p>
                </template>
                <template #title>
                    <span>你好 {{ username }}</span>
                </template>
                <a-avatar style="z-index: 999;">{{ username.substring(0, 1).toUpperCase() }}</a-avatar>
            </a-popover>
            <div class="cover" data-tauri-drag-region></div>
            <div class="close">
                <down-circle-filled style="font-size:3em" @click="handleMin" />
                <up-circle-filled style="font-size:3em" @click="handleMax" v-if="!appWindowStatus" />
                <stop-filled style="font-size:3em" @click="handleMax" v-else />
                <close-circle-two-tone style="font-size:3em" @click="handleClose" />
            </div>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="user-select: none;">
                <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline"
                    :style="{ height: '100%' }">
                    <a-menu-item key="0" class="dashboard">
                        <template #icon>
                            <PieChartOutlined />
                        </template>
                        <span>仪表板</span>
                    </a-menu-item>
                    <a-sub-menu key="sub1">
                        <template #title>
                            <span>
                                <user-outlined />
                                用户管理
                            </span>
                        </template>
                        <a-menu-item key="1">新增用户</a-menu-item>
                        <a-menu-item key="2">删除用户</a-menu-item>
                        <a-menu-item key="3">信息修改</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub2">
                        <template #title>
                            <span>
                                <SlackOutlined />
                                番剧管理
                            </span>
                        </template>
                        <a-menu-item key="4">所有番剧</a-menu-item>
                        <a-menu-item key="5">新增番剧</a-menu-item>
                        <a-menu-item key="6">更新番剧</a-menu-item>
                        <a-menu-item key="7">删除番剧</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub3">
                        <template #title>
                            <span>
                                <EditOutlined />
                                留言管理
                            </span>
                        </template>
                        <a-menu-item key="8">所有留言</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-content :style="{ margin: '10px', minHeight: minheight }">
                    <Dashboard v-if="selectedKeys2.toLocaleString() == '0'"></Dashboard>
                    <AddUser v-if="selectedKeys2.toLocaleString() == '1'"></AddUser>
                    <DeleteUser v-if="selectedKeys2.toLocaleString() == '2'"></DeleteUser>
                    <UpdateUser v-if="selectedKeys2.toLocaleString() == '3'"></UpdateUser>
                    <AllAnime v-if="selectedKeys2.toLocaleString() == '4'"></AllAnime>
                    <AddAnime v-if="selectedKeys2.toLocaleString() == '5'"></AddAnime>
                    <UpdateAnime v-if="selectedKeys2.toLocaleString() == '6'"></UpdateAnime>
                    <DeleteAnime v-if="selectedKeys2.toLocaleString() == '7'"></DeleteAnime>
                    <MessageManagement v-if="selectedKeys2.toLocaleString() == '8'"></MessageManagement>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
import {
    UserOutlined,
    SlackOutlined,
    EditOutlined,
    PieChartOutlined,
    CloseCircleTwoTone,
    DownCircleFilled,
    UpCircleFilled,
    StopFilled
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { appWindow } from '@tauri-apps/api/window'
import Dashboard from '../Dashboard/Dashboard.vue'
import AddUser from '../UsersManagement/AddUser.vue'
import DeleteUser from '../UsersManagement/DeleteUser.vue'
import UpdateUser from '../UsersManagement/UpdateUser.vue'
import AllAnime from '../AnimeManagement/AllAnime.vue'
import AddAnime from '../AnimeManagement/AddAnime.vue'
import UpdateAnime from '../AnimeManagement/UpdateAnime.vue'
import DeleteAnime from '../AnimeManagement/DeleteAnime.vue'
import MessageManagement from '../MessageManagement/MessageManagement.vue'

// 默认子菜单
const selectedKeys2 = ref<string[]>(['0'])
// 默认菜单
const openKeys = ref<string[]>()
const username = ref<string>('baizhi958216')

// 窗口状态
const appWindowStatus = ref<boolean>(false)

const minheight = ref<string>('600px')
appWindow.onResized(async () => {
    if (await appWindow.isMaximized()) {
        minheight.value = (await appWindow.outerSize()).height - 110 + 'px'
    } else {
        minheight.value = (await appWindow.outerSize()).height - 100 + 'px'
    }
})

const handleMin = async () => {
    await appWindow.minimize()
}
const handleMax = async () => {
    if (appWindowStatus.value) {
        await appWindow.unmaximize()
        appWindowStatus.value = false
    } else {
        await appWindow.maximize()
        appWindowStatus.value = true
    }
}
const handleClose = async () => {
    await appWindow.close()
}
</script>
<style>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    width: 80vw;
    background: url(http://www.cilicili.cc/api/images/bg);
    background-position: center;
    background-size: cover;
}

.cover {
    position: absolute;
    width: 80vw;
    background-color: rgba(0, 0, 0, 0.141);
    height: 65px;
    left: 0;
    border-radius: 15px;
    z-index: 1;
}

.close {
    position: absolute;
    color: white;
    right: 0;
    width: 20vw;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 15px;
}

.header .logo,
.header .title {
    z-index: 999;
}

.header .logo {
    width: 130px;
    height: 70px;
    background-image: url(../../assets/Nahida.png);
    background-size: 100%;
    background-position: center;
}

.header .title {
    color: #fff;
    font-weight: 600;
    font-size: 30px;
}

.ant-layout {
    background: rgba(255, 255, 255, 0);
}

.header,
.ant-layout-content,
.ant-layout-sider,
.ant-layout-sider-children {
    border-radius: 15px;
}

.ant-menu {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
}

.ant-layout-has-sider {
    margin-top: 10px;
    border-radius: 15px;
    background-color: white;
}

.dashboard,
.dashboard::after {
    width: 80% !important;
    margin: 0 auto;
    border-radius: 20px;
    border-right: none !important;
}
</style>