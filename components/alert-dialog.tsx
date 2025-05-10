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

const AlertDialogContext = createContext({
  isOpen: false,
  setIsOpen: (open: boolean) => { },
  showDialog: (options: { title: string, message1: string, message2: string, confirmText: string, cancelText: string }) => Promise.resolve(false),
});

export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState({ title: "", message1: "", message2: "", confirmText: "", cancelText: "" });
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => { });

  const showDialog = (options: { title: string, message1: string, message2: string, confirmText: string, cancelText: string }) => {
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

