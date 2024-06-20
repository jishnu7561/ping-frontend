import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./common/styles/tailwind.css";
import { Toaster } from "sonner";
import { Provider } from 'react-redux';
import store from './Redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="184243567332-nlp89m0i8r379ho082v8gk9kvkaq3prl.apps.googleusercontent.com">
      <Toaster richColors position="top-left" /> 
        <App />
    </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

