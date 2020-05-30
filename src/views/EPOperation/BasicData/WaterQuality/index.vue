<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>水质管理</h3> -->
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

					<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
						<el-form-item label="水质类型:" class="postInfo-container-item" >
              <el-select v-model="searchForm.type" placeholder="请选择类型">
						    <el-option
						      v-for="item in states"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
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
        <el-table-column label="日期" prop="time">
        </el-table-column>
        <el-table-column prop="solid" label="厌氧进水含固率/%">
        </el-table-column>
        <el-table-column prop="inCod" label="COD">
        </el-table-column>
        <el-table-column prop="inAmmoniaNitrogen" label="氨氮">
        </el-table-column>
        <el-table-column prop="type" label="水质类型">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="录入人" prop="creatorName" />
				<el-table-column label="审核人" prop="auditorName" />
				<el-table-column label="录入时间">
					<template slot-scope="scope">
						{{timeFormat(scope.row.createTime,1)}}
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
</template>

<script>
import request from '@/utils/request'
import { waterType } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'waterQuality',
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
      states: waterType,
      title:"水质管理",
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
			        url: `ZBEPS/WaterQuality/list/10000/1`,
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
			          	dd[i].time1 = timeFormat(v.date,'yyyy-MM')
							    dd[i].createTime1 = timeFormat(dd[i].createTime,'yyyy-MM-dd')
							    if(dd[i].status===0){
										dd[i].status="未审核"
									}else{
										dd[i].status="已审核"
										if(dd[i].type==="IN"){
											dd[i].type="厌氧进水水质"
										}else if(dd[i].type==="OUT"){
											dd[i].type="厌氧出水水质"
										}else if(dd[i].type==="A/O"){
											dd[i].type="A/O出水水质"
										}else{
											dd[i].type="无"
										}
									}
							  }
			          const tHeader = ['片区', '分公司','环保站','日期','厌氧进水含固率/%','COD','氨氮','水质数据类型','状态','录入人','审核人','录入时间']
			      		const filterVal = [ 'pq', 'fgs','name','time1','solid','inCod','inAmmoniaNitrogen','type','status','creatorName','auditorName','createTime1']
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
        url: `ZBEPS/WaterQuality/list/${this.pageSize}/1`,
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
          debugger
					for(var i in v.projectData){
						v.projectData[i].time =  timeFormat(v.date,'yyyy-MM');
						if(v.projectData[i].status===0){
							v.projectData[i].status="未审核"
						}else{
							v.projectData[i].status="已审核"
						}
						if(v.projectData[i].type==="IN"){
							v.projectData[i].type="厌氧进水水质"
						}else if(v.projectData[i].type==="OUT"){
							v.projectData[i].type="厌氧出水水质"
						}else if(v.projectData[i].type==="A/O"){
							v.projectData[i].type="A/O出水水质"
						}else{
							v.projectData[i].type="无"
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
        url: `ZBEPS/WaterQuality/list/${this.pageSize}/${page}`,
        method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
        data: JSON.stringify(this.searchForm)
      }).then(response => {
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          v.projectData.splice(0, v.projectData.length)
          for (var i in response.data.list) {
            v.projectData.push(response.data.list[i])
          }
					for(var i in v.projectData){
						v.projectData[i].time =  timeFormat(v.date,'yyyy-MM');
						if(v.projectData[i].status===0){
							v.projectData[i].status="未审核"
						}else{
							v.projectData[i].status="已审核"
						}
						if(v.projectData[i].type==="IN"){
							v.projectData[i].type="厌氧进水水质"
						}else if(v.projectData[i].type==="OUT"){
							v.projectData[i].type="厌氧出水水质"
						}else if(v.projectData[i].type==="A/O"){
							v.projectData[i].type="A/O出水水质"
						}else{
							v.projectData[i].type="无"
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
