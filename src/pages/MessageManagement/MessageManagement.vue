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
            <a-input v-model:value="yiyan" style="width: 60%;" />
            <a-input v-model:value="fromwhere" style="width: 30%;" />
            <a-button type="primary" @click="submit">提交</a-button>
        </a-input-group>
        <a-table :dataSource="yiyanList" :columns="columns" />
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import { PlusCircleTwoTone } from '@ant-design/icons-vue'
interface DataItem {
    yiyan: string,
    fromwhere: string,
}
const yiyanList: Ref<DataItem[]> = ref([])
const yiyan = ref<string>('');
const fromwhere = ref<string>('');
const add = ref<boolean>(false)
const columns = [
    {
        title: '一言',
        dataIndex: 'yiyan',
        key: 'yiyan',
        width: '50%',
    },
    {
        title: '来源',
        dataIndex: 'fromwhere',
        key: 'fromwhere',
    },
]
const getallyiyan = () => fetch('http://localhost:1314/api/getallyiyan').then(res => res.json()).then(yiyan => {
    yiyanList.value = yiyan
})
getallyiyan()
const addyiyan = () => {
    add.value = !add.value
}
const submit = async() => {
    await fetch('http://localhost:1314/api/addyiyan', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json' // 指定提交方式为表单提交
        }),
        body: JSON.stringify({
            yiyan: yiyan.value,
            fromwhere: fromwhere.value
        })
    })
    getallyiyan()
    yiyan.value = ''
    fromwhere.value = ''
    add.value = !add.value
}
</script>

<style scoped>

</style>