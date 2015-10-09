import React from 'react';
import { Cat } from 'thundercats';
import { Render } from 'thundercats-react';
import { Router } from 'director';

import TodoStore from './stores/TodoStore';
import TodoActions from './actions/TodoActions';
import routes from './routes';
import RouterActions from './actions/RouterActions';
import TodoApp from './components/App.jsx';
import TodoService from './services/todoService';

window.React = React;

const TodoCat = Cat()
  .refs({ displayName: 'TodoCat' })
  .init(({ instance: todoCat }) => {
    todoCat.register(TodoActions);
    todoCat.register(RouterActions);
    todoCat.register(TodoStore, null, todoCat);
  });

const todoCat = TodoCat();

const { changeRoute } = todoCat.getActions('routerActions');

const router = Router({
  '/': function() {
    changeRoute(routes.ALL);
  },
  '/active': function() {
    changeRoute(routes.ACTIVE);
  },
  '/completed': function() {
    changeRoute(routes.COMPLETED);
  }
});

router.init('/');

Render(todoCat, <TodoApp />, document.getElementById('todoapp')).subscribe(
  () => {
    console.log('app rendered!');
  },
  err => {
    console.log('rendering has encountered an err: ', err);
  },
  () => {
    console.log('foo');
  }
);

TodoService.init(todoCat.getStore('todoStore'));
