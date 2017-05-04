<template lang="html">
  <div class="clearfix">
    <div id="myDiagramDiv" style="width:100%; height:300px; background-color: #DAE4E4;">
      chart
    </div>
  </div>
</template>

<script>
const go = require('gojs')
const $ = go.GraphObject.make
export default {
  data () {
    return {
    }
  },
  methods: {
    initChart () {
      var myDiagram =
        $(go.Diagram, 'myDiagramDiv',
          {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            'undoManager.isEnabled': true // enable Ctrl-Z to undo and Ctrl-Y to redo
          })

      // the template we defined earlier
      myDiagram.nodeTemplate =
        $(go.Node, 'Horizontal',
          { background: '#44CCFF' },
          $(go.Picture,
            { margin: 10, width: 50, height: 50 },
            new go.Binding('source')),
          $(go.TextBlock, 'Default Text',
            { margin: 12, stroke: 'white', font: 'bold 16px sans-serif' },
            new go.Binding('text', 'name'))
        )

      var model = $(go.TreeModel)
      model.nodeDataArray =
      [ // the 'key' and 'parent' property names are required,
        // but you can add whatever data properties you need for your app
        { key: '1', name: 'Don Meow', source: require('assets/logo.png') },
        { key: '2', parent: '1', name: 'Demeter', source: require('assets/logo.png') },
        { key: '3', parent: '1', name: 'Copricat', source: require('assets/logo.png') },
        { key: '4', parent: '3', name: 'Jellylorum', source: require('assets/logo.png') },
        { key: '5', parent: '3', name: 'Alonzo', source: require('assets/logo.png') },
        { key: '6', parent: '2', name: 'Munkustrap', source: require('assets/logo.png') }
      ]
      myDiagram.model = model
    }
  },
  mounted () {
    setTimeout(this.initChart, 2000)
  }
}
</script>

<style lang="css">
</style>
