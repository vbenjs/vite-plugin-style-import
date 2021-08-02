import { defineComponent } from 'vue';

import { Button } from 'ant-design-vue';

import { ElButton } from 'element-plus';

export default defineComponent({
  setup() {
    return () => (
      <>
        <Button>Tsx button</Button>
        <ElButton>ElButton</ElButton>
      </>
    );
  },
});
