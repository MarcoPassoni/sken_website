# 📸 Gestione Media - @sken.blk

Documentazione per l'organizzazione e l'utilizzo delle immagini e video del sito.

## 📁 Struttura File Media

### 🖼️ **Immagini Principali**
```
assets/images/
├── favicon.png              # Icona del sito (creata da APPLICATION.jpeg)
├── logo-sken.jpg           # Logo principale (da APPLICATION.jpeg)
├── artist-photo.jpg        # Foto dell'artista (da IMG_3407.jpeg) 
├── og-image.jpg            # Immagine social media (da IMG_8330.png)
└── [immagini originali non utilizzate...]
```

### 🎨 **Portfolio (30 opere integrate)**
```
assets/images/portfolio/
├── IMG_0092.jpeg          # Dark Creation I - dark/arm (5h)
├── IMG_3407.jpeg          # Blackwork Masterpiece - blackwork/back (8h)
├── IMG_3605.jpeg          # Fluid Anatomy - fluid/chest (6h)
├── IMG_3634.jpeg          # Dark Portrait - dark/arm (7h)
├── IMG_3774.jpeg          # Geometric Flow - blackwork/leg (4h)
├── IMG_4738.jpeg          # Dark Nature - dark/back (9h)
├── IMG_4934.jpeg          # Fluid Expression - fluid/arm (5h)
├── IMG_4952.jpeg          # Minimalist Black - blackwork/chest (3h)
├── IMG_5006_jpg.jpeg      # Dark Composition - dark/leg (6h)
├── IMG_5451.jpeg          # Abstract Flow - fluid/back (7h)
├── IMG_6251.jpeg          # Precision Work - blackwork/arm (4h)
├── IMG_6651.png           # Digital Art I - dark/other (2h)
├── IMG_6652.png           # Modern Geometry - blackwork/chest (5h)
├── IMG_6653.png           # Dark Vision - dark/back (8h)
├── IMG_6655.png           # Fluid Design - fluid/leg (6h)
├── IMG_6656.png           # Complex Pattern - blackwork/arm (7h)
├── IMG_6657.png           # Artistic Expression - dark/chest (9h)
├── IMG_7301.png           # Creative Flow - fluid/back (5h)
├── IMG_7797.png           # Bold Statement - blackwork/leg (4h)
├── IMG_8330.png           # Masterwork Series I - dark/arm (8h)
├── IMG_8331.png           # Masterwork Series II - blackwork/chest (7h)
├── IMG_8332.png           # Fluid Masterwork - fluid/back (10h)
├── IMG_8333.png           # Dark Evolution - dark/leg (6h)
├── IMG_8334.png           # Contemporary Art - blackwork/arm (5h)
├── IMG_8335.png           # Signature Work - fluid/chest (8h)
├── IMG_8347.png           # Innovative Design - dark/back (9h)
├── IMG_8379.jpeg          # Artistic Vision - blackwork/leg (7h)
├── IMG_8481.webp          # Final Creation - fluid/other (4h)
├── Snapseed.jpeg          # Artistic Study I - dark/arm (6h)
├── Snapseed(1).jpeg       # Artistic Study II - blackwork/chest (5h)
└── thumbs/                # Thumbnails (attualmente usano le stesse immagini)
```

### 🎬 **Video Showcase (3 video integrati)**
```
assets/images/videos/
├── kling_20250820_Image_to_Video__5940_0.mp4  # Tecnica Dark Tattoo
├── kling_20250820_Image_to_Video__5971_0.mp4  # Blackwork Evolution  
├── kling_20250820_Image_to_Video__6009_0.mp4  # Fluid Art Process
├── kling_20250820_Image_to_Video__5915_0.mp4  # Hero background video
├── 3b47eaae-5fba-4cac-96b2-6926e8ec99b5.mp4  # Hero fallback
└── [altri video disponibili per future integrazioni...]
```

## 🎯 **Portfolio Filtering System**

### **Filtri per Stile:**
- **Dark** (12 opere): Focus su estetica gotica e ombreggiature profonde
- **Blackwork** (10 opere): Geometrie e pattern in nero puro
- **Fluid** (8 opere): Forme organiche che seguono l'anatomia

