<template>
    <div class="container">
        <div class="animelist">
            <a-card @click="updateanime(item['a_id'])" class="acard" v-for="(item, index) in animeList" hoverable>
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
        <a-modal class="modalclass" v-model:visible="visible" okText="确定" cancelText="取消" title="更新番剧" @ok="handleOk"
            :mask="false">
            <a-form :model="formState" name="validate_other" v-bind="formItemLayout">
                <a-form-item label="番剧id" name="a_id" :rules="[{ required: true, message: '请输入番剧id!' }]">
                    <a-input disabled v-model:value="formState.a_id" />
                </a-form-item>

                <a-form-item label="番剧名" name="a_name" :rules="[{ required: true, message: '请输入番剧名!' }]">
                    <a-input v-model:value="formState.a_name" />
                </a-form-item>

                <a-form-item name="a_release_date" label="番剧发布日期" :rules="[{ required: true, message: '请选择番剧发布日期!' }]">
                    <a-date-picker :locale="locale" placeholder="年-月-日" v-model:value="formState.a_release_date"
                        value-format="YYYY-MM-DD" />
                </a-form-item>

                <a-form-item label="番剧出品公司" name="a_company" :rules="[{ required: true, message: '请输入番剧出品公司!' }]">
                    <a-input v-model:value="formState.a_company" />
                </a-form-item>

                <a-form-item name="a_set" label="已更新剧集" :rules="[{ required: true, message: '滑动选择已更新剧集!' }]">
                    <a-slider v-model:value="formState.a_set" />
                </a-form-item>

                <a-form-item name="a_type" label="番剧类型[多选]" :rules="[{ type: 'array' }]">
                    <a-select v-model:value="formState['a_type']" mode="multiple" placeholder="番剧类型">
                        <a-select-option value="小说改">小说改</a-select-option>
                        <a-select-option value="魔法">魔法</a-select-option>
                        <a-select-option value="奇幻">奇幻</a-select-option>
                        <a-select-option value="架空">架空</a-select-option>
                        <a-select-option value="原创">原创</a-select-option>
                        <a-select-option value="战斗">战斗</a-select-option>
                        <a-select-option value="日常">日常</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="a_desc" label="番剧描述" :rules="[{ required: true, message: '请输入番剧描述!' }]">
                    <a-textarea v-model:value="formState['a_desc']" placeholder="输入番剧描述" :rows="4" />
                </a-form-item>

                <a-form-item name="a_hot" label="番剧热度" :rules="[{ required: true, message: '滑动选择番剧热度!' }]">
                    <a-slider v-model:value="formState.a_hot" />
                </a-form-item>

                <a-form-item label="番剧cv" name="a_cv" :rules="[{ required: true, message: '请输入番剧cv!' }]">
                    <a-textarea v-model:value="formState['a_cv']" placeholder="输入番剧cv" :rows="4" />
                </a-form-item>

                <a-form-item name="a_stats" label="番剧状态" has-feedback
                    :rules="[{ required: true, message: '请选择番剧状态!' }]">
                    <a-select v-model:value="formState.a_stats" placeholder="选择番剧状态">
                        <a-select-option value="连载中">连载中</a-select-option>
                        <a-select-option value="已完结">已完结</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="a_lang" label="语言" has-feedback :rules="[{ required: true, message: '请选择番剧语言!' }]">
                    <a-select v-model:value="formState.a_lang" placeholder="选择番剧语言">
                        <a-select-option value="国语">国语</a-select-option>
                        <a-select-option value="日语">日语</a-select-option>
                        <a-select-option value="英语">英语</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="a_recommend" label="上推荐" :rules="[{ required: true, message: '请选择是否推荐!' }]">
                    <a-radio-group v-model:value="formState['a_recommend']">
                        <a-radio value="true">是</a-radio>
                        <a-radio value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="番剧封面">
                    <a-form-item name="a_image" no-style>
                        <a-upload-dragger v-model:fileList="formState.dragger" name="files" action="/upload.do">
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
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
}
let formState = reactive<Record<string, any>>({})
const visible = ref<boolean>(false)
const animeList = ref([])
const loadAnime = () => fetch('http://localhost:1314/api/getAllAnime').then(data => data.json()).then(anime => {
    animeList.value = anime
})
loadAnime()
const dialogtitle = ref<string>('')
const dialogreason = ref<string>('')
const modalVisible = ref<boolean>(false);
const setModalVisible = (visible: boolean) => {
    modalVisible.value = visible;
}
const handleOk = () => {
    fetch('http://localhost:1314/api/updateAnime', {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            a_id: formState['a_id'],
            a_name: formState['a_name'],
            a_release_date: formState['a_release_date'],
            a_company: formState['a_company'],
            a_set: formState['a_set'],
            a_type: formState['a_type'].toString(),
            a_desc: formState['a_desc'],
            a_hot: formState['a_hot'],
            a_cv: formState['a_cv'],
            a_stats: formState['a_stats'],
            a_lang: formState['a_lang'],
            a_recommend: formState['a_recommend']
        })
    }).then(res => res.text()).then(message => {
        if (message !== 'Success') {
            dialogtitle.value = '失败'
            dialogreason.value = '该番剧id已存在'
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

const updateanime = async (a_id: string) => {
    await fetch(`http://localhost:1314/api/getAnimeById/${a_id}`, {
        method: 'GET',
    }).then(data => data.json()).then(anime => {
        const _a_type: string = anime['a_type']
        anime['a_type'] = _a_type.split(',')
        if (anime['a_recommend']) {
            anime['a_recommend'] = "true"
        } else {
            anime['a_recommend'] = "false"
        }
        formState = anime
    })
    visible.value = true
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