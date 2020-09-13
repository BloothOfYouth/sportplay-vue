<template>
    <!-- 引入container布局  -->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.jpg" alt="logo">
                <span>个人运动平台</span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                         :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObject[item.id]"></i>
                            &nbsp;
                            <span>{{ item.title }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="childitem.path" v-for="childitem in item.submenus" :key="childitem.id" @click="saveActivePath(childitem.path)">
                            <template slot="title">
                                <i :class="iconsObject[childitem.id]"></i>
                                &nbsp;
                                <span>{{ childitem.title }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主题内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList: [],
                isCollapse: false, // 伸缩
                iconsObject: {
                    '100':'iconfont icon-guanliyuan',
                    '200':'iconfont icon-yundong',
                    '101':'iconfont icon-denglu',
                    '102':'iconfont icon-mima',
                    '103':'iconfont icon-yundong',
                    '104':'iconfont icon-shangpin',
                    '201':'iconfont icon-icon_huabanfuben',
                    '202':'iconfont icon-qialuli',
                    '203':'iconfont icon-shiwu',
                    '204':'iconfont icon-denglu',
                },
                activePath: '/welcome', // 默认路径
            }
        },
        created() {
            this.getMenuList();
            if (localStorage.getItem("activePath")) {
                this.activePath = localStorage.getItem("activePath"); // 取出localStorage里的path 动态修改activePath
            }
            if (this.$route.path === "/welcome") {
                this.activePath = "/welcome"
            }
        },
        methods: {
            // 安全退出
            logout() {
                window.localStorage.clear();
                this.$router.push("/login");
            },
            // 获取导航菜单
            getMenuList() {
                this.$http.get("getAllMenus").then(res => {
                    this.menuList = res.data.message;
                    if (res.data.code != 200)
                        return this.$message({
                            showClose: true,
                            message: "获取列表失败",
                            type: "error"
                        });
                })
            },
            // 控制伸缩
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },
            // 保存路径
            saveActivePath(activePath) {
                localStorage.activePath = activePath;
                this.activePath = activePath;
            }
        }
    }
</script>

<style scoped lang="less">
    // 布局器样式
    .home-container {
        height: 100%;
    }

    // 头部样式
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between; // 左右贴边
        padding-left: 0%; // 左边界
        align-items: center;
        color: #fff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;
        }

        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }

    // 侧边栏样式
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }

    // 主体内容样式
    .el-main {
        background-color: #eaedf1;
    }

    img {
        width: 55px;
        height: 55px;
    }

    // 按钮样式
    .toggle-button {
        background-color: #405064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
