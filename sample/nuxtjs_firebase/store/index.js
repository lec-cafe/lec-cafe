export const state = () => {
  return {
    user: null,
    posts: [
      {
        user: "mikakane",
        comment: "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.",
        date: "01/01 11:00"
      }
    ]
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  ADD_POST(state, post) {
    state.posts.push(post)
  }
}

export const actions = {
  loginWithUserName({commit}, name) {
    commit("SET_USER",{ name })
  },
  addPost({state,commit}, {comment}) {
    const date = new Date()
    const post = {
      comment,
      user: state.user.name,
      date: `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
    commit("ADD_POST", post)
  }
}
