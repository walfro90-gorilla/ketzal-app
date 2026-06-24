# Guía para el Equipo de Frontend sobre la Refactorización del Backend

Este documento describe los cambios que se están realizando en la arquitectura del backend y el impacto (o la falta de él) en el desarrollo del frontend.

## ¿Qué está cambiando?

El backend está siendo refactorizado de una **arquitectura monolítica a un enfoque de micro-funciones serverless**.

-   **Antes:** Toda la aplicación (productos, usuarios, servicios, etc.) se desplegaba como una única y gran función en Vercel.
-   **Ahora:** Cada módulo de la aplicación (como `ProductsModule`, `UsersModule`, etc.) se desplegará como una función serverless independiente y optimizada.

## ¿Por qué se está haciendo este cambio?

El objetivo principal es mejorar el **rendimiento, la escalabilidad y la eficiencia** del backend. Al dividir la aplicación, logramos:

-   **Reducción de "Cold Starts":** Tiempos de arranque más rápidos, ya que cada función solo carga el código que necesita.
-   **Mejor Escalabilidad:** Cada parte de la API puede escalar de forma independiente según su demanda.
-   **Mantenimiento Simplificado:** Es más fácil desarrollar y mantener módulos aislados.

## ¿Cuál es el impacto en el Frontend?

**Ninguno.**

La refactorización se está manejando a nivel de infraestructura y enrutamiento en Vercel. Las rutas de la API que consume el frontend **no cambiarán**.

Por ejemplo:
-   La petición a `GET /api/products` seguirá siendo `GET /api/products`.
-   La petición a `POST /api/users` seguirá siendo `POST /api/users`.

El enrutamiento de Vercel se encargará de dirigir la petición a la función serverless correcta de manera transparente para el cliente.

## ¿Necesitamos hacer algún cambio en el código del Frontend?

No. No se requiere ninguna acción por parte del equipo de frontend. Pueden seguir utilizando la API como lo han hecho hasta ahora.

Este documento es puramente informativo para mantener al equipo al tanto de las mejoras en la arquitectura del backend. **En resumen: la API sigue funcionando exactamente igual para el frontend.**

---

## Anexo Técnico: ¿Cómo funciona el enrutamiento?

Para mayor claridad, aquí se muestra un ejemplo simplificado de cómo se actualiza nuestra configuración de despliegue (`vercel.json`).

### Antes (Monolito)

Todas las rutas (`/api/*`) eran dirigidas a una sola función que contenía toda la aplicación.

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

### Después (Micro-funciones)

Ahora, las rutas más específicas se capturan primero y se dirigen a su función correspondiente. Si una ruta no coincide con ninguna función específica, es manejada por la función principal restante.

```json
{
  "routes": [
    // 1. Peticiones a /api/products van a la función de productos
    {
      "src": "/api/products(.*)",
      "dest": "api/products.ts"
    },
    // 2. Peticiones a /api/users van a la función de usuarios
    {
      "src": "/api/users(.*)",
      "dest": "api/users.ts"
    },
    // 3. Peticiones a /api/wallet van a la función de wallet
    {
      "src": "/api/wallet(.*)",
      "dest": "api/wallet.ts"
    },
    // 4. Peticiones a /api/services van a la función de services
    {
      "src": "/api/services(.*)",
      "dest": "api/services.ts"
    },
    // 5. Peticiones a /api/suppliers van a la función de suppliers
    {
      "src": "/api/suppliers(.*)",
      "dest": "api/suppliers.ts"
    },
    // 6. Peticiones a /api/reviews van a la función de reviews
    {
      "src": "/api/reviews(.*)",
      "dest": "api/reviews.ts"
    },
    // 7. Peticiones a /api/planners van a la función de planners
    {
      "src": "/api/planners(.*)",
      "dest": "api/planners.ts"
    },
    // 8. Peticiones a /api/notifications van a la función de notifications
    {
      "src": "/api/notifications(.*)",
      "dest": "api/notifications.ts"
    },
    // 9. Peticiones a /api/locations van a la función de locations
    {
      "src": "/api/locations(.*)",
      "dest": "api/locations.ts"
    },
    // 10. Peticiones a /api/categories van a la función de categories
    {
      "src": "/api/categories(.*)",
      "dest": "api/categories.ts"
    },

    // 11. Cualquier otra petición va a la función principal (fallback)
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

Como pueden ver, el cambio es interno. La URL que ustedes consumen (`/api/products`, `/api/services`) no se ve afectada.
