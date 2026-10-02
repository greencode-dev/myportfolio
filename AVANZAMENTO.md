# Stato del progetto — portafoglio one-page

Ultimo aggiornamento: 02/10/2026
Stato: **deploy completato, sito live** su https://greencode-dev.github.io/myportfolio/. Form contatti verificato end-to-end. Restano solo scelte di contenuto (vedi sotto).

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

## Allineamento sezione contatti (desktop)

Risolto il 02/10, in tre passaggi. Misure a 1440px.

**1. La colonna info è diventata una card.** Ha le stesse proprietà del form (`background: var(--bg-elev)`, `border: 1px solid var(--border)`, `border-radius: var(--radius)`, `padding: 26px`). Prima era testo nudo senza cassa: le due colonne non avevano nulla in comune. `.contact__list li:first-child { padding-top: 0; }` riporta "Email" e "Nome" sulla stessa riga: senza, il `padding: 13px 0` del primo `<li>` li separava di 15.2px.

**2. `align-items: stretch` è stato provato e va tenuto a `start`.** Con `stretch` le due card diventano alte entrambe 526.5px e i bordi bassi coincidono, ma il contenuto della card info è 235.7px: restano **238.8px di vuoto in fondo**, il 45% della card. Il vuoto non sparisce, si sposta dentro la card e il contenuto risulta ammassato in alto. Non rimettere `stretch` senza aver prima ridato alla colonna sinistra contenuto sufficiente (per esempio la sezione lingue, ancora da decidere).

**3. Le due card devono essere larghe uguali, e per farlo servono due `minmax(0, 1fr)`.** Con `0.9fr 1.1fr` erano 462.6px contro 565.4px: 103px di asimmetria, ed è quello che faceva leggere le due card come non allineate.

- `.contact__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }` → le colonne diventano **514px e 514px**.
- **Non usare `1fr 1fr`**: `1fr` è `minmax(auto, 1fr)` e il `min-content` del form (hCaptcha più i due input affiancati) blocca la seconda traccia a 530px, quindi le colonne vengono 498 e 530 — disuguali, che è il problema che si voleva eliminare.
- **Attenzione: il solo `minmax(0, 1fr)` sulla griglia esterna non basta.** Restringe la traccia ma non gli elementi, che hanno ancora `min-width: auto`, e a 1024px la pagina va in overflow (`scrollWidth` 1037) con `.form__row`, i due input, il textarea e hCaptcha che sbordano di 13px. Servono anche `.form__row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }` e `min-width: 0` su `.form__field input, .form__field textarea`.
- Il motivo di fondo: **l'intrinsic width di un `<input>` è 230px**. Se il campo è più stretto, il controllo non si restringe e sborda dal proprio riquadro — fino a **42.8px a 981px di viewport**. `min-width: 0` sugli input è la correzione.

Stato finale verificato: colonne 514/514 a 1440px, top di entrambe le card a 3818.2, `spill` degli input 0 e nessun overflow a 1920/1440/1280/1100/1024/1000/981/950/760/600/390px.

Non c'è una classe `.card` condivisa: ogni componente ripete le tre proprietà, `.contact__info` segue la stessa convenzione.

**Cosa NON è un problema** (misurato, non supposto): i bordi esterni di tutte le sezioni coincidono già, container e griglie vanno tutti da 184 a 1256px. Gli inset interni del testo differiscono di pochi pixel — progetti 23px, stack 25px, contatti 27px — quindi il testo non parte dalla stessa x fra le sezioni, ma è uno scarto di 4px.

**L'altezza delle due card resta diversa** (289.7px contro 526.5px): il form ha più campi, non si può accorciare senza toccarli. Con la stessa larghezza le due card si leggono come colonna laterale più pannello, cioè una scelta e non un errore.

**Limite noto, preesistente e non introdotto qui**: a **320px** di larghezza l'hero va in overflow orizzontale (`scrollWidth` 380px). Gli elementi coinvolti sono `.hero__content`, `.hero__title`, `.hero__actions` e i bottoni, tutti nell'hero: la sezione contatti non c'entra.

## Form contatti — Web3Forms + hCaptcha

Il form posta su `https://api.web3forms.com/submit`, protetto da **hCaptcha**. Configurazione lato account **verificata il 02/10**: hCaptcha è attivo come metodo di blocco spam e le email arrivano a destinazione.

Le due impostazioni lato account, entrambe confermate funzionanti con un invio reale dal sito live:

1. **Dashboard** → sul form, **hCaptcha** come metodo di blocco spam. Se non fosse attivo, il widget viene mostrato ma non viene verificato.
2. **Destinazione**: le email arrivano da `noreply@web3forms.com`, con il forwarder regolare verso `antonioverde.dev@gmail.com`.

Dettagli implementativi (scelte già prese, non riverificarle):

