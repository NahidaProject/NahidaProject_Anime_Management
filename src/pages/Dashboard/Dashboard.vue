<template>
    <div class="container">
        <a-badge-ribbon text="Nahida Anime后台管理系统">
            <div class="userinfo">
                <a-avatar :src="'http://localhost:1314/static/anime/userimage/' + username + '.jpg'"
                    :size="{ md: 200, lg: 300, xl: 300, xxl: 300 }">
                    <template #icon>
                        <AntDesignOutlined />
                    </template>
                </a-avatar>
                <span>{{ nowtimespan }}, {{ username }}</span>
                <div class="dash">
                    <div class="onlineusers">在线人数 {{ currentusers }}</div>
                    <div class="currenttime">现在是 {{ currenttime }}</div>
                </div>
            </div>
        </a-badge-ribbon>
        <div class="floor">
            <a-timeline>
                <a-timeline-item color="green">前端项目创建, 数据库用户表创建及前端布局实现 2022-11-11</a-timeline-item>
                <a-timeline-item color="green">后台管理系统前端界面基本实现 2022-11-13</a-timeline-item>
                <a-timeline-item color="green">后端实现用户数据库CRUD, 后台管理系统用户注册登录 2022-11-15</a-timeline-item>
                <a-timeline-item color="green">数据库动漫表创建, 后端动漫CRUD及前端渲染动漫剧集 2022-11-16</a-timeline-item>
                <a-timeline-item color="red">
                    <template #dot>
                        <clock-circle-outlined style="font-size: 16px" />
                    </template>
                    后端提供视频切片, 前端播放视频 2022-11-17
                </a-timeline-item>
                <a-timeline-item>留言板CRUD 2022-11-18</a-timeline-item>
                <a-timeline-item>项目完成 2022-11-19</a-timeline-item>
            </a-timeline>
            <div class="serverstat">
                <a-tooltip title="服务器状态" :color="status == 'success' ? 'green' : 'red'">
                    <a-progress type="circle" :percent="100" :width="80" :status="status" />
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ClockCircleOutlined, AntDesignOutlined } from '@ant-design/icons-vue';

const username = document.cookie.split('=')[1]
let nowtimespan = '你好'
const currenttime = ref('')
const currentusers = ref('2')
const time = new Date().getHours()
const status = ref('exception')
if (time >= 6 && time < 9) {
    nowtimespan = '早上好'
} else if (time >= 9 && time < 11) {
    nowtimespan = '上午好'
} else if (time >= 11 && time < 13) {
    nowtimespan = '中午好'
} else if (time >= 13 && time < 17) {
    nowtimespan = '下午好'
} else if (time >= 17 && time < 19) {
    nowtimespan = '傍晚好'
} else {
    nowtimespan = '晚上好'
}
setInterval(() => {
    status.value = 'success'
    currenttime.value = new Date().toString().split(' ')[4]
}, 1000)
</script>

<style scoped>
@font-face {
    font-family: misans;
    src: url(https://gitcode.net/xiaomi/misans/-/raw/master/MiSans-Normal.ttf) format('truetype');
}

.container {
    font-family: misans;
    padding-top: 20px;
}

.dash {
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-100%, -100%);
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;
    height: 50px;
}

.serverstat {
    position: absolute;
    left: 90%;
    top: 90%;
    transform: translate(-90%, -90%);
}

.userinfo {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 80%;
    font-size: 2.5em;
    user-select: none;
}

.floor {
    display: flex;
    margin-top: 30px;
    padding-top: 30px;
    border-top: thick double rgba(173, 173, 173, 0.384);
}
</style>