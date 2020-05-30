<!--suppress ALL -->
<template>
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
            <br>
            <el-table :data="stationData" border>
              <el-table-column label="环保站" prop="name"/>
              <el-table-column label="猪场" prop="pigFarmNames"/>
              <el-table-column label="环保站长" prop="managerName"/>
              <el-table-column label="设计处理能力(吨/日)" prop="ability"/>
              <el-table-column label="工艺" prop="technology"/>
              <el-table-column label="污水处理价格/吨" prop="sewage_price"/>
              <el-table-column label="超出处理价格/吨" prop="overSewagePrice"/>
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
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label-width="" label="环保站名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分公司">
          <el-input v-model="currentNode.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="环保站长">
          <el-select v-model="form.manager"
                     :loading="personLoading"
                     filterable
                     remote
                     placeholder="请输入关键字查询" :remote-method="requestPerson" style="width: 100%">
            <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.number }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="猪场">
          <el-select v-model="form.pigFarmIds" placeholder="请选择猪场" multiple  style="width: 100%">
            <el-option v-for="item in pigfarmList" :label="item.fnameL2" :value="item.fid" :key="item.fid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设计处理能力(吨/日)">
          <el-input v-model="form.ability" type="number"></el-input>
        </el-form-item>
        <el-form-item label="污水处理价格/吨">
          <el-input v-model="form.sewage_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="超出处理价格/吨">
          <el-input v-model="form.overSewagePrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="工艺">
					<el-select v-model="form.technology" placeholder="请选择工艺"   style="width: 100%">
					  <el-option v-for="item in technologyList" :label="item.name" :value="item.key" :key="item.key"></el-option>
					</el-select>
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
			technologyList: [
				{name:"水泡粪",key:"水泡粪"},
				{name:"干清粪",key:"干清粪"}
			],
      pigfarmList: [],
      currentNode: {},
      personList: []
    }
  },
  mounted () {
    // this.requestPageData(1)
    this.initTree()
  },
  methods: {
    del (id) {
    	 let url = '/ZBEPS/station/delete?id='+id
			 request({
			  url: url,
			  method: 'delete',
			}).then(response => {
			  if (response.status === 200) {
			    this.$message.success('删除成功')
			    this.formDialogVisible = false
			    this.requestPageData(1)
			  }
			}).catch(error => {
			  this.$message.error(JSON.stringify(error))
			})
    },
    submit() {
      const param = this.form
      param.fgsId = this.currentNode.id
      // param.pigfarmIds = thi
      let ids = ''
      param.pigFarmIds.forEach((item, index) => {
        if (index === 0){
          ids += item
        } else {
          ids += ',' + item
        }
      })
      param.pigFarmIds = ids
      request({
        url: '/ZBEPS/station/insert',
        method: 'post',
        params: param
      }).then(response => {
        if (response.status === 200) {
          this.$message.success('保存成功')
          this.formDialogVisible = false
          this.requestPageData(1)
        }
      }).catch(error => {
        this.$message.error(JSON.stringify(error))
      })
    },
    edit (row) {
      let pigfarmArr = []
      if (row.pigFarmIds !== null) {
        pigfarmArr = row.pigFarmIds.split(',')
      }
      const obj = {
        id: row.id,
        fgsId: row.fgsId,
        name: row.name,
        ability: row.ability,
        sewagePrice: row.sewagePrice,
        overSewagePrice: row.overSewagePrice,
        technology: row.technology,
        pigFarmIds: pigfarmArr
      }
      if(row.managerName !== ''){
        this.requestPerson(row.managerName)
        obj.manager = row.manager
      }
      this.form = obj
      this.formDialogVisible = true
    },
    nodeClick (obj, node, component) {
      if (node.data.cfmanageorgunitlevel===4) {
        const arr = []
        this.breadList = this.getCheckNodeNames(node, arr)
        this.currentNode = {
          id: obj.fid,
          name: node.label
        }
        this.reloadPigfarmList()
        this.requestPageData(1)
      }
    },
    reloadPigfarmList () {
      request({
        url: '/ZBEPS/org/list-pigfarm',
        method: 'get',
        params: {
          fgsId: this.currentNode.id
        }
      }).then(response => {
        this.pigfarmList = response.data
      }).catch(error => {
        this.$message.error(`error: ${error}`)
      })
    },
    requestPerson (query) {
      if (query !== '' && this.personLoading === false) {
        this.personLoading = true
        request({
          url: '/ZBEPS/user/selectUser',
          method: 'get',
          params: {
            keyWord: query,
            pageSize: 20,
            pageNum: 1
          }
        }).then(response => {
          this.personLoading = false
          this.personList = response.data.list
        }).catch(error => {
          this.personLoading = false
        })
      } else {
        this.personList = [];
      }
    },
    initTree () {
      const v = this
      this.loadingTree = true
      request({
        url: '/ZBEPS/org/listFGS',
        method: 'get'
      }).then(response => {
        this.loadingTree = false
        // if (response.status === 200) {
        v.orgDataTree = response.data
        // }
        console.log(v.orgDataTree)
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
        fgsId: this.currentNode.id,
        pageSize: this.pageSize,
        pageNum: page
      }
      request({
        url: `ZBEPS/station/list_by_fgs`,
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
          v.total = response.data.total
        }
      }).catch(error => {
        v.$message.error(error.msg)
      })
    },
    addNew () {
      this.formDialogVisible = true
      this.form = {
        pigFarmIds: []
      }
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
  .dataContent{
    padding: 20px;
    text-align: right;
  }
</style>
