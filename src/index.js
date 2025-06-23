import './fix-drawer-rtl.css'; // أولاً!
import './rtl-fields.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { CacheProvider } from "@emotion/react";
import cacheRtl from "./cacheRtl";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <App />
    </CacheProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();