#!/usr/bin/env python3
"""
Test Suite de Responsividad - Portfolio Jason Caballero
Valida arquitectura responsive, meta-viewport, queries de medios,
accesibilidad de elementos interactivos y ergonomía multitáctil.
"""

import os
import re
import sys
from bs4 import BeautifulSoup

def test_html_structure(index_path):
    print("=" * 60)
    print("1. PROBANDO ESTRUCTURA HTML Y VIEWPORT")
    print("=" * 60)
    
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 1.1 Viewport tag
    viewport = soup.find('meta', attrs={'name': 'viewport'})
    assert viewport is not None, "FAIL: meta viewport no encontrado"
    content = viewport.get('content', '')
    assert 'width=device-width' in content, "FAIL: width=device-width no presente en viewport"
    assert 'initial-scale=1.0' in content, "FAIL: initial-scale=1.0 no presente en viewport"
    assert 'viewport-fit=cover' in content, "FAIL: viewport-fit=cover no presente (requerido para notches en iOS/Android)"
    print(" [PASS] Meta viewport correcto con viewport-fit=cover para dispositivos con notch/pantallas curvas.")

    # 1.2 Sections IDs and Nav Mappings
    nav = soup.find('nav')
    assert nav is not None, "FAIL: nav no encontrado"
    nav_links = nav.find_all('a', href=True)
    assert len(nav_links) >= 7, f"FAIL: Se esperaban al menos 7 enlaces en nav, encontrados {len(nav_links)}"
    
    print(f" [PASS] Encontrados {len(nav_links)} enlaces en la barra de navegación flotante.")
    
    for link in nav_links:
        href = link['href']
        if href.startswith('#'):
            target_id = href[1:]
            target_el = soup.find(id=target_id)
            assert target_el is not None, f"FAIL: El enlace de nav {href} apunta a #{target_id} pero no existe en el DOM!"
            print(f"   ✓ Enlace {href} -> <{target_el.name} id='{target_id}'> verificado con éxito.")

    # 1.3 Images responsive attributes
    images = soup.find_all('img')
    print(f" [PASS] Verificando {len(images)} imágenes en el documento...")
    for idx, img in enumerate(images):
        src = img.get('src', '')
        alt = img.get('alt', '')
        assert alt, f"FAIL: Imagen {src} no tiene atributo alt descriptivo"
    print(" [PASS] Todas las imágenes tienen textos alt válidos.")

    # 1.4 Form inputs size
    inputs = soup.find_all(['input', 'textarea', 'button'])
    print(f" [PASS] Verificando {len(inputs)} controles de formulario e interactivos...")
    form = soup.find('form', id='contact-form')
    assert form is not None, "FAIL: Formulario #contact-form no encontrado"
    submit_btn = form.find('button', attrs={'type': 'submit'})
    assert submit_btn is not None, "FAIL: Botón submit no encontrado en contact-form"
    print(" [PASS] Formulario de contacto con submit button verificado.")

    return True

