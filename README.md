# @sken.blk - Portfolio Website

## 📖 Descrizione Progetto

Sito web portfolio per l'artista del tatuaggio **@sken.blk**, resident artist presso **Il Circo Nero Tattoo Milano**. Specializzato in dark tattoo, fluid tattoo e blackwork con un'estetica moderna e minimalista.

---

## 🚀 Funzionalità Implementate

### 🎨 **Design & UX**
- **Dark Theme**: Estetica scura e moderna con palette monocromatica
- **Responsive Design**: Ottimizzato per desktop, tablet e mobile
- **Fluid Animations**: Transizioni fluide e naturali
- **Accessibility**: Supporto ARIA labels e navigazione keyboard

### 📷 **Sistema Portfolio**
- **26 Opere**: Portfolio completo con immagini reali
- **9 Categorie**: Filtri per zona del corpo (braccio, gamba, torso, etc.)
- **Lightbox**: Visualizzazione full-screen delle opere
- **Lazy Loading**: Caricamento ottimizzato delle immagini

### 🎬 **Contenuti Multimediali**
- **Video Hero**: Background video nella sezione principale
- **Process Videos**: Showcase del processo creativo
- **Image Optimization**: Compressione e formati ottimizzati

### 📱 **Contatti & Booking**
- **WhatsApp Button**: Pulsante floating con messaggio pre-compilato
- **Contact Form**: Modulo di contatto funzionante
- **Google Maps**: Mappa integrata con posizione studio
- **Social Links**: Collegamenti a profili social

---

## 🛠️ Implementazioni Tecniche

### **Preloader Sistema**

#### 🔄 **Evoluzione del Preloader**

**Versione 1 - Sistema Completo:**
- Progress bar colorata con gradients
- Percentuale numerica animata
- Spinner circolare elaborato
- Background favicon multi-layer
- Text-shadow e glassmorphism effects

**Versione 2 - Dark Fluid:**
- Progress bar monocromatica (bianco su nero)
- Favicon background prominente (600x600px)
- Effetti glow e shimmer
- Splash effect al completamento

**Versione 3 - Enhanced Visibility:**
- Favicon ingrandito (800x800px)
- Triple layer animati
- Logo 5rem con text-shadow multipli
- Progress bar 400x6px con effetti luminosi

**Versione 4 - Fullscreen:**
- Copertura 100vw x 100vh garantita
- Z-index 99999 per priorità massima
- Overflow control completo
- Glassmorphism container

**Versione 5 - Minimal (Attuale):**
```css
.preloader {
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preloader__logo {
  font-size: 2.5rem;
  font-weight: 300;
  color: #ffffff;
}

.preloader__dots span {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  animation: dotPulse 1.5s ease-in-out infinite;
}
```

#### ⚡ **Caratteristiche Minimal:**
- **Logo @sken.blk**: Elemento centrale pulito (2.5rem)
- **Dots Animation**: 3 punti animati in sequenza
- **Background Nero**: Solido, no gradients o immagini
- **Timing Ottimizzato**: 3s timeout, transizioni fluide
- **Performance**: 90% meno CSS, rendering veloce

---

### **Logo Navbar Circolare**

#### 🔵 **Design LED Effect**
```css
.nav__logo {
  border-radius: 50%;
  padding: 3px;
  box-shadow: 
    0 0 10px rgba(255,255,255,0.3),
    0 0 20px rgba(255,255,255,0.15),
    0 0 30px rgba(255,255,255,0.1);
  animation: rotate 4s linear infinite;
}

.nav__logo img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
```

#### ✨ **Effetti Implementati:**
- **Forma Circolare**: Border-radius 50%
- **Glow LED**: Multi-layer box-shadow bianco
- **Animazione Rotante**: Gradient conica animata
- **Hover Effect**: Scale 1.05x e glow intensificato
- **Responsive**: 60px → 50px → 45px per dispositivi

---

### **WhatsApp Integration**

#### 💬 **Pulsante Floating**
```css
.whatsapp-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: #25d366;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  animation: pulse 2s infinite;
  z-index: 1000;
}
```

#### 📞 **Configurazione:**
- **Numero**: +39 327 212 7922
- **Messaggio**: "Ciao Sken! vorrei qualche informazione in più riguardo un tattoo"
- **URL**: `https://wa.me/393272127922?text=...`
- **Animazione**: Pulse effect per attirare attenzione

---

### **Google Maps Integration**

#### 🗺️ **Studio Location**
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.8!2d9.1873897!3d45.4618956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI3JzQyLjgiTiA5wrAxMScxNC42IkU!5e0!3m2!1sit!2sit!4v1634567890123!5m2!1sit!2sit"
  width="100%" 
  height="400" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy">
