import { createContext, useContext, useState } from 'react';

const OperatorContext = createContext(null);

export function OperatorProvider({ children }) {
  const [operador, setOperadorState] = useState(() => localStorage.getItem('recover-operador'));

  const setOperador = (value) => {
    setOperadorState(value);
    localStorage.setItem('recover-operador', value);
  };

  const clearOperador = () => {
    setOperadorState(null);
    localStorage.removeItem('recover-operador');
  };

  return (
    <OperatorContext.Provider value={{ operador, setOperador, clearOperador }}>
      {children}
    </OperatorContext.Provider>
  );
}

export const useOperator = () => useContext(OperatorContext);
