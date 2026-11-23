# Controllo e monitoraggio

Strumenti per seguire l'avanzamento della Build Week. Chi fa cosa e lo stato di ogni voce stanno nel *Backlog* di [Project management](Project%20management.md); qui c'è il piano nel tempo.

## Gantt

Chi fa quale voce del backlog (numero tra parentesi) e in quale giorno. Si aggiorna dopo lo stand-up quando un lavoro slitta.

```mermaid
gantt
  title Build Week 2 — Team 3
  dateFormat YYYY-MM-DD
  axisFormat %a %d

  section Tutti insieme
  Prova API con Postman            :2026-11-23, 1d
  fetchJSON e modelli (3)          :2026-11-24, 1d
  Extra (12–15, da definire)       :2026-11-26, 1d
  Revisione e prova esposizione    :2026-11-27, 1d

  section Luca
  Markup riga brano (con Francesca) :2026-11-24, 1d
  Helper preferiti e cronologia (7, 10) :2026-11-24, 1d
  Dettaglio album (6, 7)           :2026-11-25, 1d
  Preferiti nella sidebar (7)      :2026-11-25, 1d
  README finito                    :2026-11-26, 1d

  section Gabriel
  Fondamenta (percorsi, Prettier, media) :2026-11-24, 1d
  CSS comune (1, 2)                :2026-11-24, 1d
  Merge e rifinitura responsive    :2026-11-25, 1d

  section Giovanbattista
  Markup card (con Alessandro)     :2026-11-24, 1d
  CSS Home e Cerca (2)             :2026-11-24, 1d
  Home, preferiti, recenti (7, 8, 10) :2026-11-25, 1d

  section Francesca
  Markup riga brano (con Luca)     :2026-11-24, 1d
  CSS Album e Artista (2)          :2026-11-24, 1d
  Dettaglio artista (11)           :2026-11-25, 1d

  section Alessandro
  Markup card (con Giovanbattista) :2026-11-24, 1d
  Player (9)                       :2026-11-24, 1d
  Cerca e ultima ricerca (4, 5)    :2026-11-25, 1d
  Brano in corso al cambio pagina  :2026-11-25, 1d

  section Scadenze
  Minimo completo                  :milestone, 2026-11-26, 0d
  Esposizione finale               :milestone, 2026-11-27, 0d
```

## KPI

Pochi indicatori, tutti misurabili in pochi minuti dopo lo stand-up. Li rileva il TL (venerdì chi coordina la giornata) e li segna nei grafici di *Andamento dei KPI*.

| # | KPI | Come si misura | Obiettivo |
| --- | --- | --- | --- |
| K1 | Avanzamento del minimo | Voci **M** a «Fatto» nel backlog, su 11 | Martedì sera 4 (1, 2, 3, 9); mercoledì sera 11 |
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
  title "Voci M fatte, su 11"
  x-axis ["Mar 24", "Mer 25", "Gio 26", "Ven 27"]
  y-axis "Voci" 0 --> 11
  line [4, 11, 11, 11]
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
  line [5, 5, 5, 0]
  bar [0, 0, 0, 0]
```

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
