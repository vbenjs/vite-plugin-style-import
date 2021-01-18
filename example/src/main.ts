import { createApp } from 'vue';
import App from './App.vue';

import { Button, Row, Col } from 'ant-design-vue';
import { ElButton } from 'element-plus';

const app = createApp(App);

app.use(Button).use(Row).use(Col).use(ElButton);

app.mount('#app');
