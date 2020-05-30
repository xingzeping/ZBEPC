<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>环保单头成本表</h3> -->
      <el-form ref="searchForm" :model="searchForm" label-position="right" class="form-container">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="片区:" class="postInfo-container-item">
              <el-input v-model="searchForm.pq" placeholder="请输入片区"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="分公司:" class="postInfo-container-item">
              <el-input v-model="searchForm.fgs" placeholder="请输入分公司"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="环保站:" class="postInfo-container-item">
              <el-input v-model="searchForm.name" placeholder="请输入环保站"/>
            </el-form-item>
          </el-col>
					
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="日期:" class="postInfo-container-item" >
              <el-date-picker v-model="date" type="month" placeholder="选择月份" style="width: 100%;"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-form-item style="float: right;">
              <el-button type="primary" @click="search">查询</el-button>
						  <el-button type="primary" @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="container dataContent">
      <el-table :data="projectData" border show-summary>
				<el-table-column label="序号" type="index" />
				<el-table-column label="片区" prop="pq_name" />
				<el-table-column label="分公司" prop="fgs_name" />
				<el-table-column label="环保站" prop="name" />
				<el-table-column label="全称" prop="full_name" />
				<el-table-column label="猪场场长" prop="managerName" />
				<el-table-column label="设计" prop="ability" />
				<el-table-column label="工艺" prop="technology" />
				<el-table-column label="区域" prop="name" />
				<el-table-column label="生产母猪存栏量（头）" prop="cl" />
				<el-table-column label="总成本" prop="total_cost" />
				<el-table-column label="运营成本" prop="operate_cost" />
				<el-table-column label="头母猪总成本" prop="PerTotal_cost" />
				<el-table-column label="头母猪运营成本" prop="PerOperate_cost" />
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
</template>

<script>
import request from '@/utils/request'
import { projectStatus } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'BillHeadCost',
  data () {
    return {
      searchForm: {},
			date: new Date(),
      visibleFileDialog: false,
      currentPage: 1,
      pageSize: 10,
      pageNum:1,
      projectData: [],
      templateList: [],
      fileData: {},
      total: 0,
      states: projectStatus,
      title:"环保单头成本"
    }
  },
  mounted () {
    this.requestPageData(1)
  },
  methods: {
    timeFormat: function (time, type) { // 日期格式化
      if (type === 1) {
        return timeFormat(time, 'yyyy-MM-dd')
      } else {
        return timeFormat(time, 'yyyy-MM')
      }
    },
    handleCurrentChange (page) {
      this.requestPageData(page)
    },
    exportExcel() { // 导出Excel
				const v = this
				this.searchForm.year= this.date.getFullYear()+"";
	 			this.searchForm.month = (this.date.getMonth()+1)+"";
				v.searchForm.pageSize = 10000;
				v.searchForm.pageNum = this.pageNum;
				// TODO
			      request({
			        url: `ZBEPS/finance/unit/`,
			        method: 'post',
							headers: {
								'Content-Type': 'application/json'
							},
			        data: JSON.stringify(this.searchForm)
			        // params: this.searchForm
			      }).then(response => {
			        if (response.status === 200) {
			        	const dd = []
			          for (var i in response.data.list) {
			            dd.push(response.data.list[i])
			          }
			          debugger
			          for(var i in dd){
			          	if(dd[i].cl==0){
			          		dd[i].PerTotal_cost = 0
			          		dd[i].PerOperate_cost = 0
			          	}else{
				          	dd[i].PerTotal_cost = (dd[i].total_cost/dd[i].cl).toFixed(2)
				          	dd[i].PerOperate_cost = (dd[i].operate_cost/dd[i].cl).toFixed(2)
			          	}
			          }
			          const tHeader = ['片区', '分公司','环保站','全称','猪场场长','设计','工艺','区域','生产母猪存栏量（头）','总成本','运营成本','头母猪总成本','头母猪运营成本']
			      		const filterVal = [ 'pq_name', 'fgs_name','name','full_name','managerName','ability','technology','name','cl','total_cost','operate_cost','PerTotal_cost','PerOperate_cost']
							  const list = dd
					      const titlename = this.title
							  this.$exportExcel(tHeader,filterVal,list,titlename)
			        }
			      }).catch(error => {
			        v.$message.error(`查询出错:${error}`)
			      })
			    },
    search () {
			const v = this
			// console.log(this.searchForm.date);
 			this.searchForm.year= this.date.getFullYear()+"";
 			this.searchForm.month = (this.date.getMonth()+1)+"";
			this.searchForm.pageSize = this.pageSize;
			this.searchForm.pageNum = this.pageNum;
			// TODO
      request({
        url: `ZBEPS/finance/unit/`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
        // params: this.searchForm
      }).then(response => {
        if (response.status === 200) {
          v.projectData.splice(0, v.projectData.length)
          for (var i in response.data.list) {
            v.projectData.push(response.data.list[i])
          }
          for(var i in v.projectData){
          	if(v.projectData[i].cl==0){
          		v.projectData[i].PerTotal_cost = 0
          		v.projectData[i].PerOperate_cost = 0
          	}else{
	          	v.projectData[i].PerTotal_cost = (v.projectData[i].total_cost/v.projectData[i].cl).toFixed(2)
	          	v.projectData[i].PerOperate_cost = (v.projectData[i].operate_cost/v.projectData[i].cl).toFixed(2)
          	}
          }
          v.total = response.data.total
        }
      }).catch(error => {
        v.$message.error(`查询出错:${error}`)
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
			this.searchForm.year= this.date.getFullYear()+"";
			this.searchForm.month = (this.date.getMonth()+1)+"";
			this.searchForm.pageSize = this.pageSize;
			this.searchForm.pageNum = page;
      request({
        url: `ZBEPS/finance/unit/`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
      }).then(response => {
        console.log()
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          v.projectData.splice(0, v.projectData.length)
          for (var i in response.data.list) {
            v.projectData.push(response.data.list[i])
          }
          for(var i in v.projectData){
          	if(v.projectData[i].cl==0){
          		v.projectData[i].PerTotal_cost = 0
          		v.projectData[i].PerOperate_cost = 0
          	}else{
	          	v.projectData[i].PerTotal_cost = (v.projectData[i].total_cost/v.projectData[i].cl).toFixed(2)
	          	v.projectData[i].PerOperate_cost = (v.projectData[i].operate_cost/v.projectData[i].cl).toFixed(2)
          	}
          }
          v.total = response.data.total
        }
      })
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
	.el-table td {
		text-align: center;
	}
  .dataContent{
    padding: 20px;
    text-align: right;
  }
</style>
