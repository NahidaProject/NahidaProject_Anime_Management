<template>
    <div class="container">
        <div class="animelist">
            <a-card @click="clickanime(item['a_id'])" class="acard" v-for="(item, index) in animeList" hoverable>
                <template #cover>
                    <div class="cover"
                        :style="{ 'background-image': 'url(http://localhost:1314/anime/main_image/' + item['a_id'] + '.png)' }">
                    </div>
                </template>
                <a-card-meta :title="item['a_name']">
                    <template #description>{{ item['a_stats'] }}</template>
                </a-card-meta>
            </a-card>
        </div>
    </div>
    <a-modal v-model:visible="modalVisible" title="提示" :mask=false centered @ok="deleteAnime" :width="500" :okText="'确定'" :cancelText="'取消'">
        确定删除这部番剧吗?
    </a-modal>
</template>

<script setup lang="ts">import { ref } from 'vue';
const modalVisible = ref<boolean>(false);
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const animeList = ref([])
const loadAnime = () => fetch('http://localhost:1314/api/getAllAnime').then(data => data.json()).then(anime => {
    animeList.value = anime
})
loadAnime()
const toremoveid = ref('')

const clickanime = (a_id: string) => {
    toremoveid.value = a_id
    setModalVisible(true)
}
const deleteAnime = () => {
    modalVisible.value = false
    fetch('http://localhost:1314/api/deleteAnime', {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            a_id:toremoveid.value
        })
    }).then(msg => msg.status).then(status => {
        if (status == 200) {
            loadAnime()
        }
    })
}
</script>

<style scoped>
.animelist {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 30px;
}

.acard {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cover {
    width: 160px;
    height: 240px;
    background-size: cover;
    background-position: center;
}
</style>