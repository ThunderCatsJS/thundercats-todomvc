import { Actions } from 'thundercats';

export default Actions({
  changeRoute(newRoute) {
    return {
      set: {
        currentRoute: newRoute
      }
    };
  }
})
  .refs({ displayName: 'RouterActions' });
