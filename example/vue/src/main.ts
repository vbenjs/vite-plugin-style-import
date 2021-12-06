import { createApp } from 'vue'
import App from './App.vue'
import VXETable from 'vxe-table'

import { Button, Row, Col } from 'ant-design-vue'
import { ElButton, ElMessage } from 'element-plus'

import {
  // Need
  Button as AntButton,

  // Optional
  // Select,
  // Alert,
} from 'ant-design-vue'
const app = createApp(App)

app.use(Button).use(Row).use(Col).use(ElButton).use(VXETable)

// eslint-disable-next-line no-console
console.log(AntButton)
app.mount('#app')

ElMessage.error('测试')
