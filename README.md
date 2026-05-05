# Cristhian Borges — Portfolio (Astro)

Portfolio personal construido con Astro 5, componentes modulares e iconos de `lucide-astro`.

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev
# → http://localhost:4321

# 3. Build de producción
npm run build

# 4. Preview del build
npm run preview
```

## 📁 Estructura

```
src/
├── components/
│   ├── ProwlerBackground.astro   # Malla + haces de luz cian/violeta
│   ├── Nav.astro                  # Barra de navegación fija
│   ├── Hero.astro                 # Sección hero con nombre y CTA
│   ├── Recorrido.astro            # Timeline de 4 fases
│   ├── Tools.astro                # Grid de tecnologías con iconos
│   ├── Contact.astro              # Formulario de contacto
│   ├── Footer.astro               # Footer minimalista
│   ├── SectionLabel.astro         # Tag de sección reutilizable
│   └── TimelineItem.astro         # Item individual del timeline
├── layouts/
│   └── BaseLayout.astro           # Layout HTML base + fuentes
├── styles/
│   └── global.css                 # Variables CSS + estilos globales
└── pages/
    └── index.astro                # Página principal
```

## 🎨 Personalización

Las variables de color y tipografía están en `src/styles/global.css`:

```css
:root {
  --cyan: #06B6D4;
  --violet: #8B5CF6;
  --bg: #070B14;
  /* ... */
}
```

## 🔌 Conectar el formulario

El formulario está listo para integrarse con [Resend](https://resend.com).
Edita `src/components/Contact.astro` y añade tu lógica de envío
(API endpoint en `src/pages/api/contact.ts` con `output: 'server'`).

## 📦 Stack

- **Astro 5** — framework principal
- **lucide-astro** — iconografía
- **Space Grotesk + IBM Plex Mono** — Google Fonts
- **CSS puro** — sin Tailwind (variables CSS para tematización)

---

© 2026 Cristhian Borges
