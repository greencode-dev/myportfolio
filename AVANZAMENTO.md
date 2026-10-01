# Stato del progetto — portafoglio one-page

Ultimo aggiornamento: 01/10/2026
Stato: **funzionante e verificato**, dati personali e access key Web3Forms inseriti. Manca solo il push su GitHub.

## Cosa c'è

Sito statico, nessuna dipendenza, nessun build. Si apre con doppio clic su `index.html`.

```
index.html              struttura e contenuti
favicon.svg             icona (monogramma </>)
robots.txt              indicizzazione
sitemap.xml             mappa del sito (URL GitHub Pages)
.nojekyll               GitHub Pages: serve la root del repo senza elaborazione Jekyll
assets/css/style.css    tema chiaro/scuro + layout responsive
assets/js/main.js       9 funzioni di interazione, ~340 righe
```

## Scelte già prese (non riverificarle)

- **Stack**: HTML/CSS/JS puro. Motivo: zero build, deploy drag-and-drop su Netlify/Vercel o GitHub Pages, nessuna dipendenza da mantenere. Migrazione futura ad Astro se serve un blog.
- **Tema**: scuro con toggle chiaro/scuro, salvato in `localStorage`, default dalla preferenza di sistema.
- **Accento**: `--accent: #7c8cff` e `--accent-2: #c084fc` in `:root`, overridi in `[data-theme="light"]`. Cambiare qui per un colore brand diverso.
- **Font**: Inter + JetBrains Mono via Google Fonts.
- **Animazioni**: solo CSS, disattivate con `prefers-reduced-motion`.

## Funzionalità implementate

| Funzione | Dove |
|---|---|
| Toggle tema + persistenza | `main.js` → `initTheme` |
| Nav mobile, chiusura con Esc | `initNav` |
| Header con bordo + bottone "torna su" allo scroll | `initHeader` |
| Scrollspy sulla nav | `initScrollSpy` |
| Fade-in allo scroll, stagger | `initReveal` |
| Contatori animati hero | `initCounters` |
| Copia email negli appunti | `initCopyEmail` |
| Form con validazione → Web3Forms | `initForm` |

## Form contatti — Web3Forms + hCaptcha

Il form posta su `https://api.web3forms.com/submit`, protetto da **hCaptcha**. Restano due configurazioni lato account:

