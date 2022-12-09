<template>
    <div class="container">
        <div class="animelist">
            <a-card class="acard" v-for="(item, index) in animeList" hoverable>
                <template #cover>
                    <div class="cover"
                        :style="{ 'background-image': 'url(http://localhost:1314/anime/main_image/' + (item['aid']>=10?'0000'+item['aid']:'00000'+item['aid']) + '.png)' }">
                    </div>
                </template>
                <a-card-meta :title="item['aname']" class="acardname">
                    <template #description>{{ item['astats'] }}</template>
                </a-card-meta>
                <div class="animedelete">
                    <a-tooltip title="删除番剧">
                        <a-button @click="clickanime(item['aid'])" type="dashed" shape="circle" size="large">
                            <template #icon>
                                <close-circle-two-tone two-tone-color="#eb2f96" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
            </a-card>
        </div>
    </div>
    <a-modal v-model:visible="modalVisible" title="提示" :mask=false centered @ok="deleteAnime" :width="500"
        :okText="'确定'" :cancelText="'取消'">
        确定删除这部番剧吗?
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseCircleTwoTone } from '@ant-design/icons-vue'
const modalVisible = ref<boolean>(false);
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const animeList = ref([])
const loadAnime = () => fetch('http://localhost:1314/api/anime/GetAllAnimes').then(data => data.json()).then(anime => {
    animeList.value = anime
})
loadAnime()
const toremoveid = ref('')

const clickanime = (aid: string) => {
    toremoveid.value = aid
    setModalVisible(true)
}
const deleteAnime = () => {
    modalVisible.value = false
    fetch('http://localhost:1314/api/anime/DeleteAnime', {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            aid: toremoveid.value
        })
    }).then(msg => msg.status).then(status => {
        if (status == 200) {
            loadAnime()
        }
    })
}
</script>

<style scoped>
.ant-card-body {
    width: 160px;
}

.container {
    overflow-y: scroll;
    height: 84vh;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
}

::-webkit-scrollbar-thumb {
    background-color: #8bc7ff;
    border-radius: 100px;
}
.animedelete{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
}
</style>