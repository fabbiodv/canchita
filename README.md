# Canchita - Sistema de Reserva de Canchas

## Descripción
Sistema web para la reserva de canchas deportivas desarrollado con Next.js 14, React 19, TypeScript y Tailwind CSS.

## Características
- 🏟️ Reserva de diferentes tipos de canchas (Fútbol 5, 7 y 11)
- 📅 Calendario interactivo para selección de fechas
- ⏰ Sistema de horarios disponibles
- 💳 Integración con MercadoPago para pagos
- 🎨 Interfaz moderna y responsive

## Requisitos Previos
- Node.js 18.0 o superior
- npm, yarn, pnpm o bun

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/canchita.git
cd canchita
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías Utilizadas
- [Next.js 14](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## Estructura del Proyecto
```
canchita/
├── src/
│   ├── app/           # Rutas y páginas
│   ├── components/    # Componentes React
│   ├── lib/          # Utilidades y configuraciones
│   └── types/        # Definiciones de TypeScript
├── public/           # Archivos estáticos
└── ...
```

## Despliegue
La forma más sencilla de desplegar esta aplicación es usando [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/canchita)

## Licencia
MIT

## Contribuir
Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias.
