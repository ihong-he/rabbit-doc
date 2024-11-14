<script setup>
import { computed, ref } from 'vue'
import { ElImage } from 'element-plus'
const props = defineProps({
    imgArr: {
        type: Array,
        default: () => []
    },
    index: {
        type: Number,
        default: 0
    }
})
console.log('location-->', window.location.origin)
// 图片预览功能
const origin = ref(window.location.origin + '/rabbit-doc/note/');

// 计算属性，用于生成新的图片数组
const newImgArr = computed(() => {
    // 遍历传入的图片数组，为每个图片路径添加原始路径前缀
    return props.imgArr.map(item => {
        // 将原始路径与图片路径拼接，形成新的图片路径
        return origin.value + item
    })
})
</script>

<template>
    <div class="image-view">
        <el-image :src="newImgArr[index]" :preview-src-list="newImgArr" :fit="'contain'"
            style="width: 100%; height: 100%;" :initial-index="index"/>

    </div>
</template>