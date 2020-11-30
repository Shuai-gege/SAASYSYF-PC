<template>
  <div class="app-container">
    <!-- 头部 -->
    <el-container>
      <el-header>任务详情</el-header>
    </el-container>
    <!-- 主体部分 -->
    <el-row :gutter="24">
      <el-col>任务编号：{{detailList.eventCode}}</el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 时间信息 -->
    <div class="paiBan">
      <span class="paiBanTitle">时间信息</span>
      <el-row :gutter="24">
        <el-col :span="6">报事时间：{{detailList.report_time | teShuTime}}</el-col>
        <!-- 开始执行时间 -->
        <el-col
          :span="6"
          v-if="detailList.startTime != null"
        >开始执行时间：{{detailList.startTime | teShuTime}}</el-col>
        <el-col
          :span="6"
          v-if="detailList.startTime == null &&detailList.event_status_now != 18&&detailList.event_status_now != 16"
        >开始执行时间：-</el-col>
        <el-col
          :span="6"
          v-if="detailList.event_status_now == 18"
        >开始执行时间：{{detailList.report_time | teShuTime}}</el-col>
        <el-col
          :span="6"
          v-if="detailList.event_status_now == 16"
        >开始执行时间：{{detailList.tbEventInvalidBean.createTime | teShuTime}}</el-col>

        <!-- 完成时间 -->
        <el-col
          :span="6"
          v-if="createTime != null&&detailList.event_status_now != 18&&detailList.event_status_now != 16"
        >完成时间：{{createTime|teShuTime}}</el-col>
        <el-col
          :span="6"
          v-else-if="detailList.event_status_now == 18"
        >完成时间：{{detailList.report_time | teShuTime}}</el-col>
        <el-col :span="6" v-else>完成时间：-</el-col>

        <!-- 结束时间 -->
        <el-col
          :span="6"
          v-if="createTime != null&&detailList.event_status_now != 18&&detailList.event_status_now != 16"
        >结束时间：{{checkTime|teShuTime}}</el-col>
        <el-col
          :span="6"
          v-else-if="detailList.event_status_now == 18"
        >结束时间：{{detailList.report_time | teShuTime}}</el-col>
        <el-col
          :span="6"
          v-else-if="detailList.event_status_now == 16"
        >结束时间：{{detailList.tbEventInvalidBean.agreeTime | teShuTime}}</el-col>
        <el-col :span="6" v-else>结束时间：-</el-col>
      </el-row>

      <!-- 事件总耗时 -->
      <el-row :gutter="24">
        <el-col
          :span="6"
          v-if="detailList.report_time != null&&detailList.event_status_now != 18&&detailList.event_status_now != 16"
        >事件总耗时：{{detailList.report_time | duoJiu(checkTime)}}</el-col>
        <el-col :span="6" v-else-if="detailList.event_status_now == 18">事件总耗时：0天0小时0分钟</el-col>
        <el-col
          :span="6"
          v-else-if="detailList.event_status_now == 16"
        >事件总耗时：{{detailList.tbEventInvalidBean.createTime|duoJiu(detailList.tbEventInvalidBean.agreeTime)}}</el-col>
        <el-col :span="6" v-else>事件总耗时：-</el-col>
        <!-- 规定工时 -->
        <el-col :span="6">规定工时：{{detailList.duration|haoMiaoZhuanHuan}}</el-col>
        <el-col
          :span="6"
          v-if="detailList.tbEventCompleteBeans"
        >实际工时：{{detailList.totalConsumeHours | haoMiao}}</el-col>
        <el-col :span="6" v-else>实际工时：-</el-col>
        <el-col :span="6">逾期状态：{{delay}}</el-col>
      </el-row>
    </div>
    <!-- 报事信息 -->
    <div class="paiBan">
      <span class="paiBanTitle">报事信息</span>
      <el-row :gutter="24">
        <el-col :span="6">报事人：{{detailList.reporter_name}}</el-col>
        <el-col :span="6">报事类型：{{detailList.event_type_name}}</el-col>
        <el-col
          :span="6"
          v-if="detailList.floor_name ==null && detailList.location_name==null"
        >位置信息：{{detailList.building_name}}</el-col>
        <el-col
          :span="6"
          v-else-if="detailList.location_name ==null"
        >位置信息：{{detailList.building_name}}/{{detailList.floor_name}}</el-col>
        <el-col
          :span="6"
          v-else
        >位置信息：{{detailList.building_name}}/{{detailList.floor_name}}/{{detailList.location_name}}</el-col>
        <el-col :span="6">详细位置描述：{{detailList.location_description}}</el-col>
        <el-col :span="6">问题描述：{{detailList.report_remark}}</el-col>
      </el-row>
      <!-- 报事照片 -->
      <div class="img">
        报事照片：
        <div class="demo-image__preview">
          <el-image
            style="width: 100px; height: 100px;margin:0 5px;"
            v-for="(item,i) in imgs"
            :key="i"
            :src="item"
            :preview-src-list="srcList"
          ></el-image>
        </div>
      </div>
    </div>
    <!-- 完工信息 -->
    <div class="paiBan" v-if="detailList.event_status_now != 18">
      <span class="paiBanTitle">完工信息</span>
      <el-row :gutter="24">
        <el-col :span="6">完工人：{{comName1}}</el-col>
        <el-col :span="6">完工描述：{{description}}</el-col>
      </el-row>
      <div class="img">
        完工照片：
        <div class="demo-image__preview">
          <el-image
            style="width: 100px; height: 100px;margin:0 5px;"
            v-for="(item,i) in imgs1"
            :key="i"
            :src="item"
            :preview-src-list="srcList1"
          ></el-image>
        </div>
      </div>
    </div>
    <!-- 验收信息 -->
    <div class="paiBan" v-if="detailList.event_status_now != 18">
      <span class="paiBanTitle">验收信息</span>
      <el-row :gutter="24">
        <el-col :span="6">验收人：{{checkUserName}}</el-col>
        <el-col :span="6" v-if="check_according == 1">验收方式：现场验收</el-col>
        <el-col :span="6" v-else>验收方式：照片验收</el-col>
        <el-col :span="6">验收描述：{{check_remark}}</el-col>
        <el-col :span="6">物料使用：{{wuliao}}</el-col>
      </el-row>
      <div class="img">
        验收照片：
        <div class="demo-image__preview">
          <el-image
            style="width: 100px; height: 100px;margin:0 5px;"
            v-for="(item,i) in imgs2"
            :key="i"
            :src="item"
            :preview-src-list="srcList2"
          ></el-image>
        </div>
      </div>
    </div>
    <!-- 评价信息 -->
    <div class="paiBan" v-if="detailList.event_status_now != 18">
      <span class="paiBanTitle">评价信息</span>
      <el-row :gutter="24">
        <el-col :span="6">被评人人：{{comName1}}</el-col>
        <el-col :span="6">评价综合得分：{{scoreAll}}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col class="img">
          服务态度：
          <el-rate
            v-model="value"
            :max="10"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col class="img">
          技术能力：
          <el-rate
            v-model="value1"
            :max="10"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col class="img">
          响应速度：
          <el-rate
            v-model="value2"
            :max="10"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </el-col>
      </el-row>
    </div>
    <!-- 进度 -->
    <!-- <div class="jinDu">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="createTime" label="时间" :formatter="formatDateTime"></el-table-column>
        <el-table-column prop="fromUserName" label="处理人"></el-table-column>
        <el-table-column prop="processRemark" label="处理过程"></el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>
        <el-table-column prop="address" label="图片"></el-table-column>
      </el-table>
    </div>-->
    <div class="jinDu">
      <div class="title">
        <el-row :gutter="24">
          <el-col :span="5">时间</el-col>
          <el-col :span="5">处理人</el-col>
          <el-col :span="5">处理过程</el-col>
          <el-col :span="5">描述</el-col>
          <el-col :span="4">照片</el-col>
        </el-row>
      </div>
      <div class="con">
        <el-row :gutter="24" v-for="(item,i) in detailList.tbEventLogBeans" :key="i">
          <el-col :span="5">{{item.createTime|teShuTime}}</el-col>
          <el-col :span="5">{{item.fromUserName}}</el-col>
          <el-col
            :span="5"
            v-if="item.log_remark == '分配事件'||item.log_remark == '上报事件'||item.log_remark == '转交事件'||item.log_remark == '退回事件被拒绝'||item.log_remark == '延期事件审核通过'||item.log_remark == '拒绝上报无效事件'||item.log_remark == '退回事件审核同意'||item.log_remark == '延期事件审核未通过'||item.log_remark == '无效事件审核通过'||item.log_remark == '事件验证不合格'||item.log_remark == '无效事件审核未通过'||item.log_remark == '合并事件'||item.log_remark == '日常事件上报并分配'"
          >{{item.processRemark}}{{item.toUserName}}处理</el-col>
          <!-- 完成事件 -->
          <el-col
            :span="5"
            v-if="item.log_remark == '完成事件'"
          >{{item.processRemark}}{{item.toUserName}}验收</el-col>
          <!-- 退回事件 -->
          <el-col
            :span="5"
            v-if="item.log_remark == '退回事件'||item.log_remark == '申请延期'||item.log_remark == '上报无效事件'"
          >{{item.processRemark}}{{item.toUserName}}</el-col>
          <!-- 验收合格 -->
          <el-col :span="5" v-if="item.log_remark == '事件验证合格'">{{item.processRemark}}</el-col>
          <!-- 自行处理 -->
          <el-col :span="5" v-if="item.log_remark == '自行处理'">{{item.processRemark}}</el-col>
          <!-- 合并 -->
          <el-col
            :span="5"
            v-if="item.log_remark == '被合并'"
          >{{item.processRemark}}{{item.toUserName}}</el-col>
          <el-col :span="5" v-if="detailList.event_status_now != 18">{{item.remark}}</el-col>
          <el-col :span="5" v-else>{{detailList.report_remark}}</el-col>
          <el-col :span="4" v-if="detailList.event_status_now != 18">
            <el-image
              v-for="(item1,i) in item.imgUrlList"
              :key="i"
              style="width: 20px; height: 20px;margin:0 5px;"
              :src="url + item1"
              :preview-src-list="[url + item1]"
            ></el-image>
          </el-col>
          <el-col :span="4" v-else>
            <el-image
              v-for="(item1,i) in detailList.imgUrlList"
              :key="i"
              style="width: 20px; height: 20px;margin:0 5px;"
              :src="url + item1"
              :preview-src-list="[url + item1]"
            ></el-image>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getEventInfoByEventId } from '@/api/iguard/orderDetails'
