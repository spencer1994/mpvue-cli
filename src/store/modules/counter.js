const state = {
  count: 0
}

const mutations = {
  increment: (state) => {
    const obj = state
    obj.count += 1
  },
  decrement: (state) => {
    const obj = state
    obj.count -= 1
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