- `data-fallback-email` sul `<form>` è l'unica sorgente dell'indirizzo per il fallback `mailto:`. Email visibile in pagina e fallback devono coincidere.
- `isConfigured` in `main.js` valida la chiave con `/^[\w-]{20,}$/`: se un domani la svuoti, il form ricade sul `mailto:`.
- **I campi validati sono marcati con `data-validate`**, non selezionati per tipo. Motivo: hCaptcha inietta un `<textarea name="h-captcha-response">` nel DOM, e una selezione per `input, textarea` lo avrebbe trattato come campo obbligatorio da riempire — errore invisibile all'utente perché quel textarea è nascosto. Se aggiungi campi al form, aggiungi `data-validate`.
- `captchaSolved()` controlla `[name="h-captcha-response"]` con guardia `null` (il widget è renderizzato asincrono, prima non esiste). Al posto del `alert()` della doc ufficiale c'è un messaggio in `#form-status`, coerente col resto del form.
- **Controllo del captcha solo sul percorso Web3Forms**, non sul fallback `mailto:`: obbligare a risolvere un captcha per aprire il client email sarebbe solo fastidio.
- **`resetCaptcha()` dopo l'invio riuscito**: i token hCaptcha sono monouso, senza reset il secondo invio dalla stessa pagina fallisce. Usa `hcaptcha.getWidgetID()` con fallback a `0`, tutto in try/catch.
- **L'oggetto delle email è gestito dalla dashboard Web3Forms, non dal codice.** Il form non manda più nessun campo `subject`: il placeholder è `{field:nome}` / `{field:email}` / `{field:messaggio}`, da scrivere in Settings → Email Configuration → Subject. Non reintroduire un `name="subject"` hidden o un `payload.set("subject", ...)`: il campo del form vince sulla dashboard e i token diventano inerti.
- Honeypot `botcheck` con `.form__hp` (off-screen, non `display:none`, altrimenti i bot lo ignorano). Escluso dalla validazione client.
- `redirect=false` + `Accept: application/json`: Web3Forms risponde JSON e la pagina non naviga via. Nella dashboard il campo Redirect URL è stato svuotato: era il placeholder `https://yoursite.com/thank-you` e, se `redirect=false` venisse tolto, gli utenti finirebbero su una pagina inesistente.
- `web3forms.com/client/script.js` **non** intercetta il submit: letto il sorgente, si occupa solo di iniettare hCaptcha e FilePond. Quindi `initForm` resta l'unico a decidere come inviare.

**Limiti noti, accettati consapevolmente:**

- `data-theme="auto"` su hCaptcha segue la preferenza del sistema operativo, **non** il toggle chiaro/scuro del sito. Il widget ha quindi il tema "sbagliato" se l'utente ha scelto un tema diverso da quello del SO. Per correggerlo serve `hcaptcha.reset()` con re-render al cambio tema: non implementato, è un dettaglio cosmetico.
- La chiave è **pubblica per design**. Sta nell'HTML come in tutti gli esempi Web3Forms: non è un segreto, serve a identificare *destinatario*, non ad autorizzare. Chiunque può leggerla, nessuno può inviare senza passare il captcha. Se un domani serve un backend, la chiave si può spostare in una Cloudflare Worker o Netlify Function che fa da proxy — ma a quel punto è il captcha a proteggere, non la chiave.

## Contenuti reali — presi dal CV il 01/10

Fonte: `~/Downloads/cv-antonio-verde-ai-draft.json`. Tutti i testi del sito derivano da lì, niente più segnaposto.

| Sezione | Cosa dice il CV | Cosa ho messo |
|---|---|---|
| Città | Trento | Trento (era Torino, segnaposto) |
| Ruolo | Full-Stack Web Developer, React/Laravel/MySQL, Boolean 2026 | title, og, meta description, hero lead |
| Lavoro | Assistente Tecnico, Ministero della Giustizia, 2023 → oggi, LDAP/Active Directory | timeline + bio |
| Certificazione | Boolean Full-Stack, luglio 2026 | timeline |
| Progetti | Astralis (open source, 381 test) e IT Admin Dashboard (privato) | 2 card invece delle 3 inventate |
| Formazione | Diploma, I.T.A.S. Elena di Savoia, Napoli, 2000-2005 | timeline |
| Disponibilità | freelance, su commissione, part-time remoto | badge hero + lead contatti |

**Numeri hero**: 3 anni / 2 progetti / 381 test. Ho tolto "100% clienti soddisfatti" — non è verificabile e non hai client. Se preferisci un altro numero al 381, cambia l'attributo `data-count` (i contatori sono animati).

**Stack riscritto**: il sito dichiarava Node.js, PostgreSQL, TypeScript e DevOps/Docker, che **non sono nel CV**. Le card ora sono React & JavaScript, Laravel & PHP, MySQL, Livewire, Tailwind CSS, Git & tooling — solo cose che risultano dal CV.

