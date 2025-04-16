const React = require('react');
const ReactDOM = require('react-dom/client');
require('./index.css');
require('./styles/bootstrap.css');
require('./styles/own.css');
const App = require('./App');
const store = require('../src/store/store');
const reportWebVitals = require('./reportWebVitals');
const { Provider } = require('react-redux');
const { GoogleOAuthProvider } = require('@react-oauth/google');


// import { HelmetProvider } from 'react-helmet-async';


const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.GOOGLE_CLIENT_ID;

root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={clientId}>
  <Provider store={store}>
    <App />
  </Provider>
</GoogleOAuthProvider>,

  // </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
