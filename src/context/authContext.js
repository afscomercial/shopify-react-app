import PropTypes from 'prop-types';
import React, { useState } from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = (shop) => {
    const auth = localStorage.getItem(`${shop}_auth`);
    if(!auth){
        localStorage.setItem(`${shop}_auth`, true);
    }
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated}}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.any,
};
