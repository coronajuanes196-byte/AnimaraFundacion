# 🐾 Animara Fundación – Sitio Web

Este paquete contiene el sitio web completo de Animara Fundación (6 páginas HTML + CSS + JS + logo).

## 📦 Contenido
```
animara-web/
├── index.html          (Inicio)
├── nosotros.html        (Quiénes somos)
├── donar.html           (Donar)
├── como-funciona.html   (¿Cómo funciona?)
├── aliados.html         (Nuestros aliados)
├── contacto.html        (Contacto)
├── style.css            (estilos globales)
├── main.js              (interactividad)
└── logo.jpeg            (logo oficial)
```

## 🚀 Pasos para dejarlo listo en VSCode

### 1. Descomprimir el archivo
Descomprime `animara-web.zip` en la carpeta donde quieras trabajar el proyecto.

```bash
unzip animara-web.zip -d animara-web
cd animara-web
```

### 2. Abrir el proyecto en VSCode
```bash
code .
```

### 3. Ver el sitio en vivo (recomendado)
Instala la extensión **Live Server** de VSCode (Ritwick Dey) desde el panel de extensiones, o por terminal:

```bash
code --install-extension ritwickdey.LiveServer
```

Luego, dentro de VSCode:
- Click derecho sobre `index.html`
- Selecciona **"Open with Live Server"**
- Se abrirá automáticamente en `http://127.0.0.1:5500`

### 4. Alternativa sin extensión (usando Python)
Si prefieres no instalar extensiones, puedes levantar un servidor local simple:

```bash
# Python 3
python3 -m http.server 5500
```

Luego abre en tu navegador: `http://localhost:5500`

### 5. Alternativa con Node.js
```bash
npx serve .
```

## ✏️ Cómo editar contenido

- **Textos:** edita directamente cada archivo `.html` (todo el contenido está en español, fácil de ubicar).
- **Colores:** edita las variables al inicio de `style.css`:
  ```css
  :root {
    --orange: #C8650A;
    --orange-light: #E87722;
    --orange-warm: #F5A623;
    ...
  }
  ```
- **Logo:** reemplaza `logo.jpeg` por tu archivo (mantén el mismo nombre o actualiza las referencias `<img src="logo.jpeg">` en cada HTML).
- **Imágenes de fondo:** son URLs de Unsplash; puedes cambiarlas por las tuyas en cada `<img src="...">`.

## 🌐 Publicar el sitio (gratis)

**Opción A — Netlify Drop (más fácil):**
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `animara-web` completa
3. Listo, te da una URL pública

**Opción B — GitHub Pages:**
```bash
git init
git add .
git commit -m "Sitio Animara Fundación"
git branch -M main
git remote add origin TU_REPO_URL
git push -u origin main
```
Luego activa GitHub Pages en Settings → Pages → Branch: main.

**Opción C — Vercel:**
```bash
npx vercel
```

## 🛠️ Notas técnicas
- No requiere build ni `npm install` — es HTML/CSS/JS puro.
- Compatible con cualquier navegador moderno.
- Responsive (mobile, tablet, desktop).
- Las fuentes (Playfair Display, Nunito) se cargan desde Google Fonts vía CDN — necesitas conexión a internet la primera vez.
