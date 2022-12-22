<template>
    <div class="container">
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
                <div class="animeupdate">
                    <a-tooltip title="修改番剧详情">
                        <a-button @click="updateanime(item['AnimeID'])" type="dashed" shape="circle" size="large">
                            <template #icon>
                                <edit-two-tone />
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip title="新增剧集">
                        <a-button @click="uploadanime(item['AnimeID'])" type="dashed" shape="circle" size="large">
                            <template #icon>
                                <plus-circle-two-tone />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
            </a-card>
        </div>
        <a-modal class="modalclass" v-model:visible="visible" okText="确定" cancelText="取消" title="更新番剧" @ok="handleOk"
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
        <a-modal class="modalclass" v-model:visible="uploadVisible" okText="确定" cancelText="取消" title="新增剧集"
            @ok="videohandleOk" :mask="false">
            <a-upload-dragger v-model:fileList="videofileList" name="videos" :multiple="false"
                :action=videoAction @change="videohandleChange"
                @drop="videohandleDrop">
                <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                </p>
                <p class="ant-upload-text">确保已经修改了剧集后点击上传视频</p>
                <p class="ant-upload-text">格式要求: mp4</p>
            </a-upload-dragger>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { InboxOutlined, EditTwoTone, PlusCircleTwoTone } from '@ant-design/icons-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { message, UploadChangeParam } from 'ant-design-vue';
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}
let formState = reactive<Record<string, any>>({})
const visible = ref<boolean>(false)
const uploadVisible = ref<boolean>(false)
let videofileList = ref()
const videohandleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};
const videohandleDrop = (e: DragEvent) => {
    console.log(e);
}
const animeList = ref([])
const loadAnime = () => fetch('http://localhost:1314/api/anime/GetAllAnimes').then(data => data.json()).then(anime => {
    animeList.value = anime
})
loadAnime()
const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')
const modalVisible = ref<boolean>(false)
const posterAction = ref<string>('')
const videoAction = ref<string>('')
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const videohandleOk = () => {
    uploadVisible.value = false
    videofileList = ref()
}
const handleOk = () => {
    fetch('http://localhost:1314/api/anime/UpdateAnime', {
        method: 'PUT',
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
            if(message.status==500){
                dialogreason.value = '声优不存在, 请前往添加'
            }else{
                dialogreason.value = message
            }
        } else {
            dialogtitle.value = '成功'
            dialogreason.value = '更新成功'
            formState = ({})
            loadAnime()
        }
        setModalVisible(true)
        visible.value = false
    })
}

const updateanime = async (aid: string) => {
    await fetch(`http://localhost:1314/api/anime/GetAnimeByID/${aid}`, {
        method: 'GET',
    }).then(data => data.json()).then(anime => {
        posterAction.value=`http://localhost:1314/api/file/AnimePosterUpload/${aid}`
        const _a_type: string = anime['AnimeType']
        anime['AnimeType'] = _a_type.split(',')
        if (anime['arecommend']) {
            anime['arecommend'] = "true"
        } else {
            anime['arecommend'] = "false"
        }
        formState = anime
    })
    visible.value = true
}

const uploadanime = (a_id:string) => {
    videoAction.value = `http://localhost:1314/api/file/AnimeVideosUpload/${a_id}`
    uploadVisible.value = true
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
</style>
<style scoped>
.animeupdate {
    display: flex;
    justify-content: space-around;
    padding-top: 20px;
}
</style>