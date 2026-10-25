import { createContext, useContext, useState } from "react";

const AppRefreshContext = createContext();

export const AppRefreshProvider = ({ children }) => {

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshApp = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AppRefreshContext.Provider value={{ refreshKey, refreshApp }}>
            {children}
        </AppRefreshContext.Provider>
    );
};

export const useAppRefresh = () => useContext(AppRefreshContext);