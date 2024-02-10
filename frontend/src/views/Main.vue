<template>
  <el-container class="layout-container-demo" style="height: 100vh; display: flex; flex-direction: column">
    <el-header class="el-header">
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px" @click="createWindow">
            <setting/>
          </el-icon>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="main-container">
      <div class="upload-wrapper">
        <Upload></Upload>
      </div>
    </el-main>

    <div style="flex: 18; overflow: auto;">
      <!-- 其他组件内容 -->
      <Terminal/>
      <!-- 其他组件内容 -->
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import {ref, toRaw} from 'vue'
import {Menu as IconMenu, Message, Setting} from '@element-plus/icons-vue'
import Upload from "./Upload.vue";
import Terminal from "./Terminal.vue";
import {method} from "lodash";
import {ipc} from '@/utils/ipcRenderer';
import {ipcApiRoute} from '@/api/main';

const views = [
  {
    type: 'web',
    content: 'https://www.bilibili.com/',
    windowName: 'window-web',
    windowTitle: 'bilibili'
  },
  {
    type: 'html',
    content: '/public/html/view_example.html',
    windowName: 'window-html',
    windowTitle: 'html window'
  },
  {
    type: 'vue',
    content: '#/settings',
    windowName: 'setting-window',
    windowTitle: 'settings'
  },
];
const createWindow = () => {
  ipc.invoke(ipcApiRoute.createWindow, toRaw(views[2])).then(r => {
    console.log(r);
  })
}


</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-right: 20px;
}

.upload-wrapper {
  text-align: center;
}

.main-container {
  padding: 0;
}

.layout-container-demo .el-main {
  padding: 0;
}

.el-header {
  text-align: right;
  height: 30px;
  font-size: 12px;
}
</style>
