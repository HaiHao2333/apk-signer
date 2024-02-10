<template>
  <div class="terminal">
    <div class="output" ref="output" @keydown.enter="handleInput">
      <div v-html="currentInput" class="output-text"></div>
    </div>
  </div>
</template>

<script>

import bus from '@/api/bus'

export default {
  data() {
    return {
      lines: [],
      currentInput: "等待上传中..."
    };
  },
  methods: {
    handleInput() {
      if (this.currentInput.trim() === "") return;
      this.lines.push(`> ${this.currentInput}`);
      // Process the input here if needed
      this.currentInput = "";
      this.$refs.bottom.scrollIntoView({behavior: "smooth"});

    }
  },
  created() {
    bus.on('command-result', (result) => {
      // 将得到的换行符进行转换
      this.currentInput += '<br>' + result.replace(/\n/g, '<br>');
    })
  },
  beforeUnmount() {
    bus.off("command-result")
  }
};

</script>

<style scoped>
.terminal {
  width: 100%;
  height: 100%;
  border: 2px solid #f3eeee;
  overflow-y: scroll;
  font-family: monospace;
  background-color: #f5f3f3;
  color: #000000;
}

.output {
  padding: 10px;
  //overflow-y: scroll;
//height: calc(100% - 30px); text-align: left; /* 将文本内容靠左对齐 */
}
</style>
