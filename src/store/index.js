import Vue from 'vue'
import Vuex from 'vuex'
import Axios from "axios";

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        token: '',
        userInfo: ''
    },
    actions: {
        async VerifyToken(token) {
            console.log(token);
            let res = await Axios.post("tokenVerity",{token: token});
            console.log(res.data.verify);
            return res.data.verify;
        }
    }
})
