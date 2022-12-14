<template>
    <div class="container">
        <a-table :columns="columns" :data-source="fdata" :pagination="{ pageSize: 7 }">
            <template #headerCell="{ column }">
                <template v-if="column.key === 'NewsTitle'">
                    <span>
                        资讯标题
                    </span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'NewsTitle'">
                    <span>
                        {{ record.NewsTitle }}
                    </span>
                </template>
                <template v-else-if="column.key === 'NewsCategory'">
                    <span>
                        {{ record.NewsCategory }}
                    </span>
                </template>
                <template v-else-if="column.key === 'NewsDate'">
                    <span>
                        {{ record.NewsDate }}
                    </span>
                </template>
                <template v-else-if="column.key === 'NewsContent'">
                    <span>
                        {{ record.NewsContent }}
                    </span>
                </template>
                <template v-else-if="column.key === 'delete'">
                    <a-tooltip title="删除资讯">
                        <a-button @click="ClickNews(record)" type="dashed" shape="circle">
                            <template #icon>
                                <close-circle-two-tone two-tone-color="#eb2f96" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
        <a-modal v-model:visible="modalVisible" title="提示" :mask=false centered @ok="DeleteNews" :width="500"
            :okText="'确定'" :cancelText="'取消'">
            确定删除这条资讯吗?
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CloseCircleTwoTone } from '@ant-design/icons-vue'
const modalVisible = ref<boolean>(false);
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const columns = [
    {
        name: '资讯标题',
        dataIndex: 'NewsTitle',
        key: 'NewsTitle',
        ellipsis: true
    },
    {
        title: '资讯类型',
        dataIndex: 'NewsCategory',
        key: 'NewsCategory',
        ellipsis: true
    },
    {
        title: '资讯日期',
        dataIndex: 'NewsDate',
        key: 'NewsDate',
        ellipsis: true
    },
    {
        title: '资讯详细',
        dataIndex: 'NewsContent',
        key: 'NewsContent',
        ellipsis: true
    },
    {
        title: '删除',
        key: 'delete'
    }
]

let fdata = ref([])

const loadNews = () => fetch('http://localhost:1314/api/news/GetAllNews').then(req => req.json()).then(data => {
    fdata.value = data
})
loadNews()

const toDeleteNewsID = ref('')
const ClickNews = (record: any) => {
    toDeleteNewsID.value = record['NewsID']
    setModalVisible(true)
}

const DeleteNews = () => {
    fetch('http://localhost:1314/api/news/DeleteNews', {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            NewsID: toDeleteNewsID.value
        })
    })
    setModalVisible(false)
};
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

.newnewsform {
    position: relative;
    left: -10%;
}
</style>