import uuid from 'node-uuid';
import { Actions } from 'thundercats';
import TodoService from '../services/todoService';

export default Actions({
  createTodo(text) {
    const todo = {
      id: uuid.v4(),
      text,
      complete: false
    };
    return {
      todo,
      optimistic: TodoService.create(todo)
    };
  },

  destroy(id) {
    return {
      id,
      optimistic: TodoService.destroy(id)
    };
  },

  destroyCompleted() {
    return {
      optimistic: TodoService.destroyCompleted()
    };
  },

  fetchTodos: null,

  toggleComplete(id) {
    return {
      id,
      optimistic: TodoService.toggleComplete(id)
    };
  },

  toggleCompleteAll() {
    return {
      optimistic: TodoService.toggleCompleteAll()
    };
  },

  updateMany(todosMap) {
    return todosMap;
  },

  updateText({ id, text }) {
    return {
      id,
      text,
      optimistic: TodoService.updateText(id, text)
    };
  }
})
  .refs({ displayName: 'TodoActions' })
  .init(({ instance: todoActions }) => {
    todoActions.fetchTodos.subscribe(() => {
      TodoService.getTodos()
        .then(state => {
          todoActions.updateMany(state.todosMap);
        })
        .catch(err => {
          console.log('an error occurred retrieving todos from server: ', err);
        });
    });

  });
