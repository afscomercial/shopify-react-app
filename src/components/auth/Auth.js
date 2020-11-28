import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context';

export const Auth = ({ shop }) => {
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    if (shop) {
      authContext.login(shop);
    }
  };

  return (
    <>
      <div className="card-header">Webhooks Registration for {shop}</div>
      <div className="card-body">
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler} className="btn btn-primary">
          Log In
        </button>
      </div>
    </>
  );
};

Auth.propTypes = {
  shop: PropTypes.string,
};
