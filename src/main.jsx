import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';


const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>

);
