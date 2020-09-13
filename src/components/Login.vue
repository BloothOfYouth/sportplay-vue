<template>
    <div class="login_container">
        <!-- 登录区域 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/vue.png">
            </div>
            <!-- 表单区域 -->
            <el-form @keyup.enter.native="login" :rules="loginRules" ref="loginFormRef" :model="loginForm" class="login_form" label-width="0">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input placeholder="账号" v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="loginForm.password" prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" round @click="login">提交</el-button>
                    <el-button type="info" round @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                // 表单数据对象
                loginForm: {
                    username: "",
                    password: "",
                },
                // 表单校验对象
                loginRules: {
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
                },
            }
        },
        methods: {
            // 重置表单内容
            resetLoginForm() {
                // this.loginForm.username = this.loginForm.password = ""
                this.$refs.loginFormRef.resetFields();
            },
            // 登录方法
            login() {
                // 1.验证校验规则
                this.$refs.loginFormRef.validate(valid => {
                    if (valid) { // 校验成功
                        this.$http.post("login",this.loginForm).then(res => { // 访问后台
                            if (res.data.result == "success") {
                                this.$message({
                                    showClose: true,
                                    message: "登录成功!",
                                    type: "success"
                                }); // 信息提示
                                window.localStorage.JWT_TOKEN = res.data.message;
                                this.$router.push("/home"); // 页面路由跳转
                            }else {
                                this.$message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: "error"
                                });// 信息提示
                            }
                        })
                    }else {
                        // 校验失败
                        return;
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
/* 根结点样式 */
.login_container{
    background-color: #f5d4d9;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 7px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>
