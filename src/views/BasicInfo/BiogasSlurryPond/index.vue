<!--suppress ALL -->
<template>
		<!--沼液塘基础信息表-->
  <div class="app-container">
    <div class="container dataContent" style="height: calc(100vh - 100px);">
      <div class="magBox">
        <div class="treeBox" v-loading="loadingTree">
          <el-tree
            :data="orgDataTree"
            ref="orgTree"
            node-key="id"
            :default-expanded-keys="[2, 3]"
            @node-click="nodeClick"
            :props="defaultProps">
          </el-tree>
        </div>
        <div class="gridBox">
          <div v-show="currentNode.id !== undefined">
            <div style="display: flex;">
              <el-breadcrumb separator="/" style="flex: 1;line-height: 32px">
                <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">{{ item }}</el-breadcrumb-item>
              </el-breadcrumb>
              <el-button type="primary" size="small" @click="addNew">新增</el-button>
            </div>
            <el-table :data="stationData" border>
              <el-table-column label="环保站" prop="epName"/>
              <el-table-column label="沼液塘名称" prop="name"/>
              <el-table-column label="编号" prop="number"/>
              <el-table-column label="沼液塘">
	        	<el-table-column prop="surfaceArea" label="表面积/方">
	        	</el-table-column>
	        	<el-table-column prop="buttomArea" label="底面积/方">
	        	</el-table-column>
	        	<el-table-column prop="depth" label="塘深/米">
	        	</el-table-column>
	          </el-table-column>
	          <el-table-column label="容积">
	        	<el-table-column prop="volume" label="/方">
	        	</el-table-column>
	          </el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="scope">
                  <time>{{ timeFormat(scope.row.createTime, 'yyyy-MM-dd') }}</time>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="del(scope.row.id)">删除</el-button>
                    <el-button type="text" @click="edit(scope.row)">修改</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pageSize"
              :total="total"
              :page-sizes="[10,20,50]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="formDialogVisible"
      width="500px">
      <el-form label-width="140px">
        <el-form-item label-width="" label="沼液塘名字">
          <el-input v-model="reqdata.name"></el-input>
        </el-form-item>
        <el-form-item label="环保站">
          <el-input v-model="currentNode.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="reqdata.number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="表面积/方">
          <el-input v-model="reqdata.surfaceArea" type="number"></el-input>
        </el-form-item>
        <el-form-item label="底面积/方">
          <el-input v-model="reqdata.buttomArea" type="number"></el-input>
        </el-form-item>
        <el-form-item label="塘深/米">
          <el-input v-model="reqdata.depth" type="number"></el-input>
        </el-form-item>
        <el-form-item label="容积/方">
          <el-input v-model="reqdata.volume" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'EPStation',
  data () {
    return {
      searchForm: {
      },
      formDialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      stationData: [],
      breadList: [],
      showFormDialog: false,
      total: 0,
      form: {},
      personLoading: false,
      loadingTree: false,
      orgDataTree: [],
      defaultProps: {
        children: 'children',
        label: 'fnameL2'
      },
      EPSList: [],
      currentNode: {},
      reqdata:{
      	name:"",
      	number:"",
      	surfaceArea:"",
      	buttomArea:"",
      	depth:"",
      	volume:"",
      	orgId:"",
      }
    }
  },
  mounted () {
    // this.requestPageData(1)
    this.initTree()
    },
    methods: {
    		
    		del(id) {
    			let url = '/ZBEPS/biogasPond/delete?id='+id
    			request({
    					url: url,
    					method: 'post'
    					//data: id
    				}).then(response => {
    					if(response.status === 200) {
    						this.$message.success('删除成功')
    						this.formDialogVisible = false
    						this.requestPageData(1)
    					}
    				}).catch(error => {
    					this.$message.error(JSON.stringify(error))
    				})
    		},
    		submit() {
//  			debugger
    			this.reqdata.orgId = this.currentNode.id
    			if(typeof(this.reqdata.id)=="undefined") {//判断是否为新增
//  				console.log(JSON.stringify(this.reqdata))
    				request({
    					url: '/ZBEPS/biogasPond/insert',
    					method: 'post',
    					data: this.reqdata
    				}).then(response => {
    					if(response.status === 200) {
    						this.$message.success('保存成功')
    						this.formDialogVisible = false
    						this.requestPageData(1)
    					}
    				}).catch(error => {
    					this.$message.error(JSON.stringify(error))
    				})
    			} else {
    				console.log(JSON.stringify(this.reqdata))
    				request({
    					url: '/ZBEPS/biogasPond/update',
    					method: 'post',
    					data: this.reqdata
    				}).then(response => {
    					if(response.status === 200) {
    						this.$message.success('保存成功')
    						this.formDialogVisible = false
    						this.requestPageData(1)
    					}
    				}).catch(error => {
    					this.$message.error(JSON.stringify(error))
    				})
    			}
    		},
    		edit(row) {
					console.log(row)
		      let obj = {
		        id: row.id,
		        orgId: row.orgId,
		        name: row.name,
		        number: row.number,
		        surfaceArea: row.surfaceArea,
		        buttomArea: row.buttomArea,
		        depth: row.depth,
		        volume: row.volume,
		//      pigFarmIds: pigfarmArr
		      }
		      this.reqdata = obj
		      this.formDialogVisible = true
		    },
		    nodeClick (obj, node, component) {
		      if (node.childNodes.length === 0) {
		        const arr = []
		        this.breadList = this.getCheckNodeNames(node, arr)
		        this.currentNode = {
		          id: obj.fid,
		          name: node.label
		        }
		        this.reloadEPSList()
		        this.requestPageData(1)
		      }
		    },
    reloadEPSList () {
      request({
        url: '/ZBEPS/org/listEPS',
        method: 'get',
        params: {
          orgId: this.currentNode.id
        }
      }).then(response => {
        this.EPSList = response.data
      }).catch(error => {
        this.$message.error(`error: ${error}`)
      })
    },
    initTree () {
      const v = this
      this.loadingTree = true
      request({
        url: '/ZBEPS/org/listEPS',
        method: 'get'
      }).then(response => {
        this.loadingTree = false
        // if (response.status === 200) {
        v.orgDataTree = response.data
        // }
      }).catch(error => {
        this.loadingTree = false
        this.$message.error(error)
      })
    },
    getCheckNodeNames (node, arr) {
      if (node.label !== null && node.label !== undefined) {
        arr.unshift(node.label)
      }
      if (node.parent !== null) {
        return this.getCheckNodeNames(node.parent, arr)
      } else {
        return arr
      }
    },
    timeFormat: function (time, type) { // 日期格式化
      if (type === 1) {
        return timeFormat(time, 'yyyy-MM-dd  hh:mm:ss')
      } else {
        return timeFormat(time, 'yyyy-MM-dd')
      }
    },
    handleCurrentChange (page) {
      this.requestPageData(page)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.requestPageData(1)
    },
    requestPageData (page) { // 请求分页数据
      const v = this
      const param = {
        orgId: this.currentNode.id,
        pageSize: this.pageSize,
        pageNum: page
      }
      request({
        url: `ZBEPS/biogasPond/query`,
        method: 'post',
        data: qs.stringify(param)
        // params: this.searchForm
      }).then(response => {
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          // v.stationData.splice(0, v.stationData.length)
          // for (var i in response.data.list) {
          //   v.stationData.push(response.data.list[i])
          // }
          v.stationData = response.data.list
          for(var i in v.stationData){
          	v.stationData[i].epName = v.currentNode.name
          }
          v.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
        v.$message.error(error.msg)
      })
    },
    addNew () {
      this.formDialogVisible = true
      this.reqdata = {
      }
//    this.form = {
//      pigFarmIds: []
//    }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tree-node.is-focusable{
    background-color: #ff0000;
  }
  .magBox{
    display: flex;
    flex-flow: nowrap row;
    height: 100%;
    & .treeBox{
      width: 20%;
      margin: 5px;
      border: 1px solid #E1E1E1;
      border-radius: 4px;
      padding:10px;
      box-sizing: border-box;
      overflow-y: scroll;
    }
    & .gridBox{
      flex: 1;
      margin: 5px;
      border: 1px solid #E1E1E1;
      border-radius: 4px;
      padding: 10px;
      overflow-x: scroll;
    }
  }
  .searchBar{
    padding: 20px 20px 0px 0px;
    .el-form-item{
      display: flex;
    }
    label.el-form-item__label{
      width: 140px !important;
      display: inline-block !important;
    }
    .el-form-item__content{
      flex: 1 !important;
    }
  }
  .el-table th {
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
  .dataContent{
    padding: 20px;
    text-align: right;
  }
</style>
