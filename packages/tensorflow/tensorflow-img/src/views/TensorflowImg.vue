<template>
  <div class="tensorflow-img">
    <Upload
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :beforeUpload="beforeUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="img" alt="avatar" id="imgSelf" />
      <div v-else>
        <LoadingOutlined v-if="loading"></LoadingOutlined>
        <PlusOutlined v-else></PlusOutlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </Upload>
    <Button class="mb-20" type="primary" @click="jumpImg">识别图片</Button>
    <Divider>可能性报告</Divider>
    <List class="list" item-layout="horizontal" :data-source="results">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta
            :description="`可能性:${Math.round(item.probability * 100)}%`"
          >
            <template #title>
              <span>{{ item.className }}</span>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import mobilenet from '@tensorflow-models/mobilenet';
import {
  Button, Upload, message, List, ListItem, ListItemMeta,
  Divider,
} from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { getBase64 } from '../lib/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mobilenet = require('@tensorflow-models/mobilenet');

@Options({
  name: 'TensorflowImg',
  components: {
    Button,
    Upload,
    List,
    ListItem,
    ListItemMeta,
    Divider,
    LoadingOutlined,
    PlusOutlined,
  },
})
export default class TensorflowImg extends Vue {
  model: any;

  fileList: any[] = [];

  loading = false

  imageUrl = ''; // 图片地址

  options = {
    version: 2,
    alpha: 0.5,
  }; // 默认参数

  results = []; // 检测结果

  async mounted() {
    console.log('mobilenet-------: ', mobilenet);
    const model = await mobilenet.load(this.options);
    console.log('model--------: ', model);
    this.model = model;
  }

  // 判断图片
  async jumpImg() {
    const img = document.getElementById('imgSelf');
    if (!img) {
      message.error('请先选择图片!');
      return;
    }
    const predictions = await this.model.classify(img);
    console.log('predictions----: ', predictions);
    this.results = predictions || [];
  }

  beforeUpload(file: any) {
    console.log('file', file);
    getBase64(file, (base64Url: string) => {
      this.imageUrl = base64Url;
      this.loading = false;
    });
    return false;
  }

  handleChange(info) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (base64Url: string) => {
        this.imageUrl = base64Url;
        this.loading = false;
      });
    }
    if (info.file.status === 'error') {
      this.loading = false;
      message.error('upload error');
    }
  }
}
</script>

<style lang="less" scoped>
.tensorflow-img{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  .avatar-uploader{
    max-width: 400px;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .img{
    width: 200px;
  }
  .list{
    width: 600px;
  }
  .mb-20{
    margin-bottom: 20px;
  }
}
</style>
