<template>
  <div>
    <p>ant-design-vue</p>
    <a-button>test</a-button>
    <a-row>
      <a-col :span="12">1</a-col>
      <a-col :span="12">2</a-col>
    </a-row>

    <ElLink>123</ElLink>
    <TestTsx />

    <TestJsx />

    <p>element-plus</p>

    <ElButton>el-button</ElButton>

    <Button>vant btn</Button>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import TestTsx from './Test';
  import TestJsx from './Test1';
  import { ElAlert, ElLink } from 'element-plus';
  import { Affix, Cascader } from 'ant-design-vue';
  import { Button } from 'vant';
  import { ElButton } from 'element-plus';
  export default defineComponent({
    name: 'App',
    components: { TestTsx, ElButton, ElLink, TestJsx, ElAlert, Affix, Cascader, Button },
    setup() {
      return {};
    },
  });
</script>
