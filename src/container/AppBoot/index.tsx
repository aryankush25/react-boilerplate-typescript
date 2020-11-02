import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import history from '../../utils/history';
import ReduxStore, { persistor } from '../../store';
import AppRoutes from '../../routes';

import './styles.scss';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={ReduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app-container">
          <ConnectedRouter history={history}>
            <AppRoutes />
          </ConnectedRouter>
        </div>

        <ToastContainer
          autoClose={3000}
          position="bottom-left"
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          draggable
          pauseOnHover={false}
        />
      </PersistGate>
    </Provider>
  );
}

export default App;
