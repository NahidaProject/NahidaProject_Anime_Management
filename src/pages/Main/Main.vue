<template>
    <a-layout>
        <a-layout-header data-tauri-drag-region class="header">
            <div class="logo" />
            <span class="title">Anime</span>
            <a-popover placement="bottomRight">
                <template #content>
                    <p>退出登录</p>
                </template>
                <template #title>
                    <span>你好 {{username}}</span>
                </template>
                <a-avatar>{{username.substring(0,1).toUpperCase()}}</a-avatar>
            </a-popover>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="background: #fff;">
                <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline"
                    :style="{ height: '100%', borderRight: 0 }">
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
                        <a-menu-item key="1">在线状态</a-menu-item>
                        <a-menu-item key="2">资料修改</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub2">
                        <template #title>
                            <span>
                                <SlackOutlined />
                                番剧管理
                            </span>
                        </template>
                        <a-menu-item key="3">所有番剧</a-menu-item>
                        <a-menu-item key="4">新增番剧</a-menu-item>
                        <a-menu-item key="5">更新番剧</a-menu-item>
                        <a-menu-item key="6">删除番剧</a-menu-item>
                    </a-sub-menu>
                    <a-sub-menu key="sub3">
                        <template #title>
                            <span>
                                <EditOutlined />
                                留言管理
                            </span>
                        </template>
                        <a-menu-item key="7">所有留言</a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '85vh' }">
                    <!-- Content -->
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
import { UserOutlined, SlackOutlined, EditOutlined, PieChartOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
// 默认子菜单
const selectedKeys2 = ref<string[]>(['0'])
// 默认菜单
const openKeys = ref<string[]>()
const username = ref<string>('baizhi958216')
</script>
<style>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(0, 0, 0);
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
.ant-layout{
    background: rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
}
.header,.ant-layout-content,.ant-layout-sider,.ant-layout-sider-children,.ant-menu{
    border-radius: 22px;
}
.dashboard,.dashboard::after{
    border-radius: 22px;
    border-right: none!important;;
}
</style>