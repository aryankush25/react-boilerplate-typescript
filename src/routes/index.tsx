import React, { ReactNode } from 'react';
import _ from 'lodash';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import Landing from './Landing';
import Login from './Login';
import Home from './Home';
import PageNotFound from './PageNotFound';
import { isTokensPresentLocalStorage } from '../utils/tokensHelper';
import { ROOT_ROUTE, LOGIN_ROUTE, HOME_ROUTE } from '../utils/routesConstants';

interface RouteConfigProps {
  path: string | string[];
  component: ReactNode;
  name: string;
  exact: boolean;
  privateRoute: boolean;
}

const routesConfig = {
  landing: {
    path: ROOT_ROUTE,
    component: Landing,
    exact: true,
    privateRoute: false
  },
  login: {
    path: LOGIN_ROUTE,
    component: Login,
    exact: true,
    privateRoute: false
  },
  home: {
    path: HOME_ROUTE,
    component: Home,
    exact: true,
    privateRoute: true
  }
};

interface ProtectedRoutesProps {
  component: any;
  privateRoute: boolean;
}

const ProtectedRoutes = (props: RouteComponentProps & ProtectedRoutesProps) => {
  const { component: Component, privateRoute, ...rest } = props;
  const isUserPresent = isTokensPresentLocalStorage();

  const isValidRoute =
    (privateRoute && isUserPresent) || !(privateRoute || isUserPresent);

  if (isValidRoute) {
    return <Component {...rest} />;
  }

  return <Redirect to={privateRoute ? LOGIN_ROUTE : HOME_ROUTE} />;
};

const AppRoutes = () => {
  const routes = _.keys(routesConfig);

  return (
    <Switch>
      {routes.map((route: string) => {
        const config: RouteConfigProps = routesConfig[route];

        return (
          <Route
            exact={config.exact}
            key={`${config.name}`}
            path={config.path}
            render={(props: RouteComponentProps) => {
              return (
                <ProtectedRoutes
                  component={config.component}
                  privateRoute={config.privateRoute}
                  {...props}
                />
              );
            }}
          />
        );
      })}

      <Route path="*" render={() => <PageNotFound />} />
    </Switch>
  );
};

export default withRouter(AppRoutes);
