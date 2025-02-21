"use client"
import { createContext, useContext, useState } from "react";
import React from "react";


// inerfaz para el estado de las imagenes
interface ImagesState {
    imgBanner: string | null; // URL de la imagen del banner
    imgAlbum: string[]; // Array de URLs para las imágenes del álbum
}

// interfaz para el estado de las actividades
interface Activity {
    id: number
    title: string
    date: string
    time: string
    description: string
    location: string
}


// ServicioContexto para manejar el estado de las imagenes y actividades
export const ServiceContext = createContext<any>(null);


export const useServices = () => {

    const context = useContext(ServiceContext);

    if (!context) {
        throw new Error("useServices must be used within a ServiceProvider");
    }
    return context;
}


export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {

    const [images, setImages] = useState<ImagesState>({
        imgBanner: null,
        imgAlbum: [],
    });
    
    const [activities, setActivities] = useState<Activity[]>([])



    return (
        <ServiceContext.Provider
            value={{
                images,
                setImages,
                activities,
                setActivities,
            }}
        >
            {children}
        </ServiceContext.Provider>
    )
}


