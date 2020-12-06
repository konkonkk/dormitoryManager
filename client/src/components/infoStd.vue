<template>
    <div>
        <!-- 卡片视图 -->
        <el-card class="box-card m-t-20">
        <!-- 搜索框 -->
        <el-row :gutter="20">
            <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getStdList">
                <el-button slot="append" icon="el-icon-search" @click="searchStd"></el-button>
            </el-input>
            </el-col>
            <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-table class="m-t-20" :data="stdList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="学号" prop="id"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="宿舍号" prop="roomId"></el-table-column>
            <el-table-column label="班级" prop="class"></el-table-column>
            <el-table-column label="联系电话" prop="tel"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip class="item" effect="dark" content="修改学生信息" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click=   "showEditStd(scope.row)"></el-button>
                    </el-tooltip>
                    <!-- 删除按钮 -->
                    <el-tooltip class="item" effect="dark" content="删除学生信息" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delStdById(scope.row.id)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="m-t-20">
        </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="学号" prop="id">
                    <el-input v-model="addForm.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="宿舍号" prop="roomId">
                    <el-input v-model="addForm.roomId"></el-input>
                </el-form-item> -->
                <el-form-item label="班级" prop="class">
                    <el-input v-model="addForm.class"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="addForm.tel"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStd">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="70%"
            @close="editDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="editStdInfo" :rules="addFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="学号" prop="id">
                    <el-input v-model="editStdInfo.id"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editStdInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="宿舍号" prop="roomId">
                    <el-input v-model="editStdInfo.roomId"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="class">
                    <el-input v-model="editStdInfo.class"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="editStdInfo.tel"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editStd">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        // 校验学生姓名
        var checkName = function(rule, value, cb){
            var reg = /^[\u4e00-\u9fa5]{0,}$/
            if(reg.test(value)) {
                return cb()
            }
            cb(new Error('请输入中文'))
        }
        var checkId = function(rule, value, cb){
            var reg = /^[0-9]{9,10}$/
            if(reg.test(value)){
                return cb()
            }
            cb(new Error('请输入正确学号'))
        }
        // var checkRoomId = function(rule, value, cb){
        //     var reg = /^[0-9]{3}$/
        //     if(reg.test(value)){
        //         return cb()
        //     }
        //     cb(new Error('请输入正确宿舍号'))
        // }
        return {
            // 请求参数对象
            queryInfo: {
                // 关键字
                query: '',
                // 当前每页显示数据量
                pagesize: 5,
                // 当前页码
                pagenum: 1
            },
            // 响应数据总数
            total: 0,
            // 学生列表
            stdList: [],
            // 添加学生表单
            addForm: {
                id: '',
                name: '',
                // roomId: '',
                class: '',
                tel: ''
            },
            // 修改学生信息
            editStdInfo: {
                id: '',
                name: '',
                roomId: '',
                class: '',
                tel: ''
            },
            // 控制修改学生面板显示与隐藏
            editDialogVisible: false,
            // 控制修改学生面板显示与隐藏
            addDialogVisible: false,
            // 添加表单的验证规则对象
            addFormRules: {
                id: [
                    { required: true, message: '请输入学号', trigger: 'blur' },
                    { validator: checkId, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { validator: checkName, trigger: 'blur' }
                ],
                // roomId: [
                //     { required: true, message: '请输入姓名', trigger: 'blur' },
                //     { validator: checkRoomId, trigger: 'blur' }
                // ],
                class: [
                    { required: true, message: '请输入班级', trigger: 'blur' },
                ],
                tel: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' }
                ]
            },
        }
    },
    created(){
        this.getStdList()
    },
    methods: {
        // 获取学生列表
         async getStdList(){
            const { data: res } = await this.$axios.get('/api/queryStd', {
                params: this.queryInfo
            })
            if(res.status != 200){
                return this.$message.error(res.msg)
            }
            this.stdList = res.data
            this.total = res.total
        },
        // 搜索学生信息
        searchStd(){
            this.queryInfo.pagesize = 5,
            this.queryInfo.pagenum = 1
            this.getStdList()
            // this.queryInfo.query = ''
        },
        // 添加学生
        addStd(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const { data: res } = await this.$axios.post('/api/addStd', this.addForm)
                if(res.status != 200){
                    this.$message.error(res.msg)
                    return
                }
                this.$message.success(res.msg)
                this.addDialogVisible = false
            })
        },
        // 修改学生
        editStd(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const { data: res } = await this.$axios.post('/api/editStd', this.editStdInfo)
                if(res.status != 200){
                    this.$message.error(res.msg)
                    return
                }
                this.$message.success(res.msg)
                this.editDialogVisible = false
            })
        },
        // 监听 添加学生面板 关闭
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        // 监听 修改学生面板 关闭
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 监听 pagesize 值改变
        handleSizeChange(newSize){
            this.queryInfo.pagenum = 1
            this.queryInfo.pagesize = newSize
            this.getStdList()
        },
        // 监听 页码 值改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getStdList()
        },
        // 删除学生
        async delStdById(id){
            // 询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => {
                return err
            })
            // 若确认删除，返回字符串 confirm, 若取消，则返回 cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已经取消删除')
            }
            // 网络请求
            const { data: res } = await this.$axios.delete('/api/delStd', {params: { id: id }})
            console.log(res)
            if (res.status !== 200) {
                this.$message.error(res.msg)
                return
            }
            this.$message.success('用户删除成功！')
            this.getStdList()
        },
        // 修改学生按钮
        showEditStd(stdInfo){
            delete stdInfo.No
            this.editStdInfo = stdInfo
            this.editDialogVisible = true
        }
    }
}
</script>

<style lang="less" scoped>
    .m-t-20 { margin-top: 20px; }
</style>