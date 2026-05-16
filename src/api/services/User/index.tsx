import React, { createContext, useContext, useState } from "react";

import Store from "./store";

const UserStoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const [store] = useState(() => new Store());

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = (): Store => {
  const store = useContext(UserStoreContext);
  if (store == null) {
    throw new Error("useUserStore must be used within StoreProvider");
  }
  return store;
};

export default { StoreProvider };
