import { createApp } from 'vue';
import App from './App.vue';

import { Button, Row, Col } from 'ant-design-vue';
import { ElButton, locale } from 'element-plus';

import {
  // Need
  Button as AntButton,

  // Optional
  // Select,
  // Alert,
} from 'ant-design-vue';
const app = createApp(App);

app.use(Button).use(Row).use(Col).use(ElButton);

console.log(locale);
console.log(AntButton);
app.mount('#app');
