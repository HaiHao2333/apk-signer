<script setup>
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {onMounted, reactive} from "vue";

// 这里将上传的配置信息存储为json文件

const onSubmit = () => {
// 将对象转换为JSON字符串
  const jsonString = JSON.stringify(form);
  ipc.invoke(ipcApiRoute.saveSettings, jsonString)
      .then(res => {
        console.log('res:', res);
      })
      .catch(error => {
        console.error(error);
      });

}


let form = reactive({
  keyFileName: '',
  keyPassword: '',
  keyAlias: '',
  storePassword: '',
})


const index = 1;

const readSettingConfigs = () => {
  ipc.invoke(ipcApiRoute.readSettings)
      .then(res => {
        const settings = JSON.parse(res);
        // 将读取到的设置赋值给响应式对象的属性
        form.keyFileName = settings.keyFileName;
        form.keyPassword = settings.keyPassword;
        form.keyAlias = settings.keyAlias;
        form.storePassword = settings.storePassword;

        console.log("readSettings from:", form);
      })
      .catch(error => {
        console.error(error);
      });
}

onMounted(() => readSettingConfigs())

const uploadKeyFile = (file) => {
  const filePath = file.raw.path;
  const fileName = file.name;
  form.keyFileName = fileName;
  const serializedObject = JSON.stringify({filePath, fileName});
  // 发送消息给主进程，请求保存文件操作
  // 1. 文件上传
  ipc.invoke(ipcApiRoute.uploadFile, serializedObject)
      .then(res => {
        console.log('res:', res);
      })
      .catch(error => {
        console.error(error);
      });

}
// 进入界面加载配置

</script>

<template>
  <el-upload
      class="upload-demo"
      drag
      action=""
      :on-change="uploadKeyFile"
      :auto-upload="false"
  >
    <el-icon class="el-icon--upload">
    </el-icon>
    <div class="el-upload__tip">
      将签名文件拖拽到此处
    </div>
    <div class="el-upload__text">
      点击这里 <em>点击这里上传</em>
    </div>
  </el-upload>
  <el-form :model="form" label-width="120px">
    <el-form-item label="秘钥密码">
      <el-input v-model="form.storePassword"/>
    </el-form-item>
    <el-form-item label="秘钥别名">
      <el-input v-model="form.keyAlias"/>
    </el-form-item>
    <el-form-item label="秘钥别名密码">
      <el-input v-model="form.keyPassword"/>
    </el-form-item>
  </el-form>
  <!--  <el-button type="info">重置</el-button>-->
  <el-button type="success" @click="onSubmit">确认</el-button>


</template>

<style scoped>

</style>
