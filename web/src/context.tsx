/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from "@ecomplus/client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useState
} from "react";
import { post } from "./utils/api";

interface AppState {
  ecomToken: string;
  ecomAuthID: string;
  ecomStoreID: number;
  martanToken: string;
  martanStoreID: number;
  ordersSelected: any[];
  synchronizedOrders: any[];
  syncWithError: any[];
  syncCount: number;
  orders: any[]; // Tipo para orders depende da estrutura real dos dados
  dateInit: Date | null;
  dateEnd: Date | null;
  activeTab: string;
  ecomLoader: boolean;
  martanLoader: boolean;
  isSync: boolean;
}

interface AppContextProps {
  appState: AppState;
  updateAppState: (newState: Partial<AppState>) => void;
  fetch: () => void;
  syncSelected: () => void;
}

const initialState: AppState = {
  ecomToken: "",
  ecomAuthID: "",
  ecomStoreID: 0,
  martanToken: "",
  martanStoreID: 0,
  syncCount: 0,
  isSync: false,
  orders: [],
  ordersSelected: [],
  synchronizedOrders: [],
  syncWithError: [],
  dateInit: null,
  dateEnd: null,
  activeTab: "busca",
  ecomLoader: false,
  martanLoader: false,
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>(initialState);

  const updateAppState = (newState: Partial<AppState>): void => {
    setAppState((prevAppState) => ({
      ...prevAppState,
      ...newState,
    }));
  };

  function fetch() {
    updateAppState({ ecomLoader: true });

    store({
      url: "/orders.json",
      authenticationId: appState.ecomAuthID,
      accessToken: appState.ecomToken,
      storeId: appState.ecomStoreID,
      axiosConfig: {
        params: {
          // "buyers.main_email%": "talissonf@gmail.com",
          limit: 1000,
          sort: "-created_at",
          "fulfillment_status.current": "delivered",
          "created_at>": appState.dateInit,
          "created_at<": appState.dateEnd,
          fields:
            "source_name,domain,number,status,financial_status.current,fulfillment_status.current,amount,payment_method_label,shipping_method_label,buyers._id,buyers.main_email,buyers.display_name,buyers.phones,buyers.doc_number,transactions.payment_link,transactions.intermediator.transaction_code,items.product_id,items.sku,items.picture,items.name,items.quantity,extra_discount.discount_coupon,extra_discount.app.label,created_at,updated_at",
        },
      },
    })
      .then(({ data }: any) => updateAppState({ orders: data?.result || [] }))
      .then(() => {
        if (localStorage.getItem("synchronizedOrders")) {
          updateAppState({
            synchronizedOrders: JSON.parse(
              localStorage.getItem("synchronizedOrders") as any
            ),
          });
        }

        if (localStorage.getItem("syncWithError")) {
          updateAppState({
            syncWithError: JSON.parse(
              localStorage.getItem("syncWithError") as any
            ),
          });
        }
      })
      .catch((error: any) => console.error(error))
      .finally(() => updateAppState({ ecomLoader: false }));
  }

  function syncSelected() {
    const { synchronizedOrders, ordersSelected, orders, syncWithError } =
      appState;

    const init = () => {
      updateAppState({
        isSync: true,
      });

      return new Promise((resolve) => {
        let i = 0;
        const next = () => {
          i++;
          setTimeout(() => job(), 1500);
        };
        const job = () => {
          const orderId = ordersSelected[i];
          if (orderId) {
            const order = orders.find((o: any) => o._id === orderId);
            if (order) {
              post(
                order,
                "https://martan.app",
                appState.martanStoreID,
                appState.martanToken
              )
                .then(() => {
                  const newValue = synchronizedOrders;
                  newValue.push(orderId);
                  updateAppState({
                    syncCount: i,
                    synchronizedOrders: newValue,
                  });

                  next();
                  return newValue;
                })

                .then((value) => {
                  localStorage.setItem(
                    "synchronizedOrders",
                    JSON.stringify(value)
                  );
                })

                .catch((e) => {
                  i++;
                  const up: any = {
                    syncCount: i,
                  };

                  if (e?.status === 422) {
                    const newValue = synchronizedOrders;
                    newValue.push(orderId);
                    up.synchronizedOrders = newValue;
                    localStorage.setItem(
                      "synchronizedOrders",
                      JSON.stringify(newValue)
                    );
                  } else {
                    const newValue = syncWithError;
                    newValue.push(orderId);
                    up.syncWithError = newValue;
                    localStorage.setItem(
                      "syncWithError",
                      JSON.stringify(newValue)
                    );
                  }

                  updateAppState(up);
                  // todo; quando houver pedido duplicado inserir no array de sincronizados
                  job();
                });
            } else {
              next();
            }
          } else {
            return resolve(true);
          }
        };

        job();
      });
    };

    init().finally(() =>
      updateAppState({
        isSync: false,
      })
    );
  }

  const contextValue: AppContextProps = {
    appState,
    updateAppState,
    fetch,
    syncSelected,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um AppProvider");
  }
  return context;
};
