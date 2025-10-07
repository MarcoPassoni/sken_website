# 🎨 @sken.blk - Sito per Altervista

Sito vetrina professionale per l'artista del tatuaggio **@sken.blk**, ottimizzato per **Altervista hosting**.

## 📁 File da caricare su Altervista

Carica tutti i file e cartelle dalla cartella `altervista-ready` direttamente nella root del tuo spazio Altervista:

```
📁 La tua root Altervista/
├── index.html              # Homepage principale
├── privacy.html            # Privacy Policy
├── cookie.html             # Cookie Policy  
├── terms.html              # Termini e Condizioni
└── assets/
    ├── css/
    │   └── main.css        # Tutti gli stili CSS
    ├── js/
    │   └── main.js         # Funzionalità JavaScript
    └── images/
        └── [immagini]      # Le tue foto portfolio
```

## 🚀 Come caricare su Altervista

### 1. **Accesso FTP/File Manager**
- Accedi al pannello Altervista
- Vai su "File Manager" o usa un client FTP
- Naviga nella cartella principale del tuo sito

### 2. **Caricamento file**
- Carica `index.html` nella root
- Carica tutte le altre pagine HTML nella root  
- Carica la cartella `assets/` completa con sottocartelle

### 3. **Aggiunta immagini**
Sostituisci le immagini placeholder in `assets/images/` con:

**Obbligatorie:**
- `favicon.svg` - Icona del sito (32x32px)
- `favicon.png` - Icona fallback (32x32px) 
- `logo-sken.svg` - Logo @sken.blk
- `artist-photo.jpg` - Foto dell'artista (800x800px)

**Portfolio (esempi già nel JS):**
- `dark-serpent.jpg` + `dark-serpent-thumb.jpg`
- `fluid-waves.jpg` + `fluid-waves-thumb.jpg`  
- `blackwork-mandala.jpg` + `blackwork-mandala-thumb.jpg`
- `dark-forest.jpg` + `dark-forest-thumb.jpg`
- `fluid-anatomy.jpg` + `fluid-anatomy-thumb.jpg`
- `geometric-void.jpg` + `geometric-void-thumb.jpg`

**Struttura immagini:**
```
assets/images/
├── favicon.svg
├── favicon.png
├── logo-sken.svg
├── circo-nero-logo.svg
├── artist-photo.jpg
├── og-image.jpg (1200x630px per social)
└── portfolio/
    ├── [nome-opera].jpg     # Full size (max 1920px)
    └── thumbs/
        └── [nome-opera]-thumb.jpg  # Thumbnail (400x400px)
```

## ⚙️ Personalizzazione contenuti

### 📝 **Testi da modificare**

Nel file `index.html` cerca e sostituisci:

**Informazioni contatto:**
```html
<!-- Linea ~315 circa -->
<span class="contact__value">Via Example, 123<br>20100 Milano (MI)</span>
<a href="tel:+39123456789">+39 123 456 789</a>
<a href="mailto:info@skenblk.com">info@skenblk.com</a>
```

**Bio artista:**
```html
<!-- Sezione About, linea ~245 circa -->
<p>Sono @sken.blk, artista del tatuaggio...</p>
```

### 🎨 **Portfolio dinamico**

Nel file `assets/js/main.js` (linea ~85 circa) modifica:

```javascript
const portfolioData = [
    {
        id: 1,
        title: 'Nome del tuo lavoro',
        style: 'dark', // dark, fluid, o blackwork
        area: 'arm',   // arm, back, chest, leg, other
        year: '2024',
        duration: '4h',
        image: './assets/images/portfolio/nome-file.jpg',
        thumbnail: './assets/images/portfolio/thumbs/nome-file-thumb.jpg',
        description: 'Descrizione del lavoro...'
    },
    // Aggiungi i tuoi lavori...
];
```

## 📧 Form di contatto

I form attualmente mostrano un messaggio di successo simulato. Per implementazione reale su Altervista:

### **Opzione 1: EmailJS (Consigliato)**
1. Registrati su [emailjs.com](https://www.emailjs.com/)
2. Configura il servizio email
3. Nel file `main.js` (linea ~600 circa) sostituisci:

```javascript
// Sostituisci la funzione submitForm con:
async submitForm(endpoint, formData) {
    return emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form);
}
```

### **Opzione 2: Script PHP Altervista**
Crea un file `contact.php` e modifica l'action del form.

## 🎯 **Checklist pre-pubblicazione**

- [ ] **File caricati** tutti nella posizione corretta
- [ ] **Immagini sostituite** con contenuti reali
- [ ] **Contatti aggiornati** (telefono, email, indirizzo)
- [ ] **Bio personalizzata** con i tuoi testi
- [ ] **Portfolio popolato** con le tue opere
- [ ] **Form testato** per invio email
- [ ] **Test su mobile** e desktop

## 🛠️ **Funzionalità incluse**

✅ **Design responsivo** - Perfetto su mobile e desktop  
✅ **Dark/Light mode** - Toggle tema scuro/chiaro  
✅ **Portfolio filtrabile** - Per stile e area del corpo  
✅ **Lightbox gallery** - Visualizzazione opere a schermo intero  
✅ **Form intelligenti** - Validazione e protezione spam  
✅ **SEO ottimizzato** - Meta tag e structured data  
✅ **Accessibilità** - Navigazione da tastiera, screen reader  
✅ **Performance** - Caricamento veloce, lazy loading immagini  

## 🌐 **Esempio URL finale**

Se il tuo sito Altervista è `tuonome.altervista.org`, il risultato sarà:
- Homepage: `https://tuonome.altervista.org`
- Portfolio: `https://tuonome.altervista.org#portfolio`
- Booking: `https://tuonome.altervista.org#booking`

## 💡 **Suggerimenti Altervista**

1. **Limiti spazio**: Ottimizza le immagini (max 200KB per foto)
2. **Backup**: Tieni sempre una copia locale dei file  
3. **Updates**: Per aggiornare modifica i file e ricarica via FTP
4. **Dominio**: Considera l'acquisto di un dominio personalizzato

## 🆘 **Risoluzione problemi**

**Immagini non si vedono?**
- Verifica che i percorsi siano corretti
- Controlla che i file siano nella cartella `assets/images/`

**JavaScript non funziona?**  
- Verifica che `main.js` sia nella cartella `assets/js/`
- Controlla la console del browser per errori

**CSS non applicato?**
- Verifica che `main.css` sia in `assets/css/`
- Controlla che non ci siano errori di sintassi

---

🎨 **Buona fortuna con il tuo sito @sken.blk!**

Per supporto tecnico: [documentazione completa nel README principale]