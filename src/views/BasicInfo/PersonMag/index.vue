<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>用电记录</h3> -->
      <el-form ref="searchForm" :model="searchForm" label-position="right" class="form-container">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
            <el-form-item label="姓名:" class="postInfo-container-item">
              <el-input v-model="searchForm.keyWord" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="16" :lg="16" :xl="18">
            <input type="file"
                   runat="server"
                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                   v-show="false"
                   id="importExcel"
                   @change="excelFileChange($event)">
            <el-form-item style="float: right;">
              <el-button type="primary" @click="search">查询</el-button>
              <!-- <el-button @click="exportExcel">导出Excel</el-button>
              <el-button @click="importExcel">导入Excel</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="container dataContent">
      <el-table :data="personData" border>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="账号" prop="number" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="所属组织" prop="userOrgName" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editOrg(scope.row)">维护组织</el-button>
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
    <el-dialog
      title="所属组织"
      :visible.sync="formDialogVisible"
      width="500px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="组织" prop="userOrg">
          <el-input
            placeholder="请选择组织"
            readonly
            v-model="orgDisplay">
            <el-button slot="append" icon="el-icon-search" @click="orgTreeDialogVisiable = true"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="所属组织"
      :visible.sync="orgTreeDialogVisiable"
      width="500px">
      <el-tree
        :data="orgDataTree"
        ref="orgTree"
        node-key="fid"
        :default-expanded-keys="defaultKey"
        :show-checkbox="true"
        check-strictly
        @check-change="handleOrgCheck"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orgTreeDialogVisiable = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmOrg" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'PersonMag',
  data () {
    return {
      i: 0,
      searchForm: {
      },
      formDialogVisible: false,
      showFormDialog: false,
      orgTreeDialogVisiable: false,
      currentPage: 1,
      pageSize: 10,
      personData: [
        // {
        // name: '张三',
        // role: '养鸡厂长',
        // org: '养殖事业部'
        // }
      ],
      defaultKey: [],
      total: 0,
      form: {},
      checkOrg: [],
      defaultProps: {
        children: 'children',
        label: 'fnameL2'
      },
      orgDataTree: []
    }
  },
  mounted () {
    const v = this
    request({
      url: '/ZBEPS/org/listEPS',
      method: 'get'
    }).then(response => {
      if (response.status === 200) {
        v.orgDataTree = response.data
      }
    }).catch(error => {
      this.$message.error(error)
    })
    this.requestPageData(1)
  },
  initTree () {
    const v = this
    request({
      url: '/ZBEPS/org/listFGS',
      method: 'get'
    }).then(response => {
      if (response.status === 200) {
        v.orgDataTree = response.data
      }
    }).catch(error => {
      this.$message.error(error)
    })
  },
  methods: {
    excelFileChange (event) {
      const bean = [{
        label: '姓名',
        value: 'name'
      }, {
        label: '角色',
        value: 'role'
      }, {
        label: '组织',
        value: 'org'
      }]
      this.$importExcel(event, bean).then(response => {
        response.forEach((item) => {
          this.personData.push(item)
        })
      })
    },
    importExcel () {
      document.querySelector('#importExcel').click()
    },
    editOrg (row) { // 维护所属组织
      const f = {
        userId: row.id,
        name: row.name
      }
      if (this.$refs.orgTree !== undefined) {
        // this.$refs.orgTree.setCheckedKeys([row.userOrg])
        this.$refs.orgTree.setCheckedKeys([])
      }
      // this.defaultKey = [row.userOrg]
      this.checkOrg = []
      if (row.userOrg !== null) {
        const check = {
          fid: row.userOrg,
          fnameL2: row.userOrgName
        }
        this.checkOrg.push(check)
      }
      this.form = f
      this.formDialogVisible = true
    },
    handleOrgCheck (data, checked, node) {
      this.i++
      if (this.defaultKey.length === 0 && this.i % 2 === 0) {
        if (checked) {
          this.$refs.orgTree.setCheckedKeys([])
          this.$refs.orgTree.setCheckedKeys([data.fid])
        } else {
          this.$refs.orgTree.setCheckedNodes([])
        }
      }
    },
    exportExcel () { // 导出Excel
      const tHeader = ['姓名', '角色', '组织']
      const filterVal = ['name', 'role', 'org']
      const list = this.personData
      this.$exportExcel(tHeader, filterVal, list, 'xssxxx')
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
    confirmOrg () {
      this.checkOrg = this.$refs.orgTree.getCheckedNodes()
      this.orgTreeDialogVisiable = false
    },
    search () {
      this.requestPageData(this.pageSize)
    },
    submit () {
      if (this.checkOrg.length === 0) {
        this.$message.error('必须选择组织再提交!')
        return
      }
      const param = this.form
      console.log('Confirm Org:' + JSON.stringify(this.checkOrg))
      console.log('Confirm Org Level:' + this.checkOrg[0].cfmanageorgunitlevel)
      param.level = this.checkOrg[0].cfmanageorgunitlevel
      param.orgId = this.checkOrg[0].fid
      request({
        url: '/ZBEPS/privileges/update',
        method: 'post',
        data: param
      }).then(response => {
        if (response.status === 200) {
          this.formDialogVisible = false
          this.$message.success('提交成功')
          this.checkOrg = []
          this.form = {}
          this.requestPageData(1)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    resetForm () {
      this.searchForm = {}
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.requestPageData(1)
    },
    requestPageData (page) { // 请求分页数据
      const v = this
      this.searchForm.pageSize = this.pageSize
      this.searchForm.pageNum = page
      request({
        url: `/ZBEPS/user/selectUser`,
        method: 'get',
        params: this.searchForm
      }).then(response => {
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          v.personData = response.data.list
          v.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
        v.$message.error(error.msg)
      })
    },
    addNew () {
    }
  },
  computed: {
    orgDisplay () {
      let n = ''
      this.checkOrg.forEach((item, index) => {
        if (index === 0) {
          n += item.fnameL2
        } else {
          n += '、' + item.fnameL2
        }
      })
      return n
    }
  }
}
</script>

<style lang="scss">
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