def test_css_responsive_rules(css_path):
    print("\n" + "=" * 60)
    print("2. PROBANDO REGLAS CSS Y CONSULTAS DE MEDIOS (MEDIA QUERIES)")
    print("=" * 60)

    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 2.1 Media query checks
    expected_queries = [
        r'@media[^{]+hover:\s*none',
        r'@media[^{]+max-width:\s*(?:768|767)px',
        r'@media[^{]+max-width:\s*640px',
        r'@media[^{]+max-width:\s*(?:480|479)px',
        r'@media[^{]+max-width:\s*(?:360|359)px',
        r'@media[^{]+orientation:\s*landscape',
        r'@media[^{]+min-width:\s*1536px'
    ]

    for q in expected_queries:
        match = re.search(q, css)
        assert match is not None, f"FAIL: Media query {q} no encontrada en {css_path}"
        print(f" [PASS] Breakpoint detectado: {q}")

    # 2.2 Reset & Overflow containment
    assert 'overflow-x: hidden' in css, "FAIL: overflow-x: hidden no presente en html/body"
    assert 'scroll-behavior: smooth' in css, "FAIL: scroll-behavior: smooth no presente"
    assert 'scroll-padding-top' in css, "FAIL: scroll-padding-top no presente para anclas"
    assert 'overflow-x: clip' in css, "FAIL: overflow-x: clip no presente en secciones"
    assert 'max-width: 100vw' in css, "FAIL: max-width: 100vw no presente"
    print(" [PASS] Contención global de desbordamiento (overflow-x clip y max-width) verificada.")

    # 2.3 Floating navbar responsiveness
    assert 'nav.fixed' in css, "FAIL: nav.fixed no definido"
    assert 'env(safe-area-inset-bottom' in css, "FAIL: safe-area-inset-bottom no usado para nav o footer"
    assert 'touch-action: manipulation' in css, "FAIL: touch-action: manipulation no configurado para toques rápidos"
    assert '-webkit-tap-highlight-color: transparent' in css, "FAIL: tap-highlight transparente no configurado"
    print(" [PASS] Ergonomía de barra flotante y soporte safe-area para iOS/Android verificado.")

    # 2.4 iOS Auto-zoom prevention on inputs
    assert 'font-size: 16px' in css, "FAIL: .cyber-input debe tener font-size: 16px para evitar auto-zoom en iOS Safari"
    print(" [PASS] Prevención de auto-zoom en iOS Safari (input >= 16px) verificada.")

    # 2.5 Modal diploma responsiveness
    assert '#certificate-modal' in css, "FAIL: Reglas de #certificate-modal no encontradas"
    assert 'max-height: calc(100vh' in css, "FAIL: Altura máxima responsive para modal no encontrada"
    print(" [PASS] Adaptabilidad del modal de certificados en pantallas pequeñas verificada.")

    return True

def test_js_responsive_logic(js_path):
    print("\n" + "=" * 60)
    print("3. PROBANDO LÓGICA JAVASCRIPT RESPONSIVA")
    print("=" * 60)

    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    # 3.1 Cursor fine-pointer guard
    assert 'isFinePointer' in js or 'pointer: fine' in js, "FAIL: Cursor trail debe estar condicionado a pointer: fine"
    print(" [PASS] Cursor personalizado desactivado en dispositivos táctiles para optimizar rendimiento.")

    # 3.2 Active nav includes footer
    assert 'footer[id]' in js or 'footer#contacto' in js or 'section[id], footer[id]' in js, "FAIL: El observador de navegación debe incluir el footer#contacto"
    print(" [PASS] Observador de scroll incluye <footer id='contacto'>.")

    # 3.3 Touch swipe carousel
    assert 'touchstart' in js and 'touchend' in js, "FAIL: Eventos de swipe táctil (touchstart/touchend) no encontrados en carrusel"
    print(" [PASS] Gestos táctiles de deslizamiento (swipe horizontal) soportados en carrusel de premios.")

    # 3.4 Terminal tab loading
    assert 'loadTerminalTab' in js, "FAIL: loadTerminalTab no encontrado"
    print(" [PASS] Terminal interactiva responsive implementada con carga dinámica de pestañas.")

    return True

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_file = os.path.join(base_dir, 'index.html')
    css_file   = os.path.join(base_dir, 'css', 'style.css')
    js_file    = os.path.join(base_dir, 'js', 'main.js')

    success = True
    try:
        success = test_html_structure(index_file) and success
        success = test_css_responsive_rules(css_file) and success
        success = test_js_responsive_logic(js_file) and success
    except AssertionError as e:
        print(f"\n❌ ERROR EN PRUEBA: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("🎉 TODAS LAS PRUEBAS DE RESPONSIVIDAD PASARON SATISFACTORIAMENTE!")
    print("=" * 60)
    sys.exit(0)
