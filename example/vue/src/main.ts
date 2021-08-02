import { createApp } from 'vue';
import App from './App.vue';

import { Button, Row, Col } from 'ant-design-vue';
import { ElButton, locale, ElMessage } from 'element-plus';

import {
  // Need
  Button as AntButton,

  // Optional
  // Select,
  // Alert,
} from 'ant-design-vue';
const app = createApp(App);

app.use(Button).use(Row).use(Col).use(ElButton);

// eslint-disable-next-line no-console
console.log(locale);
// eslint-disable-next-line no-console
console.log(AntButton);
app.mount('#app');

ElMessage.error('测试');
