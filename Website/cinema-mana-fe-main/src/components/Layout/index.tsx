import { useAuth } from '@/context/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import MenuItems from '@config/MenuItems';
import { Button } from 'antd';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FcFilmReel } from "react-icons/fc";


const MainLayout = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const { employee, logout } = useAuth();
  return (
    <ProLayout
      route={MenuItems}
      navTheme='light'
      location={{
        pathname,
      }}
      title='Cinema management'
      logo={<FcFilmReel />}
      fixedHeader
      fixSiderbar
      contentWidth='Fluid'
      layout='mix'
      actionsRender={() =>
        !employee ? (
          <Link to='/login' onClick={() => setPathname('/login')}>
            <button>
              <span role='img'>
                <UserOutlined size={20} style={{ paddingRight: 10 }} />
              </span>
              Login
            </button>
          </Link>
        ) : (
          <Button onClick={logout}>Logout</Button>
        )
      }
      avatarProps={{ title: employee?.name }}
      headerTitleRender={(logo, title) => (
        <Link to='/' onClick={() => setPathname('/')}>
          {logo}
          {title}
        </Link>
      )}
      menuItemRender={(item, dom) => (
        <NavLink
          to={`${item.path}`}
          onClick={() => {
            setPathname(item.path || '/');
          }}
        >
          {dom}
        </NavLink>
      )}
    >
      <Outlet />
    </ProLayout>
  );
};

export default MainLayout;
