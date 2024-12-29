"use client"
import { createContext, useContext, useState } from "react";



export const SupplierContext = createContext<any>(null);


export const useSuppliers = () => {

    const context = useContext(SupplierContext);

    if (!context) {
        throw new Error("useSuppliers must be used within a SupplierProvider");
    }
    return context;
}


export const SupplierProvider = ({ children }: { children: React.ReactNode }) => {

    const [idSupplier, setIdSupplier] = useState<number | null>(null)

    const getIdSupplier = (id: number) => {
        setIdSupplier(id)
    }


    return (
        <SupplierContext.Provider
            value={{
                idSupplier,
                getIdSupplier
            }}
        >
            {children}
        </SupplierContext.Provider>
    )
}


