"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ServiceFormData } from "../../validations/service-form.validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ImageUploader } from "../ui/image-uploader";
import { ImageIcon } from "lucide-react";

export function ImagesSection() {
  const { control } = useFormContext<ServiceFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Imágenes del Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="images.imgBanner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Imagen Principal (Banner)</FormLabel>
              <p className="text-sm text-muted-foreground mb-2">
                Esta será la imagen principal que se mostrará en la tarjeta del servicio.
              </p>
              <FormControl>
                <ImageUploader
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] || "")}
                  maxFiles={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="images.imgAlbum"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Galería de Imágenes</FormLabel>
              <p className="text-sm text-muted-foreground mb-2">
                Agrega más fotos para mostrar diferentes aspectos de tu servicio (mínimo 3, máximo 9).
              </p>
              <FormControl>
                <ImageUploader
                  value={field.value || []}
                  onChange={field.onChange}
                  maxFiles={9}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
