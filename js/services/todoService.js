import { Observable } from 'rx';

const NAMESPACE = 'thundercats-todos';

function fakeRemoteCall(val) {
  return Observable.just(val).delay(500);
}

export default {
  create: fakeRemoteCall,
  destroy: fakeRemoteCall,
  destroyCompleted: fakeRemoteCall,

  getTodos() {
    const state = localStorage.getItem(NAMESPACE);
    return Promise.resolve(state ? JSON.parse(state) : {});
  },

  init(store) {
    const stringyState = store.serialize();
    localStorage.setItem(NAMESPACE, stringyState ? stringyState : '');
  },

  toggleComplete: fakeRemoteCall,
  toggleCompleteAll: fakeRemoteCall,
  updateText: fakeRemoteCall
};