1. **Dashboard** → sul form, imposta **hCaptcha** come metodo di blocco spam (l'hai già fatto). Se non è attivo, il widget viene mostrato ma non viene verificato.
2. **Destinazione**: le email arrivano da `noreply@web3forms.com`. Metti in regola il forwarder su `antonioverde.dev@gmail.com` o cambia destinatario nelle impostazioni. Finché non lo fai, le email si perdono.

Dettagli implementativi (scelte già prese, non riverificarle):

- `data-fallback-email` sul `<form>` è l'unica sorgente dell'indirizzo per il fallback `mailto:`. Email visibile in pagina e fallback devono coincidere.
- `isConfigured` in `main.js` valida la chiave con `/^[\w-]{20,}$/`: se un domani la svuoti, il form ricade sul `mailto:`.
- **I campi validati sono marcati con `data-validate`**, non selezionati per tipo. Motivo: hCaptcha inietta un `<textarea name="h-captcha-response">` nel DOM, e una selezione per `input, textarea` lo avrebbe trattato come campo obbligatorio da riempire — errore invisibile all'utente perché quel textarea è nascosto. Se aggiungi campi al form, aggiungi `data-validate`.
- `captchaSolved()` controlla `[name="h-captcha-response"]` con guardia `null` (il widget è renderizzato asincrono, prima non esiste). Al posto del `alert()` della doc ufficiale c'è un messaggio in `#form-status`, coerente col resto del form.
- **Controllo del captcha solo sul percorso Web3Forms**, non sul fallback `mailto:`: obbligare a risolvere un captcha per aprire il client email sarebbe solo fastidio.
- **`resetCaptcha()` dopo l'invio riuscito**: i token hCaptcha sono monouso, senza reset il secondo invio dalla stessa pagina fallisce. Usa `hcaptcha.getWidgetID()` con fallback a `0`, tutto in try/catch.
- Honeypot `botcheck` con `.form__hp` (off-screen, non `display:none`, altrimenti i bot lo ignorano). Escluso dalla validazione client.
- `redirect=false` + `Accept: application/json`: Web3Forms risponde JSON e la pagina non naviga via.
- `web3forms.com/client/script.js` **non** intercetta il submit: letto il sorgente, si occupa solo di iniettare hCaptcha e FilePond. Quindi `initForm` resta l'unico a decidere come inviare.

**Limiti noti, accettati consapevolmente:**

- `data-theme="auto"` su hCaptcha segue la preferenza del sistema operativo, **non** il toggle chiaro/scuro del sito. Il widget ha quindi il tema "sbagliato" se l'utente ha scelto un tema diverso da quello del SO. Per correggerlo serve `hcaptcha.reset()` con re-render al cambio tema: non implementato, è un dettaglio cosmetico.
- La chiave è **pubblica per design**. Sta nell'HTML come in tutti gli esempi Web3Forms: non è un segreto, serve a identificare *destinatario*, non ad autorizzare. Chiunque può leggerla, nessuno può inviare senza passare il captcha. Se un domani serve un backend, la chiave si può spostare in una Cloudflare Worker o Netlify Function che fa da proxy — ma a quel punto è il captcha a proteggere, non la chiave.

## Dati personali — inseriti il 01/10

Nome **Antonio Verde**, email `antonioverde.dev@gmail.com`, GitHub `greencode-dev`, LinkedIn `antonioverdedev`.

Propagati in: title (6), author (8), canonical + og:url (11-13), og:title (14), logo (31), h1 (74), code card (118), email in pagina e fallback (309-310, 329), social (315, 319), footer (361, 364-366). `robots.txt` e `sitemap.xml` puntano a `https://greencode-dev.github.io/myportafolio/`.

## Da personalizzare — affare tuo

Restano i pezzi **più personali**, che ho lasciato generici perché non li conosco. Tutte le righe sono di `index.html`.

1. **Città** — riga 323: "Torino, Italia". Metti la tua, o togli tutta la riga se preferisci.
2. **Numeri hero** — righe 79, 96, 100, 104: "6 anni", "40+ progetti", "100% clienti". Metti i tuoi, l'attributo `data-count` anima il contatore.
3. **Biografia** — righe 255 e 260. Sono inventati (gestionale locale, team piccoli). Riscrivili con la tua storia: è la sezione che i visitatori leggono di più.
4. **Timeline** — righe 275, 280, 285, 289: datori di lavoro generici e "Laurea in Informatica". Metti nomi e ruoli reali, o rimuovi le voci che non ti riguardano.
5. **Progetti** — righe 184, 205, 226: nomi, descrizioni e chip sono di esempio, e la `.project__media` è un gradiente senza immagine. Sostituisci con `<img src="assets/img/nome.png" alt="…">` dentro `.project__media` e crea `assets/img/`. I link "Caso studio" e "GitHub" puntano a `#contatti`.
6. **Dominio** — se compri `antonioverde.dev`, aggiungi il file `CNAME` con il dominio e cambia le 4 occorrenze di `greencode-dev.github.io/myportafolio` (canonical, og:url, sitemap.xml, robots.txt).

## Decisioni aperte

- **Deploy**: scelto **GitHub Pages** su repo `myportafolio`. Manca solo la parte git, vedi sotto.
- **Privacy**: l'email è pubblicata in chiaro. Se preferisci ometterla, togli il `<li>` in contatti e lascia solo il form.
- **Redirect email**: con Web3Forms le email arrivano da `noreply@web3forms.com`; valuta un indirizzo alias tipo `antonio@antonioverde.dev` inoltrato a Gmail, così non pubblichi l'address personale.

## Deploy — GitHub Pages

Repo deciso: **`greencode-dev/myportafolio`** → URL `https://greencode-dev.github.io/myportafolio/`.

`.nojekyll` è già in place, la struttura è pronta, e i link interni sono tutti relativi quindi funzionano anche sotto il subpath `/myportafolio/`. Manca solo il lato git (non esiste ancora un remote, e `gh` non è installato):

```powershell
git remote add origin https://github.com/greencode-dev/myportafolio.git
git push -u origin main
```

Crea prima il repo vuoto su GitHub, altrimenti il push viene rifiutato. Poi nella UI: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, cartella `/ (root)`.

Nota: essendo un *project* site (non `greencode-dev.github.io`), l'URL ha il subpath `/myportafolio/`. Non dà problemi, ma se in futuro vuoi un URL pulito puoi spostare i file in un repo `greencode-dev.github.io` e cambiare le 4 occorrenze del dominio.

## Verifica fatta (01/10/2026)

Tutti i file rispondono HTTP 200 via `php -S` su `127.0.0.1:8123`, `.nojekyll` incluso. Sintassi JS validata con `node --check`. Tag bilanciati, nessun `id` duplicato, nessun `id` mancante dei 16 attesi. `index.html` è UTF-8 senza BOM. hCaptcha verificato contro la doc ufficiale e contro il sorgente di `web3forms.com/client/script.js` scaricato in locale.

## Come riprendere

```powershell
php -S 127.0.0.1:8123
# poi apri http://127.0.0.1:8123
```

oppure doppio clic su `index.html`.
