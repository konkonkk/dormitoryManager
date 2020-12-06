<template>
  <div>
    <el-card>
      <el-row>
        <el-button @click="searchRoom(1)">一楼</el-button>
        <el-button @click="searchRoom(2)">二楼</el-button>
        <el-button @click="searchRoom(3)">三楼</el-button>
        <el-button @click="searchRoom(4)">四楼</el-button>
        <el-button @click="searchRoom(5)">五楼</el-button>
        <el-button @click="searchRoom(6)">六楼</el-button>
      </el-row>
      <el-table class="m-t-20" :data="roomList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="宿舍号" prop="roomId"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="startCK(scope.row)" v-if="!clear.includes(scope.row.roomId)">开始考勤</el-button>
            <el-button type="error" @click="editCK(scope.row.roomId)" v-if="clear.includes(scope.row.roomId)">修改考勤</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="m-t-20" @click="submitCk">提交考勤</el-button>
    </el-card>
    <!-- 考勤对话框 -->
    <el-dialog
      title="考勤"
      :visible.sync="ckDialogVisible"
      width="70%"
      @close="ckDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="ckInfo" ref="ckFormRef" label-width="80px">
        <el-form-item v-for="(item, index) in ckInfo" :key="item.name">
          <template v-if="item.name">
            {{index}}: {{ item.name }}
            <el-select v-model="ckInfo[index].status">
              <el-option
                v-for="item in selectItems"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
          <el-button @click="ckDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ckRoom">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'fnNightCK',
  data () {
    return {
      roomList: [],
      ckInfo:{},
      ckDialogVisible: false,
      selectItems: [
        { value: 'right', label: '已到'},
        { value: 'no', label: '未到' },
        { value: 'reason', label: '请假' },
        { value: 'other', label: '其他' }
      ],
      table:[],
      clear:[],
      total:0
    }
  },
  created(){
    this.searchRoom(1)
  },
  methods:{
    async searchRoom(floor){
      const { data: res } = await this.$axios.get('/api/queryRoomByFloor', {
          params: {
              floor: floor
          }
      })
      if (res.status != 200){
          this.$message.error(res.msg)
          return
      }
      this.roomList = res.data
      this.total = res.total
    },
    ckDialogClosed(){
      this.$refs.ckFormRef.resetFields()
      this.ckInfo = {}
    },
    startCK(room){
      this.ckDialogVisible = true
      this.$set(this.ckInfo, 'roomId', room.roomId)
      for(var item in room){
        if(room[item] && item != 'floor' && item != 'roomId'){
          this.$set(this.ckInfo, item, {})
          this.ckInfo[item].name = room[item].replace(/[0-9]{0,}$/, '')
        }
      }
    },
    ckRoom(){
      for(var item in this.table){
        if(this.table[item].roomId == this.ckInfo.roomId){
          this.table[item] = this.ckInfo
          this.ckInfo = {}
          this.ckDialogVisible = false
          return
        }
      }
      this.clear.push(this.ckInfo.roomId)
      this.table.push(this.ckInfo)
      this.ckInfo = {}
      this.ckDialogVisible = false
    },
    editCK(roomId){
      for(var item in this.table){
        if(this.table[item].roomId == roomId){
          this.ckInfo = this.table[item]
          this.ckDialogVisible = true
          return
        }
      }
    },
    async submitCk(){
      // if(this.total != this.clear.length){
      //   this.$message.error('请完整填写考勤信息！')
      //   console.log(this.total, this.clear.length)
      //   return
      // }
      // console.log(this.table)
      const { data: res } = await this.$axios.get('/api/setCKInfo', { params:this.table })
      console.log(res)
      // if(res.status != 200){
      //   this.$message.error(res.msg)
      //   return
      // }
      // this.$message.success(res.msg)
    }
  },
  filters:{
      getName: function(msg){
          var reg = /[0-9]{0,}$/
          if(msg && msg != ''){
              msg = msg.replace(reg, '')
          }
          return msg
      }
  }
}
</script>

<style scoped>
.m-t-20 { margin-top: 20px; }
</style>