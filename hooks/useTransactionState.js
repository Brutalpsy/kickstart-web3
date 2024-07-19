import { useState } from 'react';
import { INITIAL_TRANSACTION_STATE } from '../helpers/constants';

const useTransactionState = (initialState = INITIAL_TRANSACTION_STATE) => {
  const [transactionState, setTransactionState] = useState(initialState);

  const setNewTransactionState = (newState) => {
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      ...newState,
    });
  };

  return [transactionState, setNewTransactionState];
};

export default useTransactionState;
