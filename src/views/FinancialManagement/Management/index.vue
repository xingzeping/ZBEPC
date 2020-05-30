<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>月度经营情况表</h3> -->
      <el-form ref="searchForm" :model="searchForm" label-position="right" class="form-container">
        <el-row :gutter="30">
          <!-- <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
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
          </el-col> -->
					
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="日期:" class="postInfo-container-item" >
              <el-date-picker v-model="date" type="month" placeholder="选择日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-form-item style="float: right;">
              <el-button type="primary" @click="search">查询</el-button>
						  <el-button type="primary" @click="exportExcel">导出</el-button>
              <!-- <el-button @click="resetForm">重置</el-button> -->
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
				<el-table-column label="污水处理（吨）">
        	<el-table-column prop="w_total" label="污水站">
        	</el-table-column>
        	<el-table-column prop="x_total" label="消纳量">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="收入（万元）">
        	<el-table-column prop="TotalIncome" label="合计">
        	</el-table-column>
        	<el-table-column prop="sewage_handle_price" label="污水站">
        	</el-table-column>
        	<el-table-column prop="plant_income" label="种植">
        	</el-table-column>
        	<el-table-column prop="fertilizer_income" label="有机肥">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="成本（万元）">
        	<el-table-column prop="TotalCost" label="合计">
        	</el-table-column>
        	<el-table-column prop="s_cost" label="污水站">
        	</el-table-column>
        	<el-table-column prop="p_cost" label="种植">
        	</el-table-column>
        	<el-table-column prop="f_cost" label="有机肥">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="行政罚款（万元）">
        	<el-table-column prop="national_forfeit" label="国家级">
        	</el-table-column>
        	<el-table-column prop="provincial_forfeit" label="省级及以下">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="本月利润" prop="profit" />
      </el-table>
      <!-- <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10,20,50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/> -->
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { projectStatus } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'Management',
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
      title:"月度经营情况表"
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
			          	dd[i].TotalIncome = (dd[i].sewage_handle_price+dd[i].plant_income+dd[i].fertilizer_income).toFixed(2);
			          	dd[i].TotalCost = (dd[i].s_cost+dd[i].p_cost+dd[i].f_cost).toFixed(2);
			          	dd[i].profit =(dd[i].TotalIncome-dd[i].TotalCost).toFixed(2)
			          	
			          }
			          const tHeader = ['组织单位', '全称','污水处理-污水站（吨）','污水处理-消纳量（吨）','收入-合计（万元）','收入-污水站（万元）','收入-种植（万元）','收入-有机肥（万元）','成本-合计（万元）','成本-污水站（万元）','成本-种植（万元）','成本-有机肥（万元）','行政罚款-国家级（万元）','行政罚款-省级及以下（万元）','本月利润']
			      	  const filterVal = [ 'name', 'fullname','w_total','x_total','TotalIncome','sewage_handle_price','plant_income','fertilizer_income','TotalCost','s_cost','p_cost','f_cost','national_forfeit','provincial_forfeit','profit']
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
//			this.searchForm.pageSize = this.pageSize;
//			this.searchForm.pageNum = this.pageNum;
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
          console.log(v.projectData)
          for(var i in v.projectData){
          	v.projectData[i].TotalIncome = (v.projectData[i].sewage_handle_price+v.projectData[i].plant_income+v.projectData[i].fertilizer_income).toFixed(2);
          	v.projectData[i].TotalCost = (v.projectData[i].s_cost+v.projectData[i].p_cost+v.projectData[i].f_cost).toFixed(2);
          	v.projectData[i].profit =(v.projectData[i].TotalIncome-v.projectData[i].TotalCost).toFixed(2)
          	
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
//			this.searchForm.pageSize = this.pageSize;
//			this.searchForm.pageNum = page
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
          }
        	for(var i in v.projectData){
          	v.projectData[i].TotalIncome = (v.projectData[i].sewage_handle_price+v.projectData[i].plant_income+v.projectData[i].fertilizer_income).toFixed(2);
          	v.projectData[i].TotalCost = (v.projectData[i].s_cost+v.projectData[i].p_cost+v.projectData[i].f_cost).toFixed(2);
          	v.projectData[i].profit =(v.projectData[i].TotalIncome-v.projectData[i].TotalCost).toFixed(2)
          	
          }
          v.total = response.data.total
        
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
