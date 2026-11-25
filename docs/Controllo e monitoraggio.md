# Controllo e monitoraggio

Strumenti per seguire l'avanzamento della Build Week. Chi fa cosa e lo stato di ogni voce stanno nel *Backlog* di [Project management](Project%20management.md); qui c'è il piano nel tempo.

## Gantt

Chi fa cosa e in quale giorno; tra parentesi lo step del backlog. Si aggiorna dopo lo stand-up quando un lavoro slitta.

```mermaid
gantt
  title Build Week 2 — Team 3
  dateFormat YYYY-MM-DD
  axisFormat %a %d

  section Tutti insieme
  Prova API con Postman (step 0)   :2026-11-23, 1d
  fetchJSON e modelli (step 2)     :2026-11-24, 1d
  Prova di main (step 6)           :2026-11-25, 1d
  Revisione e prova esposizione (step 8) :2026-11-27, 1d

  section Luca
  Riordino app.css (step 1)        :2026-11-24, 1d
  Markup riga brano (step 1, con Francesca) :2026-11-24, 1d
  Helper preferiti e cronologia (step 3) :2026-11-24, 1d
  Precedente e successivo (extra, step 3) :2026-11-24, 1d
  Dettaglio album (step 4)         :2026-11-25, 1d
  Preferiti nella sidebar (step 5) :2026-11-25, 1d
  README finito (step 7)           :2026-11-26, 1d

  section Gabriel
  Fondamenta (step 1)              :2026-11-24, 1d
  CSS comune (step 3)              :2026-11-24, 1d
  Merge e rifinitura responsive (step 4) :2026-11-25, 1d
  Prettier su tutti i file (step 6) :2026-11-25, 1d

  section Giovanbattista
  Markup card (step 1, con Alessandro) :2026-11-24, 1d
  CSS Home e Cerca (step 3)        :2026-11-24, 1d
  Home, preferiti, recenti (step 4) :2026-11-25, 1d

  section Francesca
  Markup riga brano (step 1, con Luca) :2026-11-24, 1d
  CSS Album e Artista (step 3)     :2026-11-24, 1d
  Dettaglio artista (step 4)       :2026-11-25, 1d

  section Alessandro
  Markup card (step 1, con Giovanbattista) :2026-11-24, 1d
  Player (step 3)                  :2026-11-24, 1d
  Cerca e ultima ricerca (step 4)  :2026-11-25, 1d
  Brano in corso al cambio pagina (step 5) :2026-11-25, 1d
  Cuore nelle altre viste (extra, step 5) :2026-11-25, 1d
  Preferito che suona al click (extra, step 5) :2026-11-25, 1d
  Shuffle e ripeti (extra, step 7) :2026-11-26, 1d
  Volume a trascinamento (extra, step 7) :2026-11-26, 1d
  Login e playlist (extra, step 7) :2026-11-26, 1d

  section Scadenze
  Minimo completo                  :milestone, 2026-11-26, 0d
  Esposizione finale               :milestone, 2026-11-27, 0d
```

## KPI

Pochi indicatori, tutti misurabili in pochi minuti dopo lo stand-up. Li rileva il TL (venerdì chi coordina la giornata) e li segna nei grafici di *Andamento dei KPI*.

| # | KPI | Come si misura | Obiettivo |
| --- | --- | --- | --- |
| K1 | Avanzamento del minimo | Step da 1 a 6 chiusi nel backlog (tutte le loro voci a «Fatto»), su 6 | Martedì sera 3 (step 1–3); mercoledì sera 6 |
| K2 | Rispetto del Gantt | Voci chiuse nel giorno previsto, su quelle previste quel giorno | 100%; sotto l'80% si ripianifica allo stand-up |
| K3 | Integrazione su `main` | Pull request unite da Gabriel nel giorno, e persone con almeno una PR unita | Almeno una PR per chi ha scritto codice, ogni giorno |
| K4 | Errori in console | Errori nella console del browser aprendo le 4 pagine da `main` | 0 |
| K5 | Pagine responsive | Pagine provate senza difetti a mobile, `md` e `lg` | 4 su 4 da mercoledì sera |
| K6 | Vincoli sul codice | Occorrenze di `onclick`, `getElementById` e `var` nei file: `grep -rnE "onclick=\|getElementById\(\|\bvar " assets/js *.html` | 0 |

## Andamento dei KPI

Un grafico per KPI: le **barre** sono il valore reale, la **linea** l'obiettivo. Dopo lo stand-up si scrive il valore del giorno nell'array `bar`, nella posizione del giorno (martedì è il primo). I valori stanno solo qui.

### K1 — Avanzamento del minimo

```mermaid
xychart-beta
  title "Step del minimo chiusi, su 6"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Step" 0 --> 6
  line [3, 6, 6, 6]
  bar [0, 0, 0, 0]
```

### K2 — Rispetto del Gantt

```mermaid
xychart-beta
  title "Voci chiuse nel giorno previsto"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "%" 0 --> 100
  line [100, 100, 100, 100]
  bar [0, 0, 0, 0]
```

### K3 — Integrazione su main

```mermaid
xychart-beta
  title "Persone con almeno una PR unita"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Persone" 0 --> 5
  line [5, 5, 5, 4]
  bar [0, 0, 0, 0]
```

Venerdì l'obiettivo è 4 e non 5: Luca è assente.

### K4 — Errori in console

```mermaid
xychart-beta
  title "Errori in console sulle 4 pagine"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Errori" 0 --> 10
  bar [0, 0, 0, 0]
```

Obiettivo: 0, nessuna barra.

### K5 — Pagine responsive

```mermaid
xychart-beta
  title "Pagine senza difetti a mobile, md e lg"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Pagine" 0 --> 4
  line [0, 4, 4, 4]
  bar [0, 0, 0, 0]
```

### K6 — Vincoli sul codice

```mermaid
xychart-beta
  title "Occorrenze di onclick, getElementById, var"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Occorrenze" 0 --> 10
  bar [0, 0, 0, 0]
```

Obiettivo: 0, nessuna barra.
