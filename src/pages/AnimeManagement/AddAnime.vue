<template>
    <div class="container">
        <a-button type="primary" @click="showModal">新增</a-button>
        <a-modal class="modalclass" v-model:visible="visible" okText="确定" cancelText="取消" title="新增番剧" @ok="handleOk"
            :mask="false">
            <a-form :model="formState" name="validate_other" v-bind="formItemLayout">
                <a-form-item label="番剧id" name="AnimeID">
                    <a-input disabled v-model:value="formState.AnimeID" />
                </a-form-item>

                <a-form-item label="番剧名" name="AnimeName" :rules="[{ required: true, message: '请输入番剧名!' }]">
                    <a-input v-model:value="formState.AnimeName" />
                </a-form-item>

                <a-form-item name="AnimeReleaseDate" label="番剧发布日期" :rules="[{ required: true, message: '请选择番剧发布日期!' }]">
                    <a-date-picker :locale="locale" placeholder="年-月-日" v-model:value="formState.AnimeReleaseDate"
                        value-format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item label="番剧出品公司" name="AnimeCompany" :rules="[{ required: true, message: '请输入番剧出品公司!' }]">
                    <a-input v-model:value="formState.AnimeCompany" />
                </a-form-item>

                <a-form-item name="AnimeEpisode" label="已更新剧集" :rules="[{ required: true, message: '滑动选择已更新剧集!' }]">
                    <a-slider v-model:value="formState.AnimeEpisode" />
                </a-form-item>

                <a-form-item name="AnimeType" label="番剧类型[多选]" :rules="[{ type: 'array' }]">
                    <a-select v-model:value="formState['AnimeType']" mode="multiple" placeholder="番剧类型">
                        <a-select-option value="小说改">小说改</a-select-option>
                        <a-select-option value="魔法">魔法</a-select-option>
                        <a-select-option value="奇幻">奇幻</a-select-option>
                        <a-select-option value="架空">架空</a-select-option>
                        <a-select-option value="原创">原创</a-select-option>
                        <a-select-option value="战斗">战斗</a-select-option>
                        <a-select-option value="日常">日常</a-select-option>
                        <a-select-option value="喜剧">喜剧</a-select-option>
                        <a-select-option value="动画">动画</a-select-option>
                        <a-select-option value="校园">校园</a-select-option>
                        <a-select-option value="百合">百合</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="AnimeDescription" label="番剧描述" :rules="[{ required: true, message: '请输入番剧描述!' }]">
                    <a-textarea v-model:value="formState['AnimeDescription']" placeholder="输入番剧描述" :rows="4" />
                </a-form-item>

                <a-form-item name="AnimeHot" label="番剧热度" :rules="[{ required: true, message: '滑动选择番剧热度!' }]">
                    <a-slider v-model:value="formState.AnimeHot" />
                </a-form-item>

                <a-form-item label="番剧cv" name="CVName" :rules="[{ required: true, message: '请输入番剧cv!' }]">
                    <a-textarea v-model:value="formState['CVName']" placeholder="输入番剧cv" :rows="4" />
                </a-form-item>

                <a-form-item name="AnimeStats" label="番剧状态" has-feedback
                    :rules="[{ required: true, message: '请选择番剧状态!' }]">
                    <a-select v-model:value="formState.AnimeStats" placeholder="选择番剧状态">
                        <a-select-option value="连载中">连载中</a-select-option>
                        <a-select-option value="已完结">已完结</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="AnimeLanguage" label="语言" has-feedback :rules="[{ required: true, message: '请选择番剧语言!' }]">
                    <a-select v-model:value="formState.AnimeLanguage" placeholder="选择番剧语言">
                        <a-select-option value="粤语">粤语</a-select-option>
                        <a-select-option value="国语">国语</a-select-option>
                        <a-select-option value="日语">日语</a-select-option>
                        <a-select-option value="英语">英语</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="AnimeRecommend" label="上推荐" :rules="[{ required: true, message: '请选择是否推荐!' }]">
                    <a-radio-group v-model:value="formState['AnimeRecommend']">
                        <a-radio value="true">是</a-radio>
                        <a-radio value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="番剧封面">
                    <a-form-item name="a_image" no-style>
                        <a-upload-dragger v-model:fileList="formState.dragger" :multiple="false" name="poster"
                            :action=posterAction>
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
        <a-modal v-model:visible="modalVisible" :title=dialogtitle :mask=false centered @ok="modalVisible = false"
            :width="500" :okText="'确定'" :cancelText="'取消'">
            {{ dialogreason }}
        </a-modal>
        <div class="animelist">
            <a-card class="acard" v-for="(item, index) in animeList" hoverable>
                <template #cover>
                    <div class="cover"
                        :style="{ 'background-image': 'url(http://localhost:1314/anime/main_image/' + (item['AnimeID']>=10?'0000'+item['AnimeID']:'00000'+item['AnimeID']) + '.png)' }">
                    </div>
                </template>
                <a-card-meta :title="item['AnimeName']" class="acardname">
                    <template #description>{{ item['AnimeStats'] }}</template>
                </a-card-meta>
            </a-card>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}
let formState = reactive<Record<string, any>>({})
const visible = ref<boolean>(false)
const animeList = ref([])
// 加载所有番剧
const loadAnime = () => fetch('http://localhost:1314/api/anime/GetAllAnimes').then(data => data.json()).then(anime => {
    animeList.value = anime
    formState['AnimeID']=animeList.value.length+1    
})
loadAnime()
const showModal = () => {
    visible.value = true
}
const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')
const modalVisible = ref<boolean>(false)
const posterAction = computed(()=>{
    return `http://localhost:1314/api/file/AnimePosterUpload/${formState['aid']}`
})
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const handleOk = () => {
    fetch('http://localhost:1314/api/anime/NewAnime', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            AnimeID: formState['AnimeID'],
            AnimeName: formState['AnimeName'],
            AnimeReleaseDate: formState['AnimeReleaseDate'],
            AnimeCompany: formState['AnimeCompany'],
            AnimeEpisode: formState['AnimeEpisode'],
            AnimeType: formState['AnimeType'].toString(),
            AnimeDescription: formState['AnimeDescription'],
            AnimeHot: formState['AnimeHot'],
            CVName: formState['CVName'],
            AnimeStats: formState['AnimeStats'],
            AnimeLanguage: formState['AnimeLanguage'],
            AnimeRecommend: formState['AnimeRecommend']
        })
    }).then(res => res.json()).then(message => {
         if (message !== 'SUCCESS') {
            dialogtitle.value = '失败'
            dialogreason.value = message
        } else {
            dialogtitle.value = '成功'
            dialogreason.value = '添加成功'
            formState = ({})
            loadAnime()
        }
        setModalVisible(true)
        visible.value = false
    })
}
</script>

<style>
.modalclass .ant-form-item-label>label,
.modalclass .ant-dropdown-link {
    color: black;
}

.ant-modal-content .ant-modal-body {
    height: 60vh;
    overflow-y: scroll;
}

.animelist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.acard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160px;
    margin: 10px;
}

.acardname {
    width: 120px;
}

.cover {
    width: 160px;
    height: 240px;
    background-size: cover;
    background-position: center;
}
</style>
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
</style>