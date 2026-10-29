# Portfolio - Jason Caballero

Portafolio web profesional de Jason Caballero enfocado en Ingeniería de Sistemas, Redes y Ciberseguridad.

## 📁 Estructura del Proyecto

El proyecto está organizado de forma modular para facilitar el mantenimiento y escalabilidad:

```text
portfolio/
├── css/
│   └── style.css            # Estilos personalizados, animaciones y glassmorphism
├── js/
│   ├── main.js              # Lógica interactiva (animaciones, filtros, carrusel, tilt, formulario)
│   └── tailwind.config.js   # Configuración de tema, colores y extensiones de Tailwind CSS
├── img/                     # Todas las imágenes y recursos gráficos (.webp, .png, .jpg)
│   ├── logo.webp
│   ├── jason.webp
│   └── ...
├── files/                   # Documentos y archivos descargables
│   └── cv-jason-caballero.pdf
├── index.html               # Estructura semántica principal
└── README.md
```

## 🚀 Cómo ejecutar localmente

Puedes servir el sitio con cualquier servidor estático local, por ejemplo con Python:

```bash
# Python 3
python3 -m http.server 3000
```

Luego abre tu navegador en `http://localhost:3000`.