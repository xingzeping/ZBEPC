<template>
	<div class="app-container">
		<div class="container searchBar">
			<!-- <h3>种植信息</h3> -->
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
			              <el-input v-model="searchForm.epName" placeholder="请输入环保站"/>
			            </el-form-item>
			         </el-col>
			         <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
						<el-form-item label="日期:" class="postInfo-container-item">
							<el-date-picker v-model="searchForm.createTimeStr" type="month" value-format="yyyy-MM" placeholder="选择月份" style="width: 100% ;" />
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
				<el-table-column label="片区" prop="pq" />
				<el-table-column label="分公司" prop="fgs" />
				<el-table-column label="环保站" prop="epName" />
				<el-table-column label="作物名" prop="name" />
				<el-table-column label="日期" prop="time1">
       			</el-table-column>
				<el-table-column label="种植面积/亩" prop="acreage" />
				<el-table-column label="种植地块形状" prop="landShape" />
				<el-table-column label="种植时间">
					<template slot-scope="scope">
						{{timeFormat(scope.row.plantTime,1)}}
					</template>
				</el-table-column>
				<el-table-column label="采收月份" prop="harvestMonth" />
				<el-table-column label="采收产量/公斤" prop="harvestYield" />
				<el-table-column label="亩产/公斤" prop="unitYield" />
				<el-table-column label="销售量/公斤" prop="salesVolume" />
				<el-table-column label="销售金额" prop="unitPrice" />
				<el-table-column label="状态" prop="status" />
				<el-table-column label="录入人" prop="creatorName" />
				<el-table-column label="审核人" prop="auditorName" />
				<el-table-column label="录入时间">
					<template slot-scope="scope">
						{{timeFormat(scope.row.createTime,1)}}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page.sync="currentPage" :page-size="pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper"
			 @size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>
	</div>
</template>

<script>
import request from '@/utils/request'
import { projectStatus } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'plant',
  data () {
    return {
      searchForm: {},
      visibleFileDialog: false,
	  date: new Date(),
      currentPage: 1,
      pageSize: 10,
	  pageNum:1,
      projectData: [],
      templateList: [],
      fileData: {},
      total: 0,
      states: projectStatus,
      title:"种植信息"
    }
  },
  mounted () {
    this.requestPageData(1)
//  this.searchForm.createTimeStr = timeFormat(this.date,'yyyy-MM')
	this.$set(this.searchForm,'createTimeStr',timeFormat(this.date,'yyyy-MM'))
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
        url: `ZBEPS/plantRecord/list/10000/1`,
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
          for(var i in dd){
          	dd[i].time1 = v.searchForm.createTimeStr
		    dd[i].plantTime1 = timeFormat(dd[i].plantTime,'yyyy-MM-dd')
		    dd[i].createTime1 = timeFormat(dd[i].createTime,'yyyy-MM-dd')
		    if(dd[i].status===0){
				dd[i].status="未审核"
			}else{
				dd[i].status="已审核"
			}
		  }
          const tHeader = ['片区', '分公司','环保站','作物名','日期','种植面积/亩','种植地块形状','种植时间','采收月份','采收产量/公斤','亩产/公斤','销售量/公斤','销售金额','状态','录入人','审核人','录入时间']
      		const filterVal = [ 'pq', 'fgs','epName','name','time1','acreage','landShape','plantTime1','harvestMonth','harvestYield','unitYield','salesVolume','unitPrice','status','creatorName','auditorName','createTime1']
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
		this.searchForm.pageSize = this.pageSize;
		this.searchForm.pageNum = this.pageNum;
		// TODO
      request({
        url: `ZBEPS/plantRecord/list/${this.pageSize}/1`,
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
          		v.projectData[i].time1 = v.searchForm.createTimeStr
				if(v.projectData[i].status===0){
					v.projectData[i].status="未审核"
				}else{
					v.projectData[i].status="已审核"
				}
			}
			console.log(v.projectData)
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
		this.searchForm.pageSize = this.pageSize;
		this.searchForm.pageNum = page;
      request({
        url: `ZBEPS/plantRecord/list/${this.pageSize}/${page}`,
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
          		v.projectData[i].time1 = v.searchForm.createTimeStr
				if(v.projectData[i].status===0){
					v.projectData[i].status="未审核"
				}else{
					v.projectData[i].status="已审核"
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
	.searchBar {
		padding: 20px 20px 0px 0px;

		.el-form-item {
			display: flex;
		}

		label.el-form-item__label {
			width: 140px !important;
			display: inline-block !important;
		}

		.el-form-item__content {
			flex: 1 !important;
		}

	}

	.el-table th {
		text-align: center;
	}
	.el-table td {
		text-align: center;
	}

	.dataContent {
		padding: 20px;
		text-align: right;
	}
</style>
