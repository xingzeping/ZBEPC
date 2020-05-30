<template>
  <div class="app-container">
    <div class="container searchBar">
      <!--<h3>月报表</h3>-->
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
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="pq" label="片区">
        </el-table-column>
        <el-table-column prop="fgs" label="分公司">
        </el-table-column>
        <el-table-column prop="name" label="环保站">
        </el-table-column>
        <el-table-column prop="yield" label="猪粪产生量/吨">
        </el-table-column>
        <el-table-column prop="cumulant" label="猪粪累计量/吨">
        </el-table-column>
        <el-table-column prop="sales" label="猪粪销售/转出量/吨">
        </el-table-column>
        <el-table-column prop="storage" label="猪粪库存量/吨">
        </el-table-column>
        <el-table-column prop="unitPrice" label="销售单价元/吨">
        </el-table-column>
        <el-table-column prop="income" label="销售收入">
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
		name: 'pigManure',
		data() {
			return {
				searchForm: {},
				visibleFileDialog: false,
				currentPage: 1,
				date: new Date(),
				pageSize: 10,
				pageNum:1,
				projectData: [],
				templateList: [],
				fileData: {},
				total: 0,
				states: projectStatus,
				title:"猪粪记录月报"
			}
		},
		mounted() {
			this.requestPageData(1)
		},
		methods: {
			timeFormat: function(time, type) { // 日期格式化
				if (type === 1) {
					return timeFormat(time, 'yyyy-MM-dd')
				} else {
					return timeFormat(time, 'yyyy-MM')
				}
			},
			handleCurrentChange(page) {
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
			        url: `ZBEPS/pigManure/count/10000/1`,
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
			          const tHeader = ['片区', '分公司','环保站','猪粪产生量/吨','猪粪累计量/吨','猪粪销售/转出量/吨','猪粪库存量/吨','销售单价元/吨','销售收入']
			      	  const filterVal = [ 'pq', 'fgs','name','yield','cumulant','sales','storage','unitPrice','income']
							  const list = dd
							  const titlename = this.title
							  this.$exportExcel(tHeader,filterVal,list,titlename)
			        }
			      }).catch(error => {
			        v.$message.error(`查询出错:${error}`)
			      })
			    },
			search() {
				const v = this
				this.searchForm.year= this.date.getFullYear()+"";
				this.searchForm.month = (this.date.getMonth()+1)+"";
				this.searchForm.pageSize = this.pageSize;
				this.searchForm.pageNum = this.pageNum;
				request({
				  url: `ZBEPS/pigManure/count/${this.pageSize}/1`,
				  method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
				  data: JSON.stringify(this.searchForm)
				  // data: this.searchForm
				}).then(response => {
					if (response.status === 200) {
						v.projectData.splice(0, v.projectData.length)
						for (var i in response.data.list) {
							v.projectData.push(response.data.list[i])
						}
						v.total = response.data.total
					}
				}).catch(error => {
					v.$message.error(`查询出错:${error}`)
				})
			},
			resetForm() {
				this.searchForm = {}
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.requestPageData(1)
			},
			requestPageData(page) { // 请求分页数据
				const v = this
				this.searchForm.year= this.date.getFullYear()+"";
				this.searchForm.month = (this.date.getMonth()+1)+"";
				this.searchForm.pageSize = this.pageSize;
				this.searchForm.pageNum = page;
				request({
				  url: `ZBEPS/pigManure/count/${this.pageSize}/${page}`,
				  method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
				  data: JSON.stringify(this.searchForm)
				  // params: this.searchForm
				}).then(response => {
					console.log()
					if (response.status !== 200) {
						v.$message.error('查询出错')
					} else {
						v.projectData.splice(0, v.projectData.length)
						for (var i in response.data.list) {
							v.projectData.push(response.data.list[i])
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
