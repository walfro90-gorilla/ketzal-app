"use client";

import React, { Suspense, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";
import { FormErrorBoundary } from "../form-sections/error-boundary";

interface LazyFormSectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

const DefaultFallback = ({ name }: { name?: string }) => (
  <Card>
    <CardContent className="py-8">
      <LoadingSpinner text={name ? `Cargando ${name}...` : "Cargando..."} />
    </CardContent>
  </Card>
);

export const LazyFormSection = memo(({ children, fallback, name }: LazyFormSectionProps) => {
  return (
    <FormErrorBoundary>
      <Suspense fallback={fallback || <DefaultFallback name={name} />}>
        {children}
      </Suspense>
    </FormErrorBoundary>
  );
});

LazyFormSection.displayName = "LazyFormSection";

// Hook para optimizar renders cuando los datos no han cambiado
export function useFormSectionOptimization(data: Record<string, unknown>) {
  const dataString = JSON.stringify(data);
  
  return React.useMemo(() => data, [data, dataString]);
}

// Higher-order component para memoización de secciones
export function withFormSectionMemo<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
) {
  const MemoizedComponent = memo(Component);
  MemoizedComponent.displayName = `withFormSectionMemo(${Component.displayName || Component.name})`;
  
  return MemoizedComponent;
} 