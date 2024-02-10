<template>
  <!--  <el-button @click="test">签名测试</el-button>-->
  <!--  <el-button @click="exportFile">导出测试</el-button>-->
  <el-radio v-model="processType" label="1">签名->验证->导出</el-radio>
  <el-radio v-model="processType" label="2">仅验证</el-radio>


  <el-upload
      class="upload-demo"
      drag
      action=""
      :on-change="handleChange"
      :auto-upload="false"
  >
    <el-icon class="el-icon--upload">
    </el-icon>
    <div class="el-upload__tip">
      将APK拖拽到此处
    </div>
    <div class="el-upload__text">
      点击这里 <em>点击这里上传</em>
    </div>

  </el-upload>
</template>

<script>
import {ipc} from '@/utils/ipcRenderer';
import {ipcApiRoute} from '@/api/main';

import bus from "@/api/bus"

export default {
  data() {
    return {
      processType: '1'
    };
  },

  methods: {
    exportFile() {
      ipc.invoke(ipcApiRoute.exportFile,)
    },

    async handleChange(file) {

      const filePath = file.raw.path; // 获取文件路径

      const fileName = file.name; // 设置保存目标路径
      // 这里序列化再进行传输，防止传输的对象解析有问题
      const serializedObject = JSON.stringify({filePath, fileName});
      // 发送消息给主进程，请求保存文件操作
      // 1. 文件上传
      await ipc.invoke(ipcApiRoute.uploadFile, serializedObject)
          .then(res => {
            console.log('res:', res);
          })
          .catch(error => {
            console.error(error);
          });

      let verifyApkName = fileName;

      if (this.processType === "1") {
        // 2.对APP进行签名
        await ipc.invoke(ipcApiRoute.signer, fileName).then(result => {
          verifyApkName = result;
          console.log("signer:", result)
        });

      }


      // 3.签名验证
      await ipc.invoke(ipcApiRoute.verify, verifyApkName).then(result => {
        // 只要一部分数据
        const end = result.indexOf("WARNING:");
        // 签名返回数据如果无警告的话直接返回即可
        const substring = end <= -1 ? result : result.substring(0, end)
        //点击按钮回调
        bus.emit('command-result', substring);
        console.log("verifyResult", substring)
      });
      if (this.processType === "1") {
        // 4.导出文件
        this.exportFile();
      }
    },
    async signerApk(fileName) {

      ipc.invoke(ipcApiRoute.signer, fileName).then(result => {
      });
    },

  }
}

</script>


<style scoped>
.el-upload__tip {
  font-size: 20px;
}

.el-icon--upload {
  width: 300px;
  height: 200px;
}
</style>
