import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { shopifyService } from '../services';
import { Spinner } from '../components';
import { environments } from '../config';
import Logo from '../assets/logo.png';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Callback = () => {
  const { lambda, getTokenAction } = environments;
  const authCode = useQuery().get('code');
  const shop = useQuery().get('shop');
  const [token, setToken] = useState(undefined);
  const [error, setError] = useState(false);
  let component;

  useEffect(() => {
    const errorAction = () => {
      localStorage.removeItem(shop);
      setError(true);
    };

    if (authCode && shop) {
      (async () => {
        const getTokenUrl = `${lambda}?code=${authCode}&shop=${shop}&action=${getTokenAction}`;
        try {
          const data = await shopifyService.getRequest(getTokenUrl);
          if (data.message) {
            localStorage.setItem(shop, data.message);
            setToken(data.message);
          } else {
            errorAction();
          }
        } catch (e) {
          errorAction();
        }
      })();
    }else{
      errorAction();
    }
  }, [lambda, authCode, getTokenAction, shop]);

  if (token) {
    return <Redirect push to={`/?shop=${shop}`} />;
  } else if (error) {
    component = (
      <div
        className="card text-center border border-dark"
        style={{ width: '30rem' }}
      >
        <div className="card-body">Error getting token</div>
      </div>
    );
  } else {
    component = <Spinner />;
  }
  return (
    <div className="container">
      <nav className="navbar navbar-light">
        <img src={Logo} width="120" height="30" alt="" />
      </nav>
      <div class="d-flex justify-content-center">{component}</div>
    </div>
  );
};
