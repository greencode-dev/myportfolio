# Stato del progetto — portafoglio one-page

Ultimo aggiornamento: 30/09/2026
Stato: **funzionante e verificato**, in attesa di contenuti reali.

## Cosa c'è

Sito statico, nessuna dipendenza, nessun build. Si apre con doppio clic su `index.html`.

```
index.html              struttura e contenuti
favicon.svg             icona (monogramma </>)
robots.txt              indicizzazione
sitemap.xml             mappa del sito (dominio placeholder)
assets/css/style.css    tema chiaro/scuro + layout responsive
assets/js/main.js       9 funzioni di interazione, ~230 righe
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
| Form con validazione → `mailto:` | `initForm` |

## Da personalizzare — affare tuo

I segnaposto sono "Marco Rossi" / `marcorossi.dev` / `@marcorossi`. Elenco completo con i numeri di riga:

1. **Nome e ruolo** — `index.html`:6 (title), 8 (author), 12 (og:title), 29 (logo), 71 (h1), 352 (footer)
2. **Email** — `index.html`:307 `data-email` **e** `main.js`:254 `mailto:`. Entrambi, altrimenti il form scrive a un indirizzo sbagliato
3. **Link social** — `index.html`:313 e 317 (GitHub, LinkedIn), più footer riga 356
4. **Screenshot progetti** — `index.html`:182, 203, 224. Sostituire il gradiente in `.project__media` con `<img src="assets/img/nome.png" alt="…">`; crea la cartella `assets/img/`
5. **Testi** — le tre `section__lead` (righe 134, 177, 299) sono generiche, e la timeline ha ruoli non identificati ("Studio digitale", "Agenzia", "Startup")
6. **Dominio** — `robots.txt` e `sitemap.xml` usano `example.com`

## Decisioni aperte

- **Form contatti**: ora apre il client email dell'utente (`mailto:`). Non è affidabile: se non ha client configurato, il messaggio si perde. Da decidere se passare a Formspree / Web3Forms / endpoint PHP. Io implementerei Web3Forms, resta gratuito e senza backend.
- **Deploy**: nessun repository git inizializzato. Al momento i file sono "a terra" ma senza storico. Va deciso dove pubblicarli.
- **Privacy**: se pubblichi l'email in chiaro, valuta di ometterla e usare solo il form.

## Verifica fatta

Tutti i file rispondono HTTP 200 via `php -S`. Sintassi JS validata con `node --check`. Tag HTML e graffe CSS bilanciati. `index.html` è UTF-8 senza BOM, coerente con `<meta charset="UTF-8">` (necessario per i caratteri accented e l'emoji di default in `index.html`:5).

## Come riprendere

```powershell
php -S 127.0.0.1:8123
# poi apri http://127.0.0.1:8123
```

oppure doppio clic su `index.html`.
