import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/bootstrap.css';
import './styles/own.css';

import App from './App.js';
import store from '../src/store/store.js';
import reportWebVitals from './reportWebVitals.js';

import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';


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