import { formatTimeToStr } from '@/utils/dateUtil' //处理后台传来的时间
export default {
  data() {
    return {
      srcList10: [],
      srcList: [],
      srcList1: [],
      srcList2: [],
      value: 0, //评分
      value1: 0, //评分
      value2: 0, //评分
      eventStatusNow: '', //事件状态
      event_id: '', //事件ID
      createTime: '', //完成时间
      nowTime: new Date(),
      detailList: {}, //任务详情数据
      imgs: [], //报事信息图片
      imgs1: [], //完工信息图片
      imgs2: [], //验收信息图片
      imgs3: [], //进度里的图片
      imgs10: [], //进度里的图片
      comName: [],
      comName1: '',
      description: '', //完工描述
      checkUserName: '', //验收人
      check_according: '', //验收方式
      check_remark: '', //验收描述
      scoreAll: '', //评价得分
      delay: '', //是否逾期
      checkTime: '', //验收时间
      tableData: [],
      wuliao: ''
    }
  },
  mounted() {
    this.url = localStorage.getItem('baseUrl')
    this.eventStatusNow = this.$route.query.eventStatusNow
    this.event_id = this.$route.query.event_id
    this.delay = this.$route.query.delay
    this.details(
      localStorage.getItem('uid'),
      this.eventStatusNow,
      this.event_id
    )
  },
  methods: {
    // 时间格式化
    // 时间格式化
    formatDateTime(row, column) {
      return formatTimeToStr(row.createTime, 'yyyy-MM-dd hh:mm:ss')
    },
    async details(uid, eventStatusNow, event_id) {
      try {
        const res = await getEventInfoByEventId(uid, eventStatusNow, event_id)
        this.detailList = res.result
        this.wuliao = res.result.wuliao.join(',')
        if (this.detailList.tbEventCompleteBeans.length <= 0) {
          // this.createTime = this.detailList.tbEventCompleteBeans[0].createTime
          // this.description = this.detailList.tbEventCompleteBeans[0].description
          // this.checkUserName = this.detailList.tbEventCompleteBeans[0].checkUserName
          // this.check_according = this.detailList.tbEventCompleteBeans[0].check_according
          // this.check_remark = this.detailList.tbEventCompleteBeans[0].check_remark
          // this.scoreAll = this.detailList.tbEventCompleteBeans[0].scoreAll
          // this.checkTime = this.detailList.tbEventCompleteBeans[0].checkTime
          // this.value = parseInt(res.result.tbEventCompleteBeans[0].star_one)
          // this.value1 = parseInt(res.result.tbEventCompleteBeans[0].star_two)
          // this.value2 = parseInt(res.result.tbEventCompleteBeans[0].star_three)
        } else {
          this.createTime = this.detailList.tbEventCompleteBeans[0].createTime
          this.description = this.detailList.tbEventCompleteBeans[0].description
          this.checkUserName = this.detailList.tbEventCompleteBeans[0].checkUserName
          this.check_according = this.detailList.tbEventCompleteBeans[0].check_according
          this.check_remark = this.detailList.tbEventCompleteBeans[0].check_remark
          this.scoreAll = this.detailList.tbEventCompleteBeans[0].scoreAll
          this.checkTime = this.detailList.tbEventCompleteBeans[0].checkTime
          this.value = parseInt(res.result.tbEventCompleteBeans[0].star_one)
          this.value1 = parseInt(res.result.tbEventCompleteBeans[0].star_two)
          this.value2 = parseInt(res.result.tbEventCompleteBeans[0].star_three)
        }

        this.tableData = this.detailList.tbEventLogBeans

        // ************************************************
        for (var i = 0; i < res.result.tbEventCompleteBeans.length; i++) {
          this.comName.push(res.result.tbEventCompleteBeans[i].completeUserName)
        }

        this.comName1 = [...new Set(this.comName)].join(',')
        // 报事信息图片
        this.detailList = res.result
        var img = res.result.imgurl
        var img1 = img.split(',')

        var baseUrl = unescape(localStorage.getItem('baseUrl'))
        var baseUrl1 = baseUrl.replace('https', 'http')
        if (img) {
          for (var i = 0; i < img1.length; i++) {
            this.imgs.push(baseUrl1 + img1[i])
            this.srcList.push(baseUrl1 + img1[i])
          }
        }
        // 完工信息图片
        var img2 = res.result.tbEventCompleteBeans[0].imgUrl
        var img3 = img2.split(',')
        var baseUrl2 = unescape(localStorage.getItem('baseUrl'))
        var baseUrl3 = baseUrl2.replace('https', 'http')
        if (img2) {
          for (var i = 0; i < img3.length; i++) {
            this.imgs1.push(baseUrl3 + img3[i])
            this.srcList1.push(baseUrl3 + img3[i])
          }
        }

        // 验收信息
        var img4 = res.result.tbEventCompleteBeans[0].check_img
        var img5 = img4.split(',')
        var baseUrl4 = unescape(localStorage.getItem('baseUrl'))
        var baseUrl5 = baseUrl4.replace('https', 'http')
        if (img4) {
          for (var i = 0; i < img5.length; i++) {
            this.imgs2.push(baseUrl5 + img5[i])
            this.srcList2.push(baseUrl5 + img5[i])
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.app-container {
  min-height: 100vh;
  background: #f5f6f7;
  .paiBan {
    background: #fff;
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 15px;
    .paiBanTitle {
      background: #a68e44;
      color: #fff;
      padding: 10px;
      position: relative;
      left: -9px;
      border-radius: 15px 0 15px 0;
    }
  }
  .jinDu {
    background: #fff;
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 15px;
    .title {
      background: #f6f7f8;
      padding: 1px 0;
      border-radius: 15px;
      padding-left: 40px;
    }
    .con {
      padding-left: 40px;
      border-bottom: 1px solid #f5f6f7;
    }
  }
  .el-header,
  .el-footer {
    text-align: center;
  }
  .el-row {
    margin: 20px;
  }
  .el-col {
    margin-bottom: 8px;
  }
  .img {
    justify-content: flex-start;
    display: flex;
    align-items: center;
  }
}
</style>