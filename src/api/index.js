import axios from 'axios'

export function getTodos() {
  return axios
    .get('/Todo')
    .then(res => res)
    .catch(err => console.log(err))
}

export function getTodo(todoId) {
  return axios
    .get(`/Todo/${todoId}`)
    .then(res => res)
    .catch(err => console.log(err))
}

export function createTodo(todo) {
  return axios
    .post('/Todo', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res)
    .catch(err => console.log(err))
}

export function deleteTodo(todoId) {
  return axios
    .delete(`/Todo/${todoId}`)
    .then(res => res)
    .catch(err => console.log(err))
}

export function updateTodo() {}
