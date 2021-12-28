import { defineComponent } from 'vue'

import { Table, Column, Button } from 'vxe-table'

export default defineComponent({
  setup() {
    const data = [
      { id: 1, name: '张三', age: '18' },
      { id: 2, name: '李四', age: '20' },
      { id: 3, name: '王五', age: '22' },
      { id: 4, name: '赵六', age: '24' },
    ]
    return () => (
      <>
        <Button status="primary">vxe-table</Button>
        <Table data={data} highlightHoverRow>
          <Column type="checkbox" />
          <Column title="name" field="name" />
          <Column title="age" field="age" />
        </Table>
      </>
    )
  },
})
