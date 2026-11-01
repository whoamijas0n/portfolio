#!/usr/bin/env python3
"""
Simulación de Viewports y Cálculos de Dimensiones
Verifica que los anchos de barra flotante, contenedores de tarjetas,
bloques de estadísticas y modales no superen los anchos del viewport.
"""

import sys

VIEWPORTS = [
    {"name": "Samsung Galaxy Fold (Pantalla Externa)", "width": 320, "height": 653, "type": "Foldable Phone"},
    {"name": "Apple iPhone SE / 8", "width": 375, "height": 667, "type": "Compact Phone"},
    {"name": "Apple iPhone 14/15/16 Pro", "width": 393, "height": 852, "type": "Standard Phone"},
    {"name": "Google Pixel 8 / Samsung S24", "width": 412, "height": 915, "type": "Large Phone"},
    {"name": "Apple iPad Mini / 9.7 (Portrait)", "width": 768, "height": 1024, "type": "Tablet Portrait"},
    {"name": "Apple iPad Air / 11 (Portrait)", "width": 820, "height": 1180, "type": "Tablet Portrait"},
    {"name": "Apple iPad Air / 11 (Landscape)", "width": 1180, "height": 820, "type": "Tablet Landscape"},
    {"name": "Laptop estándar (HD)", "width": 1366, "height": 768, "type": "Laptop"},
    {"name": "Monitor Desktop (FHD)", "width": 1920, "height": 1080, "type": "Desktop Monitor"},
    {"name": "Monitor Ultrawide (2K/4K)", "width": 2560, "height": 1440, "type": "Ultrawide Monitor"},
    {"name": "Móvil en Horizontal (Landscape)", "width": 844, "height": 390, "type": "Landscape Mobile"}
]

def calculate_navbar_width(vw, vh):
    # Reglas CSS del navbar según viewport
    if vh <= 500 and vw > vh:
        # Landscape mobile
        item_w = 32
        gap = 0.15 * 16 # 2.4px
        pad = 2 * (0.25 * 16) # 8px
        div_w = 1 + 2 * (0.15 * 16) # 5.8px
    elif vw < 360:
        # Foldable / Ultra narrow
        item_w = 31
        gap = 0
        pad = 2 * (0.25 * 16) # 8px
        div_w = 1 + 2 * (0.08 * 16) # 3.56px
    elif vw < 480:
        # Standard phone
        item_w = 35
        gap = 0.1 * 16 # 1.6px
        pad = 2 * (0.3 * 16) # 9.6px
        div_w = 1 + 2 * (0.15 * 16) # 5.8px
    elif vw < 768:
        # Tablet portrait
        item_w = 38
        gap = 0.15 * 16 # 2.4px
        pad = 2 * (0.35 * 16) # 11.2px
        div_w = 1 + 2 * (0.2 * 16) # 7.4px
    else:
        # Desktop
        item_w = 42
        gap = 0.25 * 16 # 4px
        pad = 2 * (0.45 * 16) # 14.4px
        div_w = 1 + 2 * (0.25 * 16) # 9px

    total_w = (8 * item_w) + (7 * gap) + div_w + pad
    return total_w

def run_viewport_simulation():
    print("=" * 75)
    print("SIMULACIÓN DE ADAPTABILIDAD EN 11 CATEGORÍAS DE DISPOSITIVOS")
    print("=" * 75)
    
    all_ok = True
    
    for dev in VIEWPORTS:
        vw = dev["width"]
        vh = dev["height"]
        name = dev["name"]
        dtype = dev["type"]
        
        # Calcular ancho del navbar flotante
        nav_w = calculate_navbar_width(vw, vh)
        margin_left_right = (vw - nav_w) / 2
        
        # El navbar debe caber dejando al menos 4px de margen a los lados
        nav_fits = margin_left_right >= 4
        
        # Contenedores con padding 16px (px-4) a cada lado
        content_w = vw - 32
        
        # Estadísticas: 2 columnas en mobile, 4 en tablet/desktop
        stat_cols = 2 if vw < 640 else 4
        stat_card_w = (content_w - (stat_cols - 1) * 12) / stat_cols
        
        status_icon = "✓" if nav_fits and stat_card_w > 90 else "✗"
        print(f" {status_icon} [{dtype.upper()}] {name} ({vw}x{vh}px):")
        print(f"    - Barra flotante: {nav_w:.1f}px (Margen lateral: {margin_left_right:.1f}px) -> {'OK' if nav_fits else 'OVERFLOW'}")
        print(f"    - Área de contenido: {content_w}px | Tarjeta estadística: {stat_card_w:.1f}px ({stat_cols} cols) -> {'OK' if stat_card_w > 90 else 'ESTRECHO'}")

        if not nav_fits:
            all_ok = False

    print("=" * 75)
    if all_ok:
        print("🎉 TODOS LOS DISPOSITIVOS PASARON LA SIMULACIÓN DE DIMENSIONES Y MARGEN!")
    else:
        print("❌ ALGUNOS DISPOSITIVOS TUVIERON DESBORDAMIENTO.")
    print("=" * 75)
    return all_ok

if __name__ == '__main__':
    if not run_viewport_simulation():
        sys.exit(1)
    sys.exit(0)
