import React, { createContext, useContext } from "react";

import Store from "./store";

/* 
CONTEXT / PROVIDER INIT
*/

const UserStoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC = (props) => {
  const { children } = props;

  return (
    <UserStoreContext.Provider value={new Store()}>
      {children}
    </UserStoreContext.Provider>
  );
};

/* 
HOOK DEFINITION
*/

export const useUserStore = (): Store => {
  const store = useContext(UserStoreContext);
  if (store == null) {
    throw new Error("useUserStore must be used within StoreProvider");
  }
  return store;
};

export default { StoreProvider };
