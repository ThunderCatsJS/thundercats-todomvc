import { Store } from 'thundercats';
import assign from 'react/lib/Object.assign';

function updateTodos(todos, update, condition) {
  return Object.keys(todos).reduce(function(result, id) {
    var todo = todos[id];
    if (!condition || condition(todo)) {
      result[id] = assign({}, todo, update);
    } else {
      result[id] = todo;
    }
    return result;
  }, {});
}

export default Store()
  .refs({
    displayName: 'TodoStore',
    value: {
      todosMap: {},
      currentRoute: '/'
    }
  })
  .init(({ instance: todoStore, args: [cat] }) => {
    const todoActions = cat.getActions('todoActions');
    const routerActions = cat.getActions('routerActions');
    const { changeRoute } = routerActions;

    const {
      createTodo,
      destroy,
      destroyCompleted,
      toggleComplete,
      toggleCompleteAll,
      updateMany,
      updateText
    } = todoActions;

    todoStore.register(changeRoute);

    todoStore.register(updateMany.map(todosMap => {
      return {
        transform(state) {
          state.todosMap = assign({}, state.todosMap, todosMap);
          return state;
        }
      };
    }));

    todoStore.register(createTodo.map(({ todo, optimistic }) => {
      return {
        transform: function(state) {
          const todos = assign({}, state.todosMap);
          todos[todo.id] = todo;
          state.todosMap = todos;
          return state;
        },
        optimistic
      };
    }));

    todoStore.register(toggleCompleteAll.map(({ optimistic }) => {
      return {
        transform: function(state) {
          const todos = state.todosMap;
          const allCompleted = Object.keys(todos)
            .every(id => todos[id].complete);

          return updateTodos(
            todos,
            { complete: !allCompleted },
            todo => todo.complete === allCompleted
          );
        },
        optimistic
      };
    }));

    todoStore.register(toggleComplete.map(({ id, optimistic }) => {
      return {
        transform: state => {
          const todos = state.todosMap;
          state.todosMap = updateTodos(
            todos,
            { complete: !todos[id].complete },
            todo => todo.id === id
          );
          return state;
        },
        optimistic
      };
    }));

    todoStore.register(updateText.map(({ id, text, optimistic }) => {
      return {
        transform: state => {
          const todos = state.todosMap;
          state.todosMap = updateTodos(
            todos,
            { text },
            todo => todo.id === id
          );
          return state;
        },
        optimistic
      };
    }));

    todoStore.register(destroy.map(function({ id, optimistic }) {
      return {
        transform: state => {
          const todos = assign({}, state.todosMap);
          delete todos[id];
          state.todosMap = todos;
          return state;
        },
        optimistic
      };
    }));

    todoStore.register(destroyCompleted.map(function({ optimistic }) {
      return {
        transform: state => {
          const todos = state.todosMap;
          state.todosMap = Object.keys(todos).reduce(function(result, id) {
            let todo = todos[id];
            if (!todo.complete) {
              result[id] = todo;
            }
            return result;
          }, {});
          return state;
        },
        optimistic
      };
    }));
  });
