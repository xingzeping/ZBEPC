<template>
  <div class="app-container">
    <div class="container searchBar">
      <!-- <h3>环保财务管理基础数据</h3> -->
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
              <el-date-picker v-model="oldDate" type="month" value-format="yyyy-MM" placeholder="选择日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <el-form-item style="float: right;">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="primary">导出模板</el-button>
        			<el-button type="primary" @click="formDialogVisible = true">导入Excel</el-button>
              <!--<el-button @click="importExcel">导入Excel</el-button>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="container dataContent">
		<div class="btn" style="margin-bottom:10px;">
			<el-button type="primary" size="small" @click="handleAdd">增加<i class="el-icon-plus"></i></el-button>
		</div>
		
				<el-table :data="projectData" border show-summary>
					<el-table-column label="序号" type="index" />
					<el-table-column label="组织单位" prop="inCod">
						<!-- 下拉选择组织单位 -->
						<template slot-scope="scope">
							<el-select v-model="scope.row.epName" placeholder="请选择" v-if="!scope.row.epName" size="small">
								<el-option
									v-for="item in options"
									:key="item.epName"
									:label="item.label"
									:value="item.epName">
								</el-option>
							</el-select>
							<el-input  v-if="scope.row.epName" v-model="scope.row.epName" size="small" disabled></el-input>
							<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.org}}</span> -->
						</template>
					</el-table-column>
					<el-table-column label="全称" prop="fullorg">
						<template slot-scope="scope">
							<el-input type="textarea" v-if="true" v-model="scope.row.name" size="small"></el-input>
							<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.fullorg}}</span> -->
						</template>
					</el-table-column>
					<el-table-column label="人数" prop="number">
						<template slot-scope="scope">
							<el-input v-if="true" v-model="scope.row.number" size="small"></el-input>
							<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.number}}</span> -->
						</template>
					</el-table-column>
					<el-table-column label="环保站（万元）">
						<el-table-column prop="wages" label="工资">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sWages" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="welfare" label="福利">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sWelfare" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="WaterAndElectricity" label="水电费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sWaterElectric" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="LandCost" label="土地费用分摊">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sLand" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="RepairCost" label="修理费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sRepair" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="DepreciationCost" label="折旧费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sDepreciation" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="ChargeCost" label="搬运费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sTransport" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="LowValue" label="低值">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sLow" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="Other" label="其它">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.sOther" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="有机肥（万元）">
						<el-table-column prop="PadCost" label="垫料成本">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fCost" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="wages1" label="工资">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fWages" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="welfare1" label="福利">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fWelfare" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="WaterAndElectricity1" label="水电费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fWaterElectric" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="RepairCost1" label="修理费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fRepair" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="DepreciationCost1" label="折旧费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fDepreciation" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="ChargeCost1" label="搬运费">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fTransport" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="LowValue1" label="低值易耗品">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fLow" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="Other1" label="其他">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.fOther" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="种植（万元）">
						<el-table-column prop="LandRent" label="土地租金">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pLand" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="seed" label="种子">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pSeed" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="chemicalFertilizer" label="化肥">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pFertilizer" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="wages2" label="工资福利">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pWages" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="assetsDepreciation" label="固定资产折旧">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pDepreciation" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="Other2" label="其他">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.pOther" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="行政罚款（万元）">
						<el-table-column prop="national" label="国家级">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.nationalForfeit" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
						<el-table-column prop="Provincial" label="省级及以下">
							<template slot-scope="scope">
								<el-input v-if="true" v-model="scope.row.provincialForfeit" size="small"></el-input>
								<!-- <span v-if="!showEdit[scope.$index]">{{scope.row.url}}</span> -->
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<div class="btn" style="margin-top:20px;">
					<el-button type="primary" size="small" @click="submitNew">保存</el-button>
				</div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="formDialogVisible"
      width="500px">
			
      <!--<input type="file" runat="server" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" v-show="false" id="importExcel" @change="excelFileChange($event)">-->
      <el-form label-width="140px">
        <el-form-item label="请选择月份:" >
              <el-date-picker v-model="exportdate" type="month" value-format="yyyy-MM" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="请选择文件" >
        	<!-- <el-button @click="importExcel" type="primary" :loading="loading">选择导入文件</el-button> -->
					<input id="upload" ref="file" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </el-form-item>
			
	</el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmDate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { export_excel_to_json, export_json_to_excel } from '@/utils/operExcel'
