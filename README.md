# Centre Missionnaire Shimekah

Site web du **Centre Missionnaire Shimekah — ECC/56è CECC**.

## Structure

```text
church-shimekah/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   └── church/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
└── README.md
```

## Backend

Technologies : Django, Django REST Framework.

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend local :

```text
http://127.0.0.1:8000
```

## Frontend

Technologies : React + Vite.

```bash
cd frontend
npm install
npm run dev
```

Frontend local :

```text
http://localhost:5173
```

## Déploiement

Backend (Render) :

```text
Root Directory: backend
Build Command:  (laisser vide)
Start Command:  python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Variables Render :

```env
SECRET_KEY=<clé-aléatoire-de-64-caractères>
DEBUG=False
ALLOWED_HOSTS=shimekah-churhc.onrender.com
CORS_ALLOWED_ORIGINS=https://shimekah-churhc.bofigauthier3.workers.dev
CSRF_TRUSTED_ORIGINS=https://shimekah-churhc.bofigauthier3.workers.dev
```

Frontend (Cloudflare) :

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Variable Cloudflare :

```env
VITE_API_BASE_URL=https://shimekah-churhc.onrender.com/api
```

Ne jamais publier les fichiers `.env` ou les clés secrètes sur GitHub.
