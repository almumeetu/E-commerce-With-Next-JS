
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';
import { SiteContentProvider } from './context/SiteContentContext';
import { CartProvider } from './src/context/CartContext';


import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteContentProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SiteContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);    