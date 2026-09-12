# Materijali iz kolegija: Web aplikacije (WA)

<img src="WA-banner.png" alt="Web aplikacije (WA)" style="border-radius: 8px;">

<p>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
      <a href="https://nodejs.org/en" target="_blank">  <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <a href="https://expressjs.com/" target="_blank">  <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <a href="https://www.mongodb.com/" target="_blank">  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <a href="https://jwt.io/" target="_blank">  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</p>

**Nositelj**: [doc. dr. sc. Nikola Tanković](https://fipu.unipu.hr/fipu/nikola.tankovic)  
**Asistent**: [Luka Blašković, mag. inf.](https://fipu.unipu.hr/fipu/luka.blaskovic)

**Ustanova**: [Sveučilište Jurja Dobrile u Puli](https://www.unipu.hr/), [Fakultet informatike u Puli](https://fipu.unipu.hr/)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU_white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU.png">
  <img alt="Fakultet informatike u Puli (materijali iz kolegija Web Aplikacije - Luka Blašković)" 
       src="https://raw.githubusercontent.com/lukablaskovic/FIPU-WA/refs/heads/main/FIPU_UNIPU_white.png" width="300">
</picture>

---

Kolegij slušaju:
- studenti 3. godine [Prijediplomskog sveučilišnog studija Informatika](https://fipu.unipu.hr/fipu/studijski_programi/preddiplomski_sveucilisni_studij_informatika) u 5. semestru, na [Fakultetu informatike u Puli](https://fipu.unipu.hr/fipu)
- studenti 3. godine [Prijediplomskog sveučilišnog studija Računarstvo](https://tfpu.unipu.hr/tfpu/studijski_programi/preddiplomski/racunarstvo) u 5. semestru, na [Tehničkom fakultetu u Puli](https://tfpu.unipu.hr/tfpu)

## YouTube 📺

1. [Uvod u HTTP, Node i Express](https://youtu.be/lds6_b8shHQ) ([WA1](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA1%20-%20Uvod%20u%20HTTP%2C%20Node%20i%20Express))
2. [Usmjeravanje na Express poslužitelju 1/2](https://youtu.be/o33YumQ_H2k) ([WA2](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA2%20-%20Usmjeravanje%20na%20Express%20poslu%C5%BEitelju))
3. [Usmjeravanje na Express poslužitelju 2/2](https://youtu.be/3bBWkjoMmyA) ([WA2](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA2%20-%20Usmjeravanje%20na%20Express%20poslu%C5%BEitelju))
4. [Razmjena podataka između klijenta i poslužitelja 1/2](https://youtu.be/bmlw7U5c5EI) ([WA3](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja))
5. [Razmjena podataka između klijenta i poslužitelja 2/2](https://youtu.be/6Bv21fU61DE) ([WA3](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA3%20-%20Razmjena%20podataka%20izme%C4%91u%20klijenta%20i%20poslu%C5%BEitelja))
6. [Upravljanje datotekama, Asinkroni pristupi i Agregacija podataka](https://youtu.be/uJI0LrhDfsk) ([WA4](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA4%20-%20Upravljanje%20datotekama%2C%20Asinkroni%20Pristupi%20i%20Agregacija%20podataka))
7. [MongoDB baza podataka](https://youtu.be/LIJVWlyquKs) ([WA5](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA5%20-%20MongoDB%20baza%20podataka))
8. [Middleware funkcije](https://youtu.be/asRCwzH1fw4) ([WA6](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA6%20-%20Middleware%20funkcije))
9. [Autentifikacija i autorizacija zahtjeva](https://youtu.be/Dz1Lfx5fUfk)([WA7](https://github.com/lukablaskovic/FIPU-WA/tree/main/WA7%20-%20Autentifikacija%20i%20autorizacija%20zahtjeva))

## Kolokviji

- [Službeni šalabahter za 1. Kolokvij (wa-mid)](https://gist.github.com/lukablaskovic/b6e1741b3601dd67ccef1f457e7c852f)
- [Službeni šalabahter za 2. Kolokvij (wa-final)](https://gist.github.com/lukablaskovic/6b9cdce10b85dcac78a68fcab8697fb7)

## Automatsko ažuriranje datuma

Nakon kloniranja repozitorija jednom pokrenite `git config core.hooksPath .githooks` (potreban je Python 3).
Pri svakom lokalnom commitu hook postavlja `🆙 Posljednje ažurirano` na današnji lokalni datum u promijenjenim Markdown datotekama koje već imaju tu oznaku. Promjene koje nisu staged ostaju izvan commita.
Provjera: `python3 .githooks/test_dates.py`.
