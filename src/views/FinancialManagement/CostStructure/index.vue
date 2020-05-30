<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>环保成本构成表</h3> -->
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
              <el-date-picker v-model="searchForm.date" type="month" value-format='yyyy-MM' placeholder="选择日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-form-item style="float: right;">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="exportExcel" v-loading="exportLoading">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="container dataContent">
      <el-table :data="projectData" border show-summary>
				<el-table-column label="序号" type="index" />
				<el-table-column label="组织单位" prop="epName" />
				<el-table-column label="全称" prop="name" />
				<el-table-column label="人数" prop="number" />
				<el-table-column label="环保站（万元）">
        	<el-table-column prop="sWages" label="工资">
        	</el-table-column>
        	<el-table-column prop="sWelfare" label="福利">
        	</el-table-column>
        	<el-table-column prop="sWaterElectric" label="水电费">
        	</el-table-column>
        	<el-table-column prop="sLand" label="土地费用分摊">
        	</el-table-column>
        	<el-table-column prop="sRepair" label="修理费">
        	</el-table-column>
        	<el-table-column prop="sDepreciation" label="折旧费">
        	</el-table-column>
        	<el-table-column prop="sTransport" label="搬运费">
        	</el-table-column>
        	<el-table-column prop="sLow" label="低值">
        	</el-table-column>
        	<el-table-column prop="sOther" label="其它">
        	</el-table-column>
        	<el-table-column prop="ssum" label="小计">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="有机肥（万元）">
        	<el-table-column prop="fCost" label="垫料成本">
        	</el-table-column>
        	<el-table-column prop="fWages" label="工资">
        	</el-table-column>
        	<el-table-column prop="fWelfare" label="福利">
        	</el-table-column>
        	<el-table-column prop="fWaterElectric" label="水电费">
        	</el-table-column>
        	<el-table-column prop="fRepair" label="修理费">
        	</el-table-column>
        	<el-table-column prop="fDepreciation" label="折旧费">
        	</el-table-column>
        	<el-table-column prop="fTransport" label="搬运费">
        	</el-table-column>
        	<el-table-column prop="fLow" label="低易耗值品">
        	</el-table-column>
        	<el-table-column prop="fOther" label="其他">
        	</el-table-column>
        	<el-table-column prop="fsum" label="小计">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="种植（万元）">
        	<el-table-column prop="pLand" label="土地租金">
        	</el-table-column>
        	<el-table-column prop="pSeed" label="种子">
        	</el-table-column>
        	<el-table-column prop="pFertilizer" label="化肥">
        	</el-table-column>
        	<el-table-column prop="pWages" label="工资福利">
        	</el-table-column>
        	<el-table-column prop="pDepreciation" label="固定资产折旧">
        	</el-table-column>
        	<el-table-column prop="pOther" label="其他">
        	</el-table-column>
        	<el-table-column prop="psum" label="小计">
        	</el-table-column>
        </el-table-column>
        <el-table-column label="合计" prop="sum" />
        <el-table-column label="行政罚款（万元）">
        	<el-table-column prop="nationalForfeit" label="国家级">
        	</el-table-column>
        	<el-table-column prop="provincialForfeit" label="省级及以下">
        	</el-table-column>
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
import { timeFormat,dateFormat } from '@/utils/dateUtils'
import qs from 'qs'
export default {
  name: 'CostStructure',
  data () {
    return {
      searchForm: {},
//			date: new Date(),
      visibleFileDialog: false,
      currentPage: 1,
      pageSize: 10,
			pageNum:1,
      projectData: [],
      templateList: [],
      fileData: {},
      total: 0,
      exportLoading: false,
      title: '环保成本构成表',
      states: projectStatus
    }
  },
  mounted () {
    this.$set(this.searchForm,'date',dateFormat(new Date(),'yyyy-MM'))
    this.requestPageData(1)
//  if(this.searchForm.date === null){
//  	this.ct_month= new Date();
//  	this.searchForm.date = this.ct_month.getTime() - 3600 * 1000 * 24 * 30;
//  }
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
    search () {
			const v = this
			// console.log(this.searchForm.date);
      request({
        // url: `ZBEPS/finance/list?date=`+v.searchForm.date,
        url: `ZBEPS/finance/list`,
        method: 'get',
        params: this.searchForm
      }).then(response => {
        if (response.status === 200) {
          v.projectData=response.data
          v.total = response.data.total
        }
      }).catch(error => {
        v.$message.error(`查询出错:${error}`)
      })
    },
    exportExcel () {
      const v = this
      request({
        url: `ZBEPS/finance/list`,
        method: 'get',
        params: this.searchForm
      }).then(response => {
        if (response.status === 200) {
          const dd = []
          debugger
          for (var i in response.data) {
            dd.push(response.data[i])
          }
          debugger
          for(var i in dd){
            //环保站小计
            const ssum = dd[i].sWages + dd[i].sWelfare + dd[i].sLand + dd[i].sRepair + dd[i].sDepreciation + dd[i].sTransport + dd[i].sLow + dd[i].sOther
            //有机肥小计
            const fsum = dd[i].fCost + dd[i].fWages + dd[i].fWelfare + dd[i].fWaterElectric + dd[i].fRepair + dd[i].fDepreciation + dd[i].fTransport + dd[i].fLow + dd[i].fOther
            //种植小计
            const psum = dd[i].pLand + dd[i].pSeed + dd[i].pFertilizer + dd[i].pWages + dd[i].pDepreciation + dd[i].pOther
            dd[i].ssum = ssum
            dd[i].fsum = fsum
            dd[i].psum = psum
            dd[i].sum = ssum + fsum + psum
          }
          const tHeader = ['组织单位','全称','人数','环保站-工资','环保站-福利','环保站-水电费','环保站-土地费用分摊', '环保站-修理费',
            '环保站-折旧费','环保站-搬运费','环保站-低值','环保站-其它','环保站小计','有机肥-垫料成本', '有机肥-工资','有机肥-福利','有机肥-水电费',
            '有机肥-修理费','有机肥-折旧费','有机肥-搬运费','有机肥-低易耗值品', '有机肥-其他','有机肥小计',
            '种植-土地租金','种植-种子','种植-化肥','种植-工资福利','种植-固定资产折旧','种植-其他','种植-小计',
            '合计','行政罚款-国家级','行政罚款-省级及以下']
          const filterVal = ['epName','name','number','sWages','sWelfare','sWaterElectric','sLand','sRepair','sDepreciation',
            'sTransport','sLow','sOther','ssum','fCost','fWages','fWelfare','fWaterElectric','fRepair','fDepreciation',
            'fTransport','fLow','fOther','fsum',
            'pLand','pSeed','pFertilizer','pWages','pDepreciation','pOther','psum',
            'sum','nationalForfeit','provincialForfeit']
          const list = dd
          const titlename = this.title
          this.$exportExcel(tHeader,filterVal,list,titlename)
        }
      }).catch(error => {
        v.$message.error(`查询出错:${error}`)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.requestPageData(1)
    },
    requestPageData (page) { // 请求分页数据
      const v = this
      request({
        url: `ZBEPS/finance/list`,
        method: 'get',
        params: this.searchForm
      }).then(response => {
        console.log()
        if (response.status !== 200) {
          v.$message.error('查询出错')
        } else {
          v.projectData=response.data
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
