# Dekkjasafn - Einstaklingsverkefni í Vefforritun 2025

## Um verkefnið
Dekkjasafn er vefsíða sem gerir notendum kleift að leita að og bera saman dekk frá ýmsum söluaðilum á Íslandi. 
Þetta er einstaklingsverkefni í áfanganum Vefforritun 2025.

## Virkni
- Leita að dekkjum eftir stærðum (breidd, hæð, felgustærð)
- Bera saman verð og eiginleika dekkja
- Sjá birgðastöðu hjá söluaðilum
- Raða niðurstöðum eftir verði, framleiðanda eða söluaðila

## Tæknistakur
- Next.js 14 (React framework)
- TypeScript
- PostgreSQL gagnagrunnur (hýstur á Neon.tech)
- TailwindCSS fyrir útlit
- Vercel fyrir hýsingu

## Uppsetning fyrir þróun

1. Klónaðu verkefnið:
```bash
git clone https://github.com/ManiEids/DekkFrammendi.git
cd DekkFrammendi
```

2. Settu upp nauðsynlega pakka:
```bash
npm install
```

3. Búðu til `.env.local` skrá með tengingu við gagnagrunn:
```
DATABASE_URL=postgresql://your_connection_string_here
```

4. Keyra í þróunarumhverfi:
```bash
npm run dev
```

5. Byggja fyrir framleiðslu:
```bash
npm run build
```

## Höfundur
Máni Eiðsson

---
Verkefnið er hluti af Vefforritun 2025 áfanga.
