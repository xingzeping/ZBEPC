const msg = {
  state: {
    msgList: []
  },
  mutations: {
    SET_MSG_LIST: (state, list) => {
      state.msgList = list
    },
    CLEAR_LIST: (state) => {
      state.msgList = []
    },
    PUSH_MSG_LIST: (state, item) => {
      state.msgList.push(item)
    }
  },
  actions: {
    closeAllMsg({ commit, state }) {
      if (state.msgList.length > 0) {
        state.msgList.forEach(item => {
          item.close()
        })
      }
      commit('CLEAR_LIST')
    }
  }
}

export default msg
