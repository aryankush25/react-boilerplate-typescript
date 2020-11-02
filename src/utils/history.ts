import { createBrowserHistory } from 'history';
let history = createBrowserHistory();

export const navigateTo = (route: string) => {
  history.push(route);
};

export default history;
