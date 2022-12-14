<template>
    <div class="container">
        <a-button type="primary" @click="showModal">新增</a-button>
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
            </template>
        </a-table>
        <a-modal :mask="false" v-model:visible="visible" title="新增资讯" @ok="handleOk" @cancel="handleCancel"
            cancelText="取消" okText="确定">
            <a-form class="newnewsform" :model="formState" name="basic" :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }" autocomplete="off">
                <a-form-item label="资讯标题" name="NewsTitle" :rules="[{ required: true, message: '资讯标题为必填项!' }]">
                    <a-input v-model:value="formState.NewsTitle" />
                </a-form-item>

                <a-form-item label="类型" name="NewsCategory" :rules="[{ required: true, message: '类型为必填项!' }]">
                    <a-input v-model:value="formState.NewsCategory" />
                </a-form-item>

                <a-form-item label="阅读数" name="NewsViewCount" :rules="[{ required: true, message: '阅读数为必填项!' }]">
                    <a-input-number v-model:value="formState.NewsViewCount" :keyboard="true" :min="1" />
                </a-form-item>

                <a-form-item label="详细" name="NewsContent" :rules="[{ required: true, message: '详细为必填项!' }]">
                    <a-textarea :rows="14" v-model:value="formState.NewsContent" />
                </a-form-item>

                <a-form-item label="资讯封面">
                    <a-form-item name="newsImage" no-style>
                        <a-upload-dragger v-model:fileList="formState.dragger" :multiple="false" name="image"
                            :action=ImageAction>
                            <p class="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p class="ant-upload-text">点击或拖入图片</p>
                            <p class="ant-upload-hint">上传单张图片即可</p>
                        </a-upload-dragger>
                    </a-form-item>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue'
const visible = ref<boolean>(false);
const showModal = () => {
    visible.value = true;
};
const ImageAction = computed(() => {
    return `http://localhost:1314/api/file/NewsImageUpload/${fdata.value.length + 1}`
})
let formState = reactive<Record<string, any>>({})
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
    }
]

let fdata = ref([])
const adminName = ref<string>('')

fetch(`http://localhost:1314/api/admin/${document.cookie.split('=')[1]}`).then(data => data.json()).then(res => {
    adminName.value = res
})

const loadNews = () => fetch('http://localhost:1314/api/news/GetAllNews').then(req => req.json()).then(data => {
    fdata.value = data
})
loadNews()
const handleOk = () => {
    const date = new Date()
    formState['NewsID'] = fdata.value.length + 1
    formState['NewsAuthor'] = adminName.value
    formState['NewsDate'] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(formState);
    fetch('http://localhost:1314/api/news/NewNews', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify(formState)
    }).then(res => res.json()).then(data => {
        if (data == 'SUCCESS') {
            visible.value = false
            loadNews()
        } else {
            console.log(`ERROR${data}`)
        }
    })
};
const handleCancel = () => {
    console.log('点击了取消');

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

.newnewsform {
    position: relative;
    left: -10%;
}
</style>