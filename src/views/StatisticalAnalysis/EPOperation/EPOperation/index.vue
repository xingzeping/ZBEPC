<template>
  <div class="app-container">
    <div class="container searchBar">
      <!--<h3>环保运营分析</h3>-->
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
              <el-date-picker v-model="date" type="month" placeholder="选择月份" style="width: 100% ;"/>
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
      <el-table :data="projectData" border show-summary >
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="pq_name" label="片区">
        </el-table-column>
        <el-table-column prop="fgs_name" label="分公司">
        </el-table-column>
        <el-table-column prop="name" label="环保站">
        </el-table-column>
        <el-table-column prop="income" label="收入（万元）">
        </el-table-column>
        <el-table-column prop="s_cost" label="成本（万元）">
        </el-table-column>
        <el-table-column prop="forfeit" label="行政罚款">
        </el-table-column>
        <el-table-column prop="profit" label="本月利润">
        </el-table-column>
        <el-table-column prop="ls_cost" label="上月实际">
        </el-table-column>
        <el-table-column prop="ratio" label="环比增减">
        </el-table-column>
        <el-table-column prop="use_total" label="污水处理（吨）">
        </el-table-column>
        <el-table-column prop="avgWater" label="单吨污水成本（元/吨）">
        </el-table-column>
        <el-table-column prop="s_depreciation" label="折旧成本（万元）">
        </el-table-column>
        <el-table-column prop="avgWater2" label="除折旧单吨污水处理成本">
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
</template>

<script>
import request from '@/utils/request'
import { projectStatus } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'EPOperation',
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
      title:"环保运营分析月报"
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
			      request({
			        url: `ZBEPS/finance/operate`,
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
			          	dd[i].income = dd[i].income==null?null:(dd[i].income ).toFixed(2);
			          	dd[i].s_cost = dd[i].s_cost==null?null:(dd[i].s_cost ).toFixed(2);
			          	dd[i].forfeit = dd[i].forfeit==null?null:(dd[i].forfeit ).toFixed(2);
			          	dd[i].profit = dd[i].profit==null?null:(dd[i].profit ).toFixed(2);
			          	dd[i].ls_cost = dd[i].ls_cost==null?null:(dd[i].ls_cost ).toFixed(2);
			          	dd[i].ratio = dd[i].ratio==null?null:(dd[i].ratio ).toFixed(2);
			          	dd[i].use_total = dd[i].use_total==null?null:(dd[i].use_total ).toFixed(2);
			          	dd[i].avgWater = dd[i].avgWater==null?null:(dd[i].avgWater ).toFixed(2);
			          	dd[i].s_depreciation = dd[i].s_depreciation==null?null:(dd[i].s_depreciation ).toFixed(2);
			          	dd[i].avgWater2 = dd[i].avgWater2==null?null:(dd[i].avgWater2 ).toFixed(2);
			          }
			          const tHeader = ['片区', '分公司','环保站','收入（万元）','成本（万元）','行政罚款','本月利润','上月实际','环比增减','污水处理（吨）','单吨污水成本（元/吨）','折旧成本（万元）','除折旧单吨污水处理成本']
			      	  const filterVal = [ 'pq_name', 'fgs_name','name','income','s_cost','forfeit','profit','ls_cost','ratio','use_total','avgWater','s_depreciation','avgWater2']
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
			// .log(this.searchForm.date);
 			this.searchForm.year= this.date.getFullYear()+"";
 			this.searchForm.month = (this.date.getMonth()+1)+"";
			// TODO
      request({
        url: `ZBEPS/finance/operate`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
        // params: this.searchForm
      }).then(response => {
        if (response.status === 200) {
          v.projectData = response.data
          for(var i in v.projectData){
          	v.projectData[i].income = v.projectData[i].income==null?null:(v.projectData[i].income ).toFixed(2);
          	v.projectData[i].s_cost = v.projectData[i].s_cost==null?null:(v.projectData[i].s_cost ).toFixed(2);
          	v.projectData[i].forfeit = v.projectData[i].forfeit==null?null:(v.projectData[i].forfeit ).toFixed(2);
          	v.projectData[i].profit = v.projectData[i].profit==null?null:(v.projectData[i].profit ).toFixed(2);
          	v.projectData[i].ls_cost = v.projectData[i].ls_cost==null?null:(v.projectData[i].ls_cost ).toFixed(2);
          	v.projectData[i].ratio = v.projectData[i].ratio==null?null:(v.projectData[i].ratio ).toFixed(2);
          	v.projectData[i].use_total = v.projectData[i].use_total==null?null:(v.projectData[i].use_total ).toFixed(2);
          	v.projectData[i].avgWater = v.projectData[i].avgWater==null?null:(v.projectData[i].avgWater ).toFixed(2);
          	v.projectData[i].s_depreciation = v.projectData[i].s_depreciation==null?null:(v.projectData[i].s_depreciation ).toFixed(2);
          	v.projectData[i].avgWater2 = v.projectData[i].avgWater2==null?null:(v.projectData[i].avgWater2 ).toFixed(2);
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
      request({
        url: `ZBEPS/finance/operate`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
      }).then(response => {
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          v.projectData = response.data
          for(var i in v.projectData){
          	v.projectData[i].income = v.projectData[i].income==null?null:(v.projectData[i].income ).toFixed(2);
          	v.projectData[i].s_cost = v.projectData[i].s_cost==null?null:(v.projectData[i].s_cost ).toFixed(2);
          	v.projectData[i].forfeit = v.projectData[i].forfeit==null?null:(v.projectData[i].forfeit ).toFixed(2);
          	v.projectData[i].profit = v.projectData[i].profit==null?null:(v.projectData[i].profit ).toFixed(2);
          	v.projectData[i].ls_cost = v.projectData[i].ls_cost==null?null:(v.projectData[i].ls_cost ).toFixed(2);
          	v.projectData[i].ratio = v.projectData[i].ratio==null?null:(v.projectData[i].ratio ).toFixed(2);
          	v.projectData[i].use_total = v.projectData[i].use_total==null?null:(v.projectData[i].use_total ).toFixed(2);
          	v.projectData[i].avgWater = v.projectData[i].avgWater==null?null:(v.projectData[i].avgWater ).toFixed(2);
          	v.projectData[i].s_depreciation = v.projectData[i].s_depreciation==null?null:(v.projectData[i].s_depreciation ).toFixed(2);
          	v.projectData[i].avgWater2 = v.projectData[i].avgWater2==null?null:(v.projectData[i].avgWater2 ).toFixed(2);
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