</iframe>
```

#### 📍 **Dettagli:**
- **Studio**: Il Circo Nero Tattoo Milano
- **Coordinate**: 45.4618956, 9.1873897
- **Indirizzo**: Milano (MI)
- **Integrazione**: Sezione contatti responsive

---

## 📂 Struttura File

```
sito-luca/
├── index.html                 # Pagina principale
├── assets/
│   ├── css/
│   │   └── main.css          # Stili principali (2200+ righe)
│   ├── js/
│   │   └── main.js           # JavaScript (1500+ righe)
│   └── images/
│       ├── favicon.png       # Logo
│       ├── artist-photo.jpg  # Foto artista
│       ├── portfolio/        # 26+ immagini portfolio
│       └── videos/           # Video background
└── README.md                 # Questa documentazione
```

---

## 🎨 Portfolio Categorie

### 📋 **Categorie Implementate:**
1. **Braccio** (3 opere)
2. **Gamba** (3 opere)  
3. **Torso** (2 opere)
4. **Schiena** (2 opere)
5. **Collo** (1 opera)
6. **Viso** (1 opera)
7. **Mano** (varie opere)
8. **Piede** (varie opere)
9. **Avambraccio** (varie opere)

### 🔧 **Sistema Filtri:**
```javascript
const portfolioData = [
    {
        id: 1,
        category: 'braccio',
        image: './assets/images/portfolio/braccio_1.jpg',
        title: 'Dark Sleeve Design',
        description: 'Tatuaggio blackwork completo su braccio...'
    }
    // ... 25+ altre opere
];
```

---

## 📱 Responsive Breakpoints

### 📏 **Media Queries:**
- **Desktop**: >768px - Layout completo
- **Tablet**: ≤768px - Colonne ridotte, nav compatta
- **Mobile**: ≤480px - Single column, touch optimized

### 🎯 **Ottimizzazioni Mobile:**
- Immagini responsive con `object-fit: cover`
- Font scaling appropriato
- Touch targets minimum 44px
- Lazy loading per performance

---

## ⚡ Performance Ottimizzazioni

### 🚀 **Tecniche Implementate:**
- **Preload Critical Resources**: CSS, JS, prime immagini
- **Lazy Loading**: Portfolio images
- **Hardware Acceleration**: Transform3d per animazioni
- **Compressed Assets**: Immagini ottimizzate
- **Minimal JavaScript**: Vanilla JS, no framework bloat

### 📊 **Metriche Attese:**
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

---

## 🌐 SEO & Meta Tags

### 📋 **Meta Implementati:**
```html
<meta name="description" content="@sken.blk - Artista del tatuaggio specializzato in dark tattoo, fluid tattoo e blackwork. Resident artist presso Il Circo Nero Tattoo Milano.">
<meta name="keywords" content="tattoo Milano, dark tattoo, fluid tattoo, blackwork, Il Circo Nero">

<!-- Open Graph -->
<meta property="og:title" content="@sken.blk - Dark & Fluid Tattoo Artist">
<meta property="og:image" content="./assets/images/og-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "@sken.blk",
    "jobTitle": "Tattoo Artist"
}
</script>
```

---

## 🔧 Deploy & Hosting

### 🌐 **Altervista Ready:**
- Tutti i path relativi configurati
- No server-side dependencies
- Static files ottimizzati
- .htaccess per performance (opzionale)

### 📦 **File Essenziali:**
- `index.html` - Entry point
- `assets/` - Tutti i file statici
- Immagini compresse e ottimizzate
- CSS/JS minificati per produzione

---

## 🎯 Brand Identity

### 🎨 **Palette Colori:**
- **Primary**: #000000 (Nero profondo)
- **Secondary**: #1a1a1a (Grigio scuro)
- **Accent**: #ffffff (Bianco puro)
- **Text**: rgba(255,255,255,0.9) (Bianco soft)

### 📝 **Typography:**
- **Display**: Playfair Display (Logo, titoli)
- **Body**: Inter (Testo principale)
- **Mono**: JetBrains Mono (Codici, dettagli)

### ✨ **Estetica:**
- **Dark Fluid**: Design che fluisce naturalmente
- **Minimalism**: Elementi essenziali, no clutter
- **Modern**: Tecniche contemporanee, clean
- **Professional**: Qualità da studio di alto livello

---

## 📞 Contatti Studio

### 🏢 **Il Circo Nero Tattoo Milano**
- **Artista**: @sken.blk
- **Telefono**: +39 327 212 7922
- **WhatsApp**: Link diretto dal sito
- **Specializzazione**: Dark • Fluid • Blackwork
- **Servizi**: Booking e Walk-ins disponibili

---

**Documentazione completa del progetto @sken.blk - Versione 1.0**  
*Ultimo aggiornamento: Ottobre 2025*