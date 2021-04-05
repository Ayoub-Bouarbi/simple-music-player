import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    files: [],
    audioIndex: 0
  },
  mutations: {
    setFiles(state,files){
      state.files = files;
    },
    setIndex(state,index){
      state.audioIndex = index;
    },
    setFile(state,file){
      state.files.push(file);
    }
  },
  getters: {
    getFiles(state){
      return state.files;
    },
    getIndex(state){
      return state.audioIndex;
    }
  },
  actions: {
    initFiles({commit},files){
      commit('setFiles',files);
    },
    pushFile({commit},file){
      commit('setFile',file)
    },
    setAudioIndex({commit},index){
      commit("setIndex",index);
    }

  },
  modules: {
  }
})
