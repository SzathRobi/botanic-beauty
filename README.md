This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Helyi MongoDB Dockerrel

A projekthez külön MongoDB tartozik, a másik projekt `27017`-es konténerétől függetlenül:

| Beállítás              | Érték                        |
| ---------------------- | ---------------------------- |
| Docker Desktop projekt | `botanic-beauty-local`       |
| Konténer               | `botanic-beauty-mongodb`     |
| Elérés a gépről        | `127.0.0.1:27018`            |
| Adatbázis              | `botanic_beauty`             |
| Replica set            | `botanic-beauty-rs`          |
| Adattárolás            | Saját Docker named volume-ok |

Indítás és a helyi adatbázis előkészítése:

```bash
npm run db:local:up
npm run db:local:init
```

Másold a `.env.local.example` fájlt `.env.local` néven, ha még nem létezik. A kapcsolat:

```dotenv
DATABASE_URL="mongodb://127.0.0.1:27018/botanic_beauty?replicaSet=botanic-beauty-rs&directConnection=true"
```

A Next.js a `.env.local` értékét használja a `.env` helyett. Az eredeti `.env` változatlan maradhat; a fejlesztői szervert az új beállítás után újra kell indítani. A MongoDB csak a helyi gépen érhető el, fejlesztéshez jelszó nélkül.

Az inicializáló parancs kizárólag a fenti helyi címre kapcsolódik, az alkalmazás meglévő Prisma-sémájából hozza létre a kollekciókat és indexeket, és beállít egy hétfőtől péntekig 10–19 órás nyitvatartást, valamint egy üres beosztást. Újrafuttatva megőrzi a már meglévő helyi adatokat és beállításokat. Éles adatokat nem másol át, a Prisma-sémát nem módosítja.

Helyi adatbázis-előkészítéshez a `db:local:init` parancsot használd: a közvetlen Prisma CLI parancsok a `.env.local` fájlt nem töltik be automatikusan.

Leállítás az adatok megtartásával:

```bash
npm run db:local:down
```

A konténer egynódos replica setként indul, hogy a Prisma MongoDB-tranzakciói is működjenek. [MongoDB: replica set és tranzakciók](https://www.mongodb.com/docs/manual/replication/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
