<template>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">新增</a-button>
    <a-table :pagination="{ pageSize: 5 }" bordered :data-source="dataSource" :columns="columns">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'CVName'">
                <div class="editable-cell">
                    <div v-if="editableData[record.CVID]" class="editable-cell-input-wrapper">
                        <a-input v-model:value="editableData[record.CVID].CVName" @pressEnter="save(record.CVID)" />
                        <check-outlined class="editable-cell-icon-check" @click="save(record.CVID)" />
                    </div>
                    <div v-else class="editable-cell-text-wrapper">
                        {{ text || ' ' }}
                        <edit-outlined class="editable-cell-icon" @click="edit(record.CVID)" />
                    </div>
                </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
                <a-popconfirm v-if="dataSource.length" title="确定删除吗?" @confirm="onDelete(record.CVName)">
                    <a-tooltip title="删除CV">
                        <a-button type="dashed" shape="circle" size="large">
                            <template #icon>
                                <close-circle-two-tone two-tone-color="#eb2f96" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </template>
    </a-table>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import { CheckOutlined, EditOutlined, CloseCircleTwoTone } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';

interface DataItem {
    CVID: string;
    CVName: string;
}

const columns = [
    {
        title: '名字',
        dataIndex: 'CVName',
        width: '80%',
    },
    {
        title: '删除',
        dataIndex: 'operation',
    },
];
const dataSource: Ref<DataItem[]> = ref([]);
const count = computed(() => dataSource.value.length + 1);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

fetch('http://localhost:1314/api/animecv/GetAllCV').then(res => res.json()).then(data => {
    dataSource.value = data
})
const edit = (key: string) => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.CVID)[0]);
};
const save = (key: string) => {
    fetch('http://localhost:1314/api/animecv/AddCV', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            CVName: editableData[key].CVName
        })
    }).then(() => {
        Object.assign(dataSource.value.filter(item => key === item.CVID)[0], editableData[key]);
        delete editableData[key];
    })
};

const onDelete = (key: string) => {
    fetch('http://localhost:1314/api/animecv/DeleteCV', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            CVName: key
        })
    }).then(() => {
        dataSource.value = dataSource.value.filter(item => item.CVName !== key);
    })
};
const handleAdd = () => {
    const newData = {
        CVID: `${count.value}`,
        CVName: `CV名字`,
    };
    dataSource.value.unshift(newData);
};

</script>
<style lang="less">
.editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>