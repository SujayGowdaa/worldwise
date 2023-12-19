import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// import Homepage from './pages/Homepage';
// import Product from './pages/Product';
// import Pricing from './pages/Pricing';
// import AppLayout from './pages/AppLayout';
// import PageNotFound from './pages/PageNotFound';
// import Login from './pages/Login';

const Homepage = lazy(() => import('./pages/Homepage.jsx'));
const Product = lazy(() => import('./pages/Product.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const AppLayout = lazy(() => import('./pages/AppLayout.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const PageNotFound = lazy(() => import('./pages/PageNotFound.jsx'));

import CountryList from './components/CountryList';
import Form from './components/Form';
import CityList from './components/CityList';
import City from './components/City';
import CitiesProvider from './context/CitiesProvider';
import AuthContextProvider from './context/FakeAuthContext';
import ProtectedRoutes from './pages/ProtectedRoutes';
import './index.css';
import SpinnerFullPage from './components/SpinnerFullPage.jsx';

export default function App() {
  return (
    <AuthContextProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path='/product' element={<Product />} />
              <Route path='/pricing' element={<Pricing />} />
              <Route path='/login' element={<Login />} />
              <Route
                path='app'
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                <Route index element={<Navigate replace to='cities' />} />
                <Route path='cities' element={<CityList />} />
                <Route path='cities/:id' element={<City />} />
                <Route path='countries' element={<CountryList />} />
                <Route path='form' element={<Form />} />
              </Route>
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthContextProvider>
  );
}
