
'use client';
import { useUser } from "@/context/UserContext";
import React from "react";

export default function PerfilUsuario() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg text-gray-500">Cargando información del usuario...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-[#18181b] rounded-xl shadow-lg p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary mb-2 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-4xl text-primary font-bold">{user.name?.[0] || "?"}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        <span className="text-gray-500 dark:text-gray-300">{user.email}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">ID: {user.id}</span>
      </div>
    </div>
  );
}