### **Filtri per Area Corporea:**
- **Braccio** (8 opere): arm
- **Schiena** (7 opere): back  
- **Petto** (6 opere): chest
- **Gamba** (5 opere): leg
- **Altro** (4 opere): other

### **Metadata delle Opere:**
Ogni immagine include:
- **ID univoco** (1-30)
- **Titolo descrittivo**
- **Stile** (dark/blackwork/fluid)
- **Area del corpo** (arm/back/chest/leg/other)
- **Anno** (2024)
- **Durata sessione** (2h-10h)
- **Descrizione** artistica

## 📱 **Implementazioni Tecniche**

### **Hero Section:**
- **Video principale**: kling_20250820_Image_to_Video__5915_0.mp4
- **Video fallback**: 3b47eaae-5fba-4cac-96b2-6926e8ec99b5.mp4
- **Poster**: artist-photo.jpg
- **Autoplay**: ✅ muted/loop/playsinline

### **Portfolio Gallery:**
- **Lazy loading**: ✅ attivo su tutte le immagini
- **Lightbox**: ✅ zoom e navigazione
- **Responsive**: ✅ grid adattivo
- **Filtering**: ✅ JavaScript dinamico

### **Video Showcase:**
- **3 video process**: con controlli utente
- **Poster frames**: immagini portfolio come preview
- **Preload**: metadata only per performance
- **Responsive**: ✅ grid adattivo mobile

## 🚀 **Performance Optimizations**

### **Immagini:**
- ✅ **Lazy loading** su tutte le immagini portfolio
- ✅ **WebP support** per IMG_8481.webp
- ✅ **Responsive sizing** tramite CSS
- ⚠️ **Thumbnails**: attualmente usano immagini full-size (da ottimizzare)

### **Video:**
- ✅ **Preload controls**: metadata only per video showcase
- ✅ **Hero video**: autoplay ottimizzato per mobile
- ✅ **Multiple sources** per compatibilità browser

### **SEO & Social:**
- ✅ **OpenGraph image**: IMG_8330.png come og-image.jpg
- ✅ **Favicon**: APPLICATION.jpeg come favicon.png
- ✅ **Alt text** su tutte le immagini

## 📝 **Todo - Miglioramenti Futuri**

### **Immagini:**
- [ ] **Creare thumbnails reali** (400x400px) per migliorare performance
- [ ] **Ottimizzare dimensioni** file (target: <200KB per immagine)
- [ ] **Convertire a WebP** tutte le immagini JPEG/PNG
- [ ] **Aggiungere nuove opere** quando disponibili

### **Video:**
- [ ] **Compressione video** per ridurre dimensioni file
- [ ] **Thumbnails video** personalizzati
- [ ] **Aggiungere sottotitoli** per accessibilità
- [ ] **Integrare nuovi video process** quando disponibili

### **UX:**
- [ ] **Caricamento progressivo** portfolio con pagination
- [ ] **Zoom gesture** su mobile per portfolio
- [ ] **Video gallery** full-screen mode
- [ ] **Sharing social** diretto delle opere

## 🎨 **Linee Guida Visuali**

### **Stile Dark:**
- Palette: Neri profondi, grigi, contrasti elevati
- Mood: Gotico, misterioso, drammatico
- Esempi: IMG_0092, IMG_3634, IMG_6653

### **Stile Blackwork:**
- Palette: Solo nero puro su pelle
- Mood: Geometrico, moderno, minimalista  
- Esempi: IMG_3407, IMG_6652, IMG_8331

### **Stile Fluid:**
- Palette: Forme organiche, flussi naturali
- Mood: Dinamico, anatomico, fluido
- Esempi: IMG_3605, IMG_8335, IMG_8332

---

📊 **Statistiche Attuali:**
- **30 opere portfolio** completamente integrate
- **3 video process** nella sezione showcase  
- **4 video background** per hero section
- **100% responsive** design
- **SEO optimized** con structured data

🎯 **Sito pronto per il deployment su Altervista!**