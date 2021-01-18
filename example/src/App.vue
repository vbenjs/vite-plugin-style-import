<template>
  <div>
    <p>ant-design-vue</p>
    <a-button>test</a-button>
    <a-row>
      <a-col :span="12">1</a-col>
      <a-col :span="12">2</a-col>
    </a-row>

    <TestTsx />

    <TestJsx />

    <p>element-plus</p>

    <el-button>el-button</el-button>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import TestTsx from './Test';
  import TestJsx from './Test1';
  export default defineComponent({
    name: 'App',
    components: { TestTsx, TestJsx },
    setup() {
      return {};
    },
  });
</script>
