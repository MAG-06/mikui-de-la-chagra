# Mikui de la Chagra 🌿

Landing en 3D de nuestro producto para el Taller 8 – Región Amazónica (Ing. Software).
Torticas de yuca y plátano maduro que se pueden **desarmar en 3D** para ver qué ingredientes llevan y por qué los escogimos.

**Integrantes:** Felipe Castaño Londoño, Sebastian Betancourth Moreu, Juan Camilo Castañeda Lopera, Mateo Albornoz

## Qué hace

- Tortica en 3D que gira sola y se puede rotar con el mouse o el dedo.
- **Desarmar / armar:** botón, barra, rueda del mouse o pellizco con dos dedos en celular.
- Cada ingrediente tiene una ficha: cantidad, para qué sirve y de dónde viene (de la chagra, aporte del grupo o para cocinar).
- Pestañas con el producto, la preparación y qué es la chagra.
- Responsive: PC, tablet, Android y iPhone (vertical y horizontal).

## Tecnologías

- HTML, CSS y JavaScript puros (sin frameworks ni build).
- [Three.js r160](https://threejs.org) incluido en `/vendor/three` (licencia MIT), así que no depende de ningún CDN.
- Todo el 3D se modela con código; no hay archivos de modelos.

## Estructura

```
├── index.html          # estructura de la página
├── css/styles.css      # estilos y responsive
├── js/data.js          # textos e ingredientes (editar aquí)
├── js/main.js          # escena 3D e interacción
├── vendor/three/       # Three.js local
├── assets/favicon.svg
└── vercel.json         # config de despliegue
```

## Correrlo en local

Como usa módulos de JavaScript, **no funciona abriendo el index.html con doble clic**: hay que usar un servidor.

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Node:** `npx serve .` y abrir la URL que muestra.
- **Python:** `python -m http.server 5500` y abrir `http://localhost:5500`.

Para probarlo en el celular en la misma red wifi, abre `http://IP-DE-TU-PC:5500`.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Landing 3D Mikui de la Chagra"
git branch -M main
git remote add origin https://github.com/USUARIO/mikui-de-la-chagra.git
git push -u origin main
```

## Desplegar en Vercel

1. Entrar a [vercel.com](https://vercel.com) con la cuenta de GitHub.
2. **Add New → Project** → importar el repo `mikui-de-la-chagra`.
3. *Framework Preset:* **Other**. No hay que poner build command ni output directory.
4. **Deploy**. Queda en algo como `https://mikui-de-la-chagra.vercel.app`.

Cada `git push` a `main` vuelve a desplegar solo.

## Editar contenido

- Textos de ingredientes, cantidades y pestañas: `js/data.js`.
- Colores: variables al inicio de `css/styles.css`.
- Formas 3D de cada ingrediente: funciones `yuca()`, `platano()`, etc. en `js/main.js`.

## Respeto cultural

La propuesta no se presenta como receta ancestral ni de un pueblo específico: es una reinterpretación que reconoce de dónde viene la inspiración (la chagra, la yuca y el plátano). Las ilustraciones son hojas sencillas, sin símbolos ceremoniales.
