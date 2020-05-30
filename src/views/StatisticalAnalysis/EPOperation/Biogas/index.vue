<template>
  <div class="app-container">
    <div class="container searchBar">
      <!--<h3>月报表</h3>-->
      <el-form ref="searchForm" :model="searchForm" label-position="right" class="form-container">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
					<el-form-item label="片区:" class="postInfo-container-item">
						<el-input v-model="searchForm.pq" placeholder="请输入片区" />
					</el-form-item>
					</el-col>
		
					<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
						<el-form-item label="分公司:" class="postInfo-container-item">
							<el-input v-model="searchForm.fgs" placeholder="请输入分公司" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
						<el-form-item label="环保站:" class="postInfo-container-item">
							<el-input v-model="searchForm.epName" placeholder="请输入环保站" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
						<el-form-item label="日期:" class="postInfo-container-item">
							<el-date-picker v-model="searchForm.date" type="month" value-format="yyyy-MM" placeholder="选择月份" style="width: 100% ;" />
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
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="pq_name" label="片区">
        </el-table-column>
        <el-table-column prop="fgs_name" label="分公司">
        </el-table-column>
        <el-table-column prop="station_name" label="环保站">
        </el-table-column>
        <el-table-column label="年月" prop="date">
			</el-table-column>
        <el-table-column prop="pond_name" label="沼液塘名称">
        </el-table-column>
        <el-table-column prop="volume" label="总容积/方">
        </el-table-column>
        <el-table-column prop="water_quantity" label="现存水量/方">
        </el-table-column>
        <el-table-column prop="dam_meter" label="坝坡读数/米">
        </el-table-column>
        <el-table-column prop="hc" label="缓存天数">
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
  name: 'biogas',
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
      title:"沼液塘水量月报"
    }
  },
  mounted () {
    this.requestPageData(1)
		this.$set(this.searchForm,'date',timeFormat(this.date,'yyyy-MM'))
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
				v.searchForm.pageSize = 10000;
				v.searchForm.pageNum = this.pageNum;
				// TODO
			      request({
			        url: `ZBEPS/biogasRecord/monthly`,
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
			          for (var i in dd){
			          	dd[i].date = v.searchForm.date
			          }
			          const tHeader = ['片区', '分公司','环保站','年月','沼液塘名称','总容积/方','现存水量/方','坝坡读数/米','缓存天数']
			      	  const filterVal = [ 'pq_name', 'fgs_name','station_name','date','pond_name','volume','water_quantity','dam_meter','hc']
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
// 			this.searchForm.year= this.date.getFullYear()+"";
// 			this.searchForm.month = (this.date.getMonth()+1)+"";
			this.searchForm.pageSize = this.pageSize;
			this.searchForm.pageNum = this.pageNum;
			// TODO
      request({
        url: `ZBEPS/biogasRecord/monthly`,
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
          for (var i in v.projectData){
          	v.projectData[i].date = v.searchForm.date
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
//			this.searchForm.year= this.date.getFullYear()+"";
//			this.searchForm.month = (this.date.getMonth()+1)+"";
			this.searchForm.pageSize = this.pageSize;
			this.searchForm.pageNum = page;
      request({
        url: `ZBEPS/biogasRecord/monthly`,
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
          for (var i in v.projectData){
          	v.projectData[i].date = v.searchForm.date
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
  .dataContent{
    padding: 20px;
    text-align: right;
  }
</style>
