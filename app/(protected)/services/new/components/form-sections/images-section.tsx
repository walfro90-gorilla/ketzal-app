"use client"

import React from "react"
import { Control, FieldErrors } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import ImageUploader from "@/components/images-uploader"

interface ServiceFormFields {
  images?: {
    imgBanner: string
    imgAlbum: string[]
  }
}

interface ImagesSectionProps {
  control: Control<ServiceFormFields>
  errors: FieldErrors<ServiceFormFields>
}

export function ImagesSection({ control, errors }: ImagesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imágenes del Servicio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <FormLabel className="text-base font-medium">Imagen Principal (Banner)</FormLabel>
            <p className="text-sm text-muted-foreground mb-2">
              Esta será la imagen principal que se mostrará en la tarjeta del servicio
            </p>
            <FormField
              control={control}
              name="images.imgBanner"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUploader />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-base font-medium">Galería de Imágenes</FormLabel>
            <p className="text-sm text-muted-foreground mb-2">
              Agrega más fotos para mostrar diferentes aspectos de tu servicio
            </p>
            <FormField
              control={control}
              name="images.imgAlbum"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUploader />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {errors.images && (
          <div className="text-sm text-destructive">
            {errors.images.imgBanner && <p>{errors.images.imgBanner.message}</p>}
            {errors.images.imgAlbum && <p>{errors.images.imgAlbum.message}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 