<template>
  <div class="hello">
    <el-button @click="getData">获取画布数据</el-button>
    <el-button @click="downLoadImage">下载为图片</el-button>
    <el-button>设置to箭头样式</el-button>
    <el-menu size="small" mode="horizontal" style="width: 100px;height: 40px; display: inline-block;">
      <el-submenu index="state" title="默认终点箭头">
        <template slot="title">
          <i :class="`iconfont icon-to-${canvas.data.toArrowType}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in arrowTypes"
          :key="index"
          :index="`toArrow-${item}`"
          @click="onState('toArrowType', item)"
          style="display: block;"
        >
          <i :class="`iconfont icon-to-${item}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-button>设置from箭头样式</el-button>
    <el-menu size="small" mode="horizontal" style="width: 100px;height: 40px; display: inline-block;">
      <el-submenu index="state" title="默认起始点箭头">
        <template slot="title">
          <i :class="`iconfont icon-from-${canvas.data.fromArrowType}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in arrowTypes"
          :key="index"
          :index="`toArrow-${item}`"
          @click="onState('fromArrowType', item)"
          style="display: block;"
        >
          <i :class="`iconfont icon-from-${item}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-button>设置连线样式</el-button>
    <el-menu size="small" mode="horizontal" style="width: 100px;height: 40px; display: inline-block;">
      <el-submenu index="state" title="默认起始点箭头">
        <template slot="title">
          <i :class="`iconfont icon-${canvas.data.lineName}`"></i>
        </template>
        <el-menu-item
          v-for="(item, index) in lineNames"
          :key="index"
          :index="`toArrow-${item}`"
          @click="onState('lineName', item)"
          style="display: block;"
        >
          <i :class="`iconfont icon-${item}`"></i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <input type="color" style="width: 100px;" @change="setBackground" />
    <div class="tools">
      <div v-for="(item, index) in tools" :key="index">
        <div class="title">{{ item.group }}</div>
        <div class="buttons">
          <a
            v-for="(btn, i) in item.children"
            :key="i"
            :title="btn.name"
            :draggable="btn.data"
            @dragstart="onDrag($event, btn)"
          >
            <i :class="`iconfont ${btn.icon}`"></i>
          </a>
        </div>
      </div>
    </div>
    <div id="topo-canvas"></div>
  </div>
</template>

<script>
import { Topology } from '@topology/core'
import { register as registerFlow } from '@topology/flow-diagram'
import { register as registerActivity } from '@topology/activity-diagram'
import { register as registerClass } from '@topology/class-diagram'
import { register as registerSequence } from '@topology/sequence-diagram'
import { register as registerChart } from '@topology/chart-diagram'
import { json } from './cube-demo'
import { Tools } from './canvas'
export default {
  name: 'HelloWorld',
  data () {
    return {
      json,
      tools: Tools,
      canvas: {
        data: {
          toArrowType: '',
          lineName: 'curve',
          bkColor: ''
        }
      },
      lineNames: ['curve', 'polyline', 'line'], // 线条样式
      arrowTypes: [ // 箭头样式
        '',
        'triangleSolid',
        'triangle',
        'diamondSolid',
        'diamond',
        'circleSolid',
        'circle',
        'line',
        'lineUp',
        'lineDown'
      ]
    }
  },
  mounted () {
    this.canvasRegister()
  },
  methods: {
    // 注册图形库
    canvasRegister () {
      registerFlow()
      registerActivity()
      registerClass()
      registerSequence()
      registerChart()
      // ... 其他图形库
      // 2. 创建画布
      // 其中，第一个参数'topo-canvas'表示canvas所在的父dom元素id，通常为<div class="canvas" id="topo-canvas"></div>；
      // 第二个参数{}表示画布选项，这里表示全部使用默认值。具体选项请参考后面的api文档。
      this.canvas = new Topology('topo-canvas', {})
      // 事件
      this.canvas.on('node', (e) => {
        console.log(e)
      })
      // 3. 渲染图形
      // 画布图形数据，可以来自于官网下载的json
      // const json = {pens: [this.json]}
      // this.canvas.open(this.json)
      this.canvas.open({})
      // 4. 如果json发送变化，重绘
      this.canvas.render()
    },
    setBackground (value) {
      console.log(value.target.value)
      this.canvas.data.bkColor = value.target.value
    },
    onState (key, value) {
      this.canvas.data[key] = value
    },
    onDrag (event, node) {
      event.dataTransfer.setData('Topology', JSON.stringify(node.data))
    },
    getData () {
      const data = this.canvas.data
      console.log(data)
    },
    saveImage () {
      // 保存为图片blob
      // toImage函数参数：type, quality, callback
      this.canvas.toImage(null, null, blob => {
        // Do sth.
      })
    },
    downLoadImage () {
      // 下载为图片
      this.canvas.saveAsImage('canvas.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  /deep/.el-select-dropdown__item{
    display: block;
  }
  #topo-canvas{
    height: 800px;
    font-size: 30px;
  }
  .tools {
    position: absolute;
    width: 200px;
    background-color: #f8f8f8;
    border-right: 1px solid #d9d9d9;
    overflow-y: auto;
    z-index: 2;

    .title {
      color: #0d1a26;
      font-weight: 600;
      font-size: 14px;
      line-height: 1;
      padding: 0.05em 0.1em;
      border-bottom: 1px solid #ddd;

      &:first-child {
        border-top: none;
      }
    }

    .buttons {
      padding: 0.1em 0;
      a {
        display: inline-block;
        color: #314659;
        line-height: 1;
        width: 50px;
        height: 50px;
        text-align: center;
        text-decoration: none !important;
        cursor: pointer;

        .iconfont {
          font-size: 14px;
        }

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
