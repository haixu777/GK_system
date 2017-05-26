<template lang="html">
  <div class="sample_auto_container">
    <i-button type="primary" icon="settings" size="small">批量抽取</i-button>
    <Table
      :data="tableData"
      :columns="columns"
      @on-selection-change="multipleExtra">
    </Table>
    <Upload
      multiple
      action="//localhost:3000/sample/upload">
      <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
    </Upload>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        { id: 1, name: 'test', path: '/asdasd/swq.txt' },
        { id: 2, name: 'tes22', path: '/asdasd/swq22.txt' }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '文件名', key: 'name' },
        { title: '文件路径', key: 'path' },
        {
          title: '操作',
          key: 'action',
          render () {
            return `
              <i-button icon="hammer" type="primary" size="small">抽取</i-button>
              <i-button icon="ios-trash" type="error" size="small">删除</i-button>
              `
          }
        }
      ]
    }
  },
  methods: {
    multipleExtra (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="css">
</style>
