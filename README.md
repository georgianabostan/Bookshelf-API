# Bookshelf-API

API REST pentru gestionarea unei biblioteci personale. Proiectul foloseste Node.js, Express, TypeScript, PostgreSQL, Supabase, JWT si Zod.

## Tehnologii

* Node.js
* TypeScript
* Express
* PostgreSQL
* Supabase
* JWT
* Zod
* Vitest
* Supertest
* Multer
* Winston
* express-rate-limit

## Instalare

### 1. Instalare Node.js

Instaleaza Node.js de pe site-ul oficial.

Verifica instalarea:

```bash
node -v
npm -v
```

### 2. Instalare dependente

Dupa clonarea proiectului, intra in folderul proiectului si ruleaza:

```bash
npm install
```

### 3. Configurarea variabilelor de mediu

Creeaza un fisier `.env` in folderul principal al proiectului.

Exemplu:

```env
PORT=8000
NODE_ENV=development

JWT_SECRET=your-secret-key

POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-key
```

Nu publica fisierul `.env` in repository.

## Supabase

Proiectul foloseste Supabase pentru PostgreSQL si pentru storage-ul imaginilor copertilor.

### Varianta folosita in proiect

Pentru rularea proiectului se poate folosi un proiect Supabase existent.

Din dashboard-ul Supabase se obtin:

* `SUPABASE_URL`
* `SUPABASE_SECRET_KEY`
* datele de conectare PostgreSQL

Aceste valori trebuie adaugate in fisierul `.env`.

### Supabase local

Daca vrei sa rulezi Supabase local, ai nevoie de Supabase CLI si Docker.

Dupa instalarea acestora, din folderul proiectului ruleaza:

```bash
supabase init
```

Apoi:

```bash
supabase start
```

Comanda porneste serviciile Supabase local.

Pentru oprirea serviciilor:

```bash
supabase stop
```

Dupa pornirea Supabase local, foloseste valorile afisate de CLI pentru configurarea variabilelor PostgreSQL si Supabase din `.env`.

## Pornirea API-ului

Pentru pornirea serverului in development:

```bash
npm run dev
```

API-ul va fi disponibil la:

```text
http://localhost:8000
```

Portul poate fi modificat din variabila:

```env
PORT=8000
```

## Testare

Pentru rularea testelor:

```bash
npm test
```

Testele folosesc Vitest si Supertest.

## Functionalitati

API-ul permite:

* inregistrarea utilizatorilor
* autentificare cu JWT
* controlul accesului pe baza rolului
* adaugarea cartilor
* listarea cartilor
* filtrarea cartilor dupa status
* paginare
* sortare dupa titlu, autor, status sau rating
* actualizarea cartilor
* stergerea cartilor
* upload pentru coperti
* validarea datelor cu Zod
* rate limiting pentru autentificare
* izolarea cartilor intre utilizatori

## Securitate

* parolele sunt hash-uite cu bcrypt
* autentificarea foloseste JWT
* query-urile PostgreSQL folosesc parametri
* utilizatorii pot accesa doar propriile carti
* datele primite sunt validate cu Zod
* endpoint-urile de autentificare au rate limiting
* fisierele uploadate sunt validate dupa tip si dimensiune
* datele sensibile nu trebuie salvate in repository
