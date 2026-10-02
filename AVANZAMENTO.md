# Stato del progetto — portafoglio one-page

Ultimo aggiornamento: 02/10/2026
Stato: **deploy completato, sito live** su https://greencode-dev.github.io/myportfolio/. Restano solo scelte di contenuto (vedi sotto) e due impostazioni lato account Web3Forms.

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

**02/10/2026** — Il live risponde 200 su `index.html`, `sitemap.xml`, `robots.txt`, `.nojekyll`, `assets/css/style.css`, `assets/js/main.js`. Contenuto del live identico al locale (diff riga per riga vuoto). Rimosso il CSS morto `.link-ghost`.

**01/10/2026** — Tutti i file rispondono HTTP 200 via `php -S` su `127.0.0.1:8123`, `.nojekyll` incluso. Sintassi JS validata con `node --check`. Tag bilanciati, nessun `id` duplicato, nessun `id` mancante dei 16 attesi. `index.html` è UTF-8 senza BOM. hCaptcha verificato contro la doc ufficiale e contro il sorgente di `web3forms.com/client/script.js` scaricato in locale.

## Come riprendere

```powershell
php -S 127.0.0.1:8123
# poi apri http://127.0.0.1:8123
```

oppure doppio clic su `index.html`.
