"use client"

import React, { createContext, useContext, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogOverlay } from "@radix-ui/react-alert-dialog";

// Define los tipos para las opciones y el contexto

type AlertDialogOptions = {
  title: string;
  message1: string;
  message2: string;
  confirmText: string;
  cancelText: string;
};

type AlertDialogContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showDialog: (options: AlertDialogOptions) => Promise<boolean>;
};

const AlertDialogContext = createContext<AlertDialogContextType>({
  isOpen: false,
  setIsOpen: () => {},
  showDialog: async () => false,
});

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<AlertDialogOptions>({
    title: "",
    message1: "",
    message2: "",
    confirmText: "",
    cancelText: "",
  });
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => { });

  const showDialog = (options: AlertDialogOptions) => {
    setDialogOptions(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise(false);
  };

  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen, showDialog }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>

            <AlertDialogOverlay>{dialogOptions.title} </AlertDialogOverlay>
            <AlertDialogTitle>{dialogOptions.message1}</AlertDialogTitle>
            <AlertDialogDescription>{dialogOptions.message2}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{dialogOptions.cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{dialogOptions.confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  )
}

export function useAlertDialog() {
  return useContext(AlertDialogContext);
}

