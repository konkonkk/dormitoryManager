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
            <!-- <el-button type="primary" @click="addDialogVisible = true">添加宿舍信息</el-button> -->
        </el-row>
        <!-- 宿舍列表 -->
        <el-table class="m-t-20" :data="roomList" border stripe>
            <el-table-column type="index"></el-table-column>
            <!-- <el-table-column label="楼层" prop="floor"></el-table-column> -->
            <el-table-column label="宿舍号" prop="roomId"></el-table-column>
            <el-table-column label="床位一" prop="n1">
                <template slot-scope="scope">
                    {{ scope.row.n1 | getName }}
                </template>
            </el-table-column>
            <el-table-column label="床位二" prop="n2">
                <template slot-scope="scope">
                    {{ scope.row.n2 | getName }}
                </template>
            </el-table-column>
            <el-table-column label="床位三" prop="n3">
                <template slot-scope="scope">
                    {{ scope.row.n3 | getName }}
                </template>
            </el-table-column>
            <el-table-column label="床位四" prop="n4">
                <template slot-scope="scope">
                    {{ scope.row.n4 | getName }}
                </template>/el-table-column>
            </el-table-column>
            <el-table-column label="床位五" prop="n5">
                <template slot-scope="scope">
                    {{ scope.row.n5 | getName }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    修改按钮
                    <el-tooltip class="item" effect="dark" content="修改宿舍信息" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoom(scope.row)"></el-button>
                    </el-tooltip>
                    删除按钮
                    <el-tooltip class="item" effect="dark" content="删除宿舍信息" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delStdById(scope.row.id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column> -->
        </el-table>
    </el-card>
    <!-- 修改宿舍的对话框 -->
    <!-- <el-dialog
        title="添加宿舍"
        :visible.sync="addDialogVisible"
        width="70%"
        @close="addDialogClosed">
        内容主体区
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
            <el-form-item label="楼层" prop="id">
                <el-input v-model="addForm.floor"></el-input>
            </el-form-item>
            <el-form-item label="宿舍号" prop="id">
                <el-input v-model="addForm.roomId"></el-input>
            </el-form-item>
            <el-form-item label="床位一" prop="name">
                <el-input v-model="addForm.n1.name"></el-input>
                <el-input v-model="addForm.n1.id"></el-input>
            </el-form-item>
        </el-form>
        底部区
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoom">保 存</el-button>
        </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  name: 'infoRoom',
  data () {
    return {
        // 宿舍表
        roomList: [],
        // 添加宿舍表单
        addForm: {
            floor: '',
            roomId: '',
            n1: {
                name: '',
                id: ''
            },
            n2: {
                name: '',
                id: ''
            },
            n3: {
                name: '',
                id: ''
            },
            n4: {
                name: '',
                id: ''
            },
            n5: {
                name: '',
                id: ''
            }
        },
        // 控制添加宿舍表单显示与隐藏
        addDialogVisible: false,
        addFormRules: {
            // floor: [
            //     { required: true, message: '请输入学号', trigger: 'blur' },
            //     { validator: checkId, trigger: 'blur' }
            // ],
            // roomId: [
            //     { required: true, message: '请输入姓名', trigger: 'blur' },
            //     { validator: checkRoomId, trigger: 'blur' }
            // ],
            // n1: [
            //     { required: true, message: '请输入姓名', trigger: 'blur' },
            //     { validator: checkRoomId, trigger: 'blur' }
            // ],
            // tel: [
            //     { required: true, message: '请输入联系电话', trigger: 'blur' }
            // ]
        },
    }
  },
  created(){
      this.searchRoom(1)
  },
  methods:{
    // 根据楼层查询宿舍
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
        // this.$message.success(res.msg)
        this.roomList = res.data
    },
    // 添加宿舍
    async addRoom(){},
    // 监听 添加表单 关闭事件
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    }
  },
  filters:{
      getName: function(msg){
          var reg = /[0-9]{0,}$/
          if(msg){
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