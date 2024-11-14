<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'
import { ElButton, ElMessage, ElCalendar, ElBacktop, ElImage } from 'element-plus'

const { page } = useData()

const count = ref(0)
const value = ref(new Date())

const url =
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const open = () => {
  ElMessage.success('this is a message.')
}
</script>

<template>
  <p>The count is: {{ count }}</p>
  <p>The page is: {{ page }}</p>
  <div class="contaniner">
    <button class="button" @click="count++">Increment</button>
  </div>
  <!-- 使用elementPlus组件 -->
  <el-button type="primary" @click="open" style="margin-bottom: 15px;">我是 ElButton</el-button>
  <!-- 展示图片 -->
  <p>图片预览</p>
  <el-image :src="url" fit="cover" :preview-src-list="srcList"/>
</template>

<style lang="less">
.contaniner {
  margin-bottom: 20px;
  .button {
    color: red !important;
    font-weight: bold;
  }
}
</style>