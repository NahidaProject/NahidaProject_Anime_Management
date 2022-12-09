<template>
    <div>
        <a-tooltip title="新增语句" placement="right">
            <a-button @click="addyiyan()" type="dashed" shape="circle" size="large">
                <template #icon>
                    <plus-circle-two-tone />
                </template>
            </a-button>
        </a-tooltip>
        <a-input-group v-if="add" compact
            style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;padding: 20px 0;">
            <a-input v-model:value="Sentence" style="width: 60%;" />
            <a-input v-model:value="Origin" style="width: 30%;" />
            <a-button type="primary" @click="submit">提交</a-button>
        </a-input-group>
        <a-table :dataSource="YiYanList" :columns="columns" :pagination="{ pageSize: 6 }"/>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { PlusCircleTwoTone } from '@ant-design/icons-vue'
interface DataItem {
    Sentence: string,
    Origin: string,
}
const YiYanList: Ref<DataItem[]> = ref([])
const Sentence = ref<string>('');
const Origin = ref<string>('');
const add = ref<boolean>(false)
const columns = [
    {
        title: '一言',
        dataIndex: 'Sentence',
        key: 'Sentence',
        width: '50%',
    },
    {
        title: '来源',
        dataIndex: 'Origin',
        key: 'Origin',
    },
]
const getallyiyan = () => fetch('http://localhost:1314/api/YiYan/GetAllYiYan').then(res => res.json()).then(yiyan => {
    YiYanList.value = yiyan
})
getallyiyan()
const addyiyan = () => {
    add.value = !add.value
}
const submit = async() => {
    await fetch('http://localhost:1314/api/YiYan/NewYiYan', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            YiYanID: YiYanList.value.length+1,
            Sentence: Sentence.value, 
            Origin: Origin.value,
            AdminAccount: document.cookie.split('=')[1]
        })
    })
    getallyiyan()
    Sentence.value = ''
    Origin.value = ''
    add.value = !add.value
}
</script>

<style scoped>

</style>