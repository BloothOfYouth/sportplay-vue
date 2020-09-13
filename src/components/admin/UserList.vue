<template>
    <div>
        <span style="font-weight: bold">用户列表</span>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 15px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索用户 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" @keyup.enter.native="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>

                <el-col :span="4">
                    <!-- 添加用户 -->
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表部分 border边框 stripe隔行变色 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- scope.row.state 每一行封存的数据 -->
                        <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 权限 -->
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件 -->
            <div style="margin-top: 15px">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pageNum"
                        :page-sizes="[1, 3, 5, 10]"
                        :page-size="queryInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>

        <!-- 添加对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm" @open="resetAddForm">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" @keyup.enter.native="addUser">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddForm">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" @keyup.enter.native="editUser">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetEditForm">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Qs from "qs";

    var checkEmail = (rule, value, callback) => {
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regEmail.test(value)) {
            return callback();
        }
        callback(new Error("请正确的邮箱格式"));
    };

    export default {
        name: "UserList",
        data() {
            return {
                userList: [],
                total: 1,
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    pageSize: 5
                },
                addDialogVisible: false, // 添加对话框状态
                editDialogVisible: false, // 修改对话框状态
                addForm: {
                    username: "",
                    password: "",
                    email: "",
                },
                // 修改用户信息
                editForm: {
                    username: "",
                    password: "",
                    email: "",
                },
                // 添加表单校验对象
                addFormRules: {
                    // 校验账号
                    username: [
                        { required: true, message: '账号为必填项', trigger: 'blur' }, // 必填项校验
                        { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' } // 长度校验
                    ],
                    // 校验密码
                    password: [
                        { required: true, message: '密码为必填项', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱为必填项', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                },
                // 修改表单校验对象
                editFormRules: {
                    // 校验账号
                    username: [
                        { required: true, message: '账号为必填项', trigger: 'blur' }, // 必填项校验
                        { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' } // 长度校验
                    ],
                    // 校验密码
                    password: [
                        { required: true, message: '密码为必填项', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱为必填项', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            // 获取用户信息
            getUserList() {
                this.$http.post("getUserList",this.queryInfo).then(res => {
                    this.userList = res.data.list;
                    this.total = res.data.total;
                    this.queryInfo.pageNum = res.data.pageNum;
                })
            },
            // 改变最大显示数触发动作
            handleSizeChange(newPageSize) {
                this.queryInfo.pageSize = newPageSize;
                this.getUserList();
            },
            // 当前页触发动作
            handleCurrentChange(newPageNum) {
                this.queryInfo.pageNum = newPageNum;
                this.getUserList();
            },
            // 状态变化
            userStateChange(userInfo) {
                let stringify = Qs.stringify({id: userInfo.id, state: userInfo.state});
                this.$http.put("updateUserState",stringify).then(res => {
                    if (res.data.result == "fail") {
                        return this.$message({
                            showClose: true,
                            message: res.data.message,
                            type: "error"
                        })
                    }
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: "success"
                    });
                    this.getUserList();
                })
            },
            // 重置表单内容
            resetAddForm() {
                this.$refs.addFormRef.resetFields();
            },
            resetEditForm() {
                this.$refs.editFormRef.resetFields();
            },
            // 添加用户
            addUser() {
                this.$refs.addFormRef.validate(valid => {
                    if (valid) {
                        this.$http.post("addUser",this.addForm).then(res => {
                            if (res.data.result == "success") {
                                this.$message({
                                    showClose: true,
                                    message: "添加成功!",
                                    type: "success"
                                }); // 信息提示
                                this.addDialogVisible = false;
                                this.getUserList();
                                this.$refs.addFormRef.resetFields();
                            }else {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: "error"
                                });// 信息提示
                            }
                        })
                    }else{
                        return;
                    }
                })
            },
            // 打开编辑对话框，回显数据
            openEditDialog(id) {
                this.editDialogVisible = true;
                this.$http.get("getUser/"+id).then(res => {
                    if (res.data.result == "success") {
                        this.editForm = res.data.message;
                    }
                })
            },
            // 编辑用户
            editUser() {
                this.$refs.editFormRef.validate(valid => {
                    if (valid) {
                        this.$http.put("updateUser",this.editForm).then(res => {
                            if (res.data.result == "success") {
                                this.$message({
                                    showClose: true,
                                    message: "修改成功!",
                                    type: "success"
                                }); // 信息提示
                                this.editDialogVisible = false;
                                this.getUserList();
                                this.$refs.editFormRef.resetFields();
                            }else {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: "error"
                                });// 信息提示
                            }
                        })
                    }else {
                        return;
                    }
                })
            },
            // 删除用户
            deleteUser(id) {
                this.$confirm('确认删除？',{
                    type: "warning"
                }).then(ok => {
                    this.$http.delete("deleteUser/"+id).then(res => {
                        if (res.data.result == "success") {
                            this.$message({
                                showClose: true,
                                message: "删除成功!",
                                type: "success"
                            }); // 信息提示
                            this.getUserList();
                        }else {
                            this.$message({
                                showClose: true,
                                message: res.data.message,
                                type: "error"
                            });// 信息提示
                        }
                    })
                }).catch(no => {

                })
            }
        }
    }
</script>

<style scoped lang="less">
    .el-breadcrumb{
        margin-bottom: 15px;
        font-size: 17px;
    }
</style>