import request from '@/utils/request'
import { projectStatus } from '@/api/enum/bidProject'
import { timeFormat } from '@/utils/dateUtils'
import { getToken } from '@/utils/auth'
import moment from 'moment'
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'CostStructure',
  data () {
    return {
      formDialogVisible: false,
      searchForm: {},
//			date: new Date(),
      visibleFileDialog: false,
      currentPage: 1,
      pageSize: 10,
			pageNum:1,
			oldDate:'',
      projectData:[
			],
      templateList:[],
      fileData: {},
			total: 0,
      states: projectStatus,
      exportFile: null,
			exportdate:'',
			value:'',
			options: [{
          epName: '三泉A区',
          label: '三泉A区'
        }, {
          epName: '三泉B区',
          label: '三泉B区'
        }, {
          epName: '三泉C区',
          label: '三泉C区'
        }, {
          epName: '三泉D区',
          label: '三泉D区'
        }, {
          epName: '三泉E区',
          label: '三泉E区'
        }],
      loading:false
    }
	},
	computed: {
			rowValue (e,b) {
				if(e) {
					return e;
				}else {
					return b
				}
			}
	},
  mounted () {
		this.requestPageData(1);
		this.oldDate = moment(Date.now()).format('YYYY-MM');
		
		console.log(this.oldDate)
		console.log(this.projectData);
		console.log(this.exportdate)
  },
  methods: {
		// 下拉选项
		handleCommand(command) {
			// this.names = command;
        console.log(command)
			},
			 handleRemove(file, fileList) {
        console.log(file, fileList);
      },
	handleAdd (){
		this.projectData.push({});
		
    },
  	
	// 确认
	confirmDate () {
			console.log(this.outdata)
			console.log( this.$refs.file.files);
			this.oldDate = this.exportdate ;
			if (!this.exportdate) {
				this.$message.error('请选择月份');
			}else if(this.$refs.file.files.length<1){
				this.$message.error('请选择文件上传');
			}else {
				this.formDialogVisible = false;
				this.submit();
				// this.$set(this.$data,'projectData', this.outdata);
			}
	},


    
    submit(){
				console.log(this.exportdate);
				const v = this;
        let param = new FormData(); //创建form对象
        param.append('file',this.$refs.file.files[0]);//通过append向form对象添加数据
        param.append('date',v.exportdate);
        console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers:{'Content-Type':'multipart/form-data'},
        }; //添加请求头
        config.headers['Authentication'] = getToken()
        let url = process.env.BASE_API+"/ZBEPS/finance/import"
        axios.post(url,param,config
        ).then(response=>{
          if (response.status === 200) {
						let data = this.exportdate
						this.getList(data);
          v.$message({
          message: '提交成功',
          type: 'success'
						});
						
        	this.formDialogVisible = false
        	}
        }).catch(error => {
        v.$message.error(`插入出错:${error}`)
      })
      },
		getList (data) {
			const v = this;
		
			request({
				url: 'ZBEPS/finance/list?date='+data,
				method: 'get',
				// params: this.searchForm
			}).then(response => {
				if (response.status === 200) {
					v.$message({
					message: '提交成功',
					type: 'success'
					});
					this.projectData = response.data;
				}
			}).catch(error => {
				v.$message.error(`查询出错:${error}`)
			})
		},
		submitNew() {
			console.log(this.projectData);
			request({
					url: 'ZBEPS/finance/insert',
					method: 'post',
					data: {
						date:this.oldDate,
						list:this.projectData
					}
				}).then(response => {
					if (response.status === 200) {
						v.$message({
						message: '提交成功',
						type: 'success'
						});
						this.projectData = response.data;
					}
				}).catch(error => {
					v.$message.error(`提交出错:${error}`)
				})
		},
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
		let data = this.oldDate;
		this.getList(data);
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
    }
  }
}
</script>

<style lang="scss">
.el-input.is-disabled {
	.el-input__inner {
		background-color: #fff;
		color: #606266;
	}
}
.el-input__suffix {
	right: 0px;
	top: 5px;
}
.el-textarea__inner {
		width:100% !important;
		height: 50px !important;
		padding: 0 2px !important;
		border: none !important;
		resize:none;
		text-align: center;
	}
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
		padding: 0 !important;
	}
	.cell {
		display: flex !important;
		align-items: center;
		justify-content: center;
		padding: 0 !important; 
		height:50px !important;
	}
  .dataContent{
    padding: 20px;
	text-align: right;
	.el-input__inner {
		width:100% !important;
		height: 100% !important;
		padding: 0 2px !important;
		border: none !important;
		text-align: center;
	}
	.el-input {
		height: 100%;
	}
  }
</style>
