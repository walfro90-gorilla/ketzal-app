# 🧳 Travel Planner - Guía de Usuario

## ¿Qué es el Travel Planner?

El Travel Planner es una función híbrida que transforma tu experiencia de compras en una herramienta de planificación de viajes inteligente. Te permite:

- **Organizar servicios por fecha**: En lugar de simplemente agregar al carrito, puedes planificar cuándo usar cada servicio
- **Crear múltiples planners**: Para diferentes viajes o destinos
- **Gestionar presupuestos**: Controla tus gastos con límites personalizados
- **Planificación visual**: Ve tu itinerario día por día

## 🚀 Funciones Principales

### 1. **Agregar a Planner desde Tours**
- En la página de tours (/tours), cada tour ahora tiene un botón **"Add to Planner"**
- También en las páginas de detalle de tours, el componente de pricing incluye este botón
- Puedes agregar rápidamente o seleccionar un planner específico

### 2. **Sidebar de Travel Planner**
- Accesible desde el header (icono de mapa para usuarios autenticados)
- Muestra resumen de todos tus planners
- Vista rápida del progreso y costos

### 3. **Página de Planners (/planners)**
- Vista completa de todos tus planners de viaje
- Crear, editar y eliminar planners
- Filtros por estado: Borrador, Activo, Completado
- Información detallada: fechas, presupuesto, participantes, destino

### 4. **Estados de Planners**
- **Borrador**: Planners en desarrollo
- **Activo**: Planners confirmados y en uso
- **Completado**: Viajes finalizados
- **Cancelado**: Planners cancelados

## 🎯 Cómo Usar

### Crear un Nuevo Planner
1. Ve a `/planners` o haz clic en "Mis Planners" en el header
2. Haz clic en "Nuevo Planner"
3. Completa la información:
   - Nombre del planner
   - Destino
   - Fechas de inicio y fin
   - Presupuesto máximo
   - Número de participantes
   - Descripción

### Agregar Servicios a un Planner
1. Navega a la página de tours `/tours`
2. Encuentra el tour que te interesa
3. Haz clic en **"Add to Planner"**
4. Selecciona un planner existente o crea uno nuevo
5. Elige la fecha en que planeas usar el servicio

### Gestionar Planners
- **Editar**: Modifica fechas, presupuesto o información del planner
- **Eliminar**: Elimina planners que ya no necesites
- **Ver detalles**: Revisa todos los servicios agregados y el itinerario

## 🔧 Funciones Técnicas

### Persistencia de Datos
- Todos los planners se guardan en `localStorage`
- Los datos persisten entre sesiones del navegador
- Sincronización automática entre pestañas

### Migración desde Cart
- Función para migrar items del carrito a un planner
- Mantiene compatibilidad con el sistema de carrito existente

### Tipos de Servicios Soportados
- **Tours**: Excursiones y actividades turísticas
- **Accommodation**: Hoteles y alojamiento
- **Transport**: Vuelos, transporte terrestre
- **Restaurant**: Experiencias gastronómicas
- **Activity**: Actividades recreativas

## 📱 Interfaz de Usuario

### Componentes Principales
- **AddToPlannerButton**: Botón universal para agregar servicios
- **TravelPlannerSidebar**: Panel lateral con resumen
- **PlannerCard**: Tarjetas de planners en la página principal
- **PlannerForm**: Formulario para crear/editar planners

### Navegación
- **Header**: Enlace directo a "Mis Planners" (solo usuarios autenticados)
- **Sidebar**: Acceso rápido desde cualquier página
- **Tour Pages**: Botones integrados en componentes de pricing

## 🛠️ Para Desarrolladores

### Estructura de Archivos
```
types/travel-planner.ts              # Definiciones de tipos
context/TravelPlannerContext.tsx     # Context principal
components/travel-planner/
  ├── AddToPlannerButton.tsx         # Botón para agregar servicios
  └── TravelPlannerSidebar.tsx       # Sidebar con resumen
app/(protected)/planners/page.tsx    # Página principal de planners
```

### Context API
- `useTravelPlanner()`: Hook principal para interactuar con planners
- CRUD completo: create, read, update, delete
- Gestión de ítems dentro de planners

### LocalStorage Schema
```javascript
{
  "travel-planners": [
    {
      id: "string",
      name: "string",
      description: "string",
      destination: "string",
      startDate: "ISO string",
      endDate: "ISO string",
      budget: number,
      participants: number,
      status: "draft|active|completed|cancelled",
      items: Array<PlannerItem>,
      createdAt: "ISO string",
      updatedAt: "ISO string",
      totalCost: number
    }
  ]
}
```

## 🎉 ¡Disfruta Planificando!

El Travel Planner está diseñado para hacer que la planificación de viajes sea más intuitiva y organizada. ¡Comienza creando tu primer planner y organiza tu próxima aventura!
