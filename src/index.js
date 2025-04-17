const React = require('react');
const ReactDOM = require('react-dom/client');
require('./index.css');
require('./styles/bootstrap.css');
require('./styles/own.css');
const App = require('./App.js');
const store = require('../src/store/store.js');
const reportWebVitals = require('./reportWebVitals.js');
const { Provider } = require('react-redux');
const { GoogleOAuthProvider } = require('@react-oauth/google');

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.GOOGLE_CLIENT_ID;

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);

reportWebVitals();
