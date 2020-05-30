<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>环保收入构成表</h3> -->
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
              <el-date-picker v-model="date" type="month" placeholder="选择日期" style="width: 100%;"/>
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
				<el-table-column label="组织单位" prop="name" />
				<el-table-column label="全称" prop="fullname" />
				<el-table-column label="环保站（万元）">
        	<el-table-column prop="w_total" label="污水处理量（吨）">
        	</el-table-column>
        	<el-table-column prop="quota" label="定额污水排放量">
        	</el-table-column>
        	<el-table-column prop="sewage_price" label="单价">
        	</el-table-column>
        	<el-table-column prop="sewage_handle_price" label="污水处理收入">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="有机肥（万元）">
        	<el-table-column prop="fertilizer_yield" label="产量（吨）">
        	</el-table-column>
        	<el-table-column prop="fertilizer_sales" label="销量（吨)">
        	</el-table-column>
        	<el-table-column prop="" label="销售单价">
        	</el-table-column>
        	<el-table-column prop="fertilizer_income" label="销售收入">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="种植（万元）">
        	<el-table-column prop="plant_sales_volume" label="销量（吨）">
        	</el-table-column>
        	<el-table-column prop="plant_unit_price" label="销售单价">
        	</el-table-column>
        	<el-table-column prop="plant_income" label="销售收入">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="收入合计" prop="sumincome" />
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
  name: 'incomeStructure',
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
      title:"收入构成表"
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
				v.searchForm.year= this.date.getFullYear()+"";
 				v.searchForm.month = (this.date.getMonth()+1)+"";
				v.searchForm.pageSize = 10000;
				v.searchForm.pageNum = this.pageNum;
				// TODO
			      request({
			        url: `ZBEPS/finance/management`,
			        method: 'post',
							headers: {
								'Content-Type': 'application/json'
							},
			        data: JSON.stringify(this.searchForm)
			        // params: this.searchForm
			      }).then(response => {
			        if (response.status === 200) {
			        	const dd = response.data
			          for(var i in dd){
			          	dd[i].sumincome = dd[i].sewage_handle_price + dd[i].fertilizer_income + dd[i].plant_income
			          }
			          const tHeader = ['组织单位', '全称','环保站-污水处理量（吨）','环保站-定额污水排放量','环保站-单价','环保站-污水处理收入','有机肥-产量（吨）','有机肥-销量（吨）','有机肥-销售单价','有机肥-销售收入','种植-销量（吨）','种植-销售单价','种植-销售收入','收入合计']
			      	  const filterVal = [ 'name', 'fullname','w_total','quota','sewage_price','sewage_handle_price','fertilizer_yield','fertilizer_sales','','fertilizer_income','plant_sales_volume','plant_unit_price','plant_income','sumincome']
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
        url: `ZBEPS/finance/management`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
        // params: this.searchForm
      }).then(response => {
        if (response.status === 200) {
          v.projectData=response.data
          for(var i in v.projectData){
          	v.projectData[i].sumincome = v.projectData[i].sewage_handle_price + v.projectData[i].fertilizer_income + v.projectData[i].plant_income
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
        url: `ZBEPS/finance/management`,
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
          v.projectData=response.data
          for(var i in v.projectData){
          	v.projectData[i].sumincome = v.projectData[i].sewage_handle_price + v.projectData[i].fertilizer_income + v.projectData[i].plant_income
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
