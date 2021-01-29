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
  import { ElAlert } from 'element-plus';
  import { Affix, Cascader } from 'ant-design-vue';

  export default defineComponent({
    name: 'App',
    components: { TestTsx, TestJsx, ElAlert, Affix, Cascader },
    setup() {
      return {};
    },
  });
</script>
