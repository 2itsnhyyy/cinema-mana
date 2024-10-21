import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainLayout from './components/Layout';
import { AppRoutes } from './config';
import AuthProvider from './context/AuthContext';
import RequireAuth from './pages/Auth';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFound';
function App() {
  return (
    <ConfigProvider locale={enUS}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            {/* <Route path='/register' element={<RegisterPage />} /> */}
            <Route
              element={
                <RequireAuth>
                  <MainLayout />
                </RequireAuth>
              }
            >
              {AppRoutes?.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.page}
                />
              ))}
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
