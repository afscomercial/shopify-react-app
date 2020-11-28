import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Route } from 'react-router-dom';
import { environments } from '../config';
import { Home } from '.';
import { Spinner, Auth } from '../components';
import Logo from '../assets/logo.png';
import { AuthContext } from '../context';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Main = () => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(undefined);
  const shop = useQuery().get('shop');
  const { apikey, scopes, redirectUrl, nonce } = environments;
  let component;

  console.log(authContext.isAuth);

  useEffect(() => {
    (async () => {
      const savedToken = await localStorage.getItem(shop);
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    })();
  }, [shop]);

  useEffect(() => {
    (async () => {
      const auth = await localStorage.getItem(`${shop}_auth`);
      if (auth) {
        if (!authContext.isAut) {
          authContext.login(shop);
        }
      }
    })();
  }, [shop, authContext]);

  if (!authContext.isAuth && shop) {
    component = <Auth shop={shop} />;
  } else if (token) {
    component = <Home shop={shop} />;
  } else if (!loading && shop) {
    const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apikey}&scope=${scopes}&redirect_uri=${redirectUrl}&state=${nonce}`;
    return (
      <Route
        path="/"
        render={() => {
          window.location.href = permissionUrl;
        }}
      />
    );
  } else if (loading) {
    component = <Spinner />;
  } else {
    component = <div className="card-body">no shop</div>;
  }

  return (
    <div className="container">
      <nav className="navbar navbar-light">
        <img src={Logo} width="120" height="30" alt="" />
      </nav>
      <div className="d-flex justify-content-center">
        <div
          className="card text-center border border-dark"
          style={{ width: '30rem' }}
        >
          {component}
        </div>
      </div>
    </div>
  );
};