**Griglia progetti**: passata a `repeat(auto-fit, minmax(320px, 1fr))`. Con `repeat(3, ...)` due card avrebbero lasciato una colonna vuota; `auto-fit` collassa la traccia vuota e si adatta a qualsiasi numero di progetti.

## Cose ancora da decidere

1. **Progetti in evidenza**: il profilo GitHub ha **53 repository pubblici**, il CV ne cita 2. Se qualcuno merita la terza card, dimmi quale. Altrimenti lascia due card: è più onesto e la sezione resta credibile.
2. **Screenshot progetti**: le `.project__media` sono ancora gradiente senza immagine. Se hai screenshot di Astralis e del dashboard, mettili in `assets/img/` e li linko.
3. **Foto**: il CV ha una tua foto (`rxresu.me/.../1787494195086.jpeg`). Non l'ho usata — nel portfolio attuale c'è la code card al suo posto. Dimmi se preferisci la foto.
4. **Lingue**: italiano madre, inglese e spagnolo livello 2. Non c'è una sezione lingue nel sito. Aggiungerla o no?
5. **Dominio**: se compri `antonioverde.dev`, aggiungi il file `CNAME` e cambia le 4 occorrenze di `greencode-dev.github.io/myportfolio` (canonical, og:url, sitemap.xml, robots.txt).

## Pulizia fatta

- **02/10** — `.link-ghost` rimosso da `style.css`: non era più usato da nessuna parte, dopo aver tolto i link "GitHub" duplicati dalle card progetto.

## Decisioni aperte

- **Deploy**: fatto. GitHub Pages su repo `myportfolio` è attivo e il sito risponde, vedi sotto.
- **Privacy**: l'email è pubblicata in chiaro. Se preferisci ometterla, togli il `<li>` in contatti e lascia solo il form.
- **Redirect email**: con Web3Forms le email arrivano da `noreply@web3forms.com`; valuta un indirizzo alias tipo `antonio@antonioverde.dev` inoltrato a Gmail, così non pubblichi l'address personale.

## Deploy — GitHub Pages (completato)

Repo: **`greencode-dev/myportfolio`** → URL `https://greencode-dev.github.io/myportfolio/`.

Nota: il nome è `myportfolio`, non `myportafolio` come inizialmente pattuito. Se in futuro vuoi cambiarlo, il repo GitHub si rinomina e poi vanno cambiate le 4 occorrenze di `greencode-dev.github.io/myportfolio` (canonical, og:url, sitemap.xml, robots.txt).

Configurazione in place: remote impostato, push fatto, `.nojekyll` presente, Pages su branch `main` cartella `/ (root)`. I link interni sono tutti relativi, quindi funzionano anche sotto il subpath `/myportfolio/`.

Nota: essendo un *project* site (non `greencode-dev.github.io`), l'URL ha il subpath `/myportfolio/`. Non dà problemi, ma se in futuro vuoi un URL pulito puoi spostare i file in un repo `greencode-dev.github.io` e cambiare le 4 occorrenze del dominio.

Ogni push su `main` ripubblica il sito: verificato che il live e il locale sono identici riga per riga. Per i prossimi push:

```powershell
git push
```

L'autenticazione la fa Git Credential Manager (`credential.helper=manager` è già configurato).

## Verifica fatta

**02/10/2026** — Il live risponde 200 su `index.html`, `sitemap.xml`, `robots.txt`, `.nojekyll`, `assets/css/style.css`, `assets/js/main.js`. Contenuto del live identico al locale (diff riga per riga vuoto). Rimosso il CSS morto `.link-ghost`. **Form contatti testato con un invio reale dal sito live: hCaptcha verificato e email ricevuta**, quindi le impostazioni Web3Forms (metodo anti-spam e destinazione/forwarder) sono da considerare chiuse. Allineamento desktop della sezione contatti corretto e verificato con Chrome headless via CDP: colonne 514/514 a 1440px, card allineate in alto, `spill` degli input 0 e nessun overflow a 1920/1440/1280/1100/1024/1000/981/950/760/600/390px. Nota: `align-items: stretch` provato e scartato, e `1fr` da solo non rende le colonne uguali — vedi la sezione dedicata. A 320px resta un overflow preesistente dell'hero.

**01/10/2026** — Tutti i file rispondono HTTP 200 via `php -S` su `127.0.0.1:8123`, `.nojekyll` incluso. Sintassi JS validata con `node --check`. Tag bilanciati, nessun `id` duplicato, nessun `id` mancante dei 16 attesi. `index.html` è UTF-8 senza BOM. hCaptcha verificato contro la doc ufficiale e contro il sorgente di `web3forms.com/client/script.js` scaricato in locale.

## Come riprendere

```powershell
php -S 127.0.0.1:8123
# poi apri http://127.0.0.1:8123
```

oppure doppio clic su `index.html`.
