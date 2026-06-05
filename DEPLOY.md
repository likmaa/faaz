# Guide de déploiement — Fondation FAAZ

## Architecture de production

```
[ Nginx ]  ──►  [ Gunicorn (Django) ]  ──►  [ MySQL ]
               ──►  [ /media/ (fichiers) ]
[ React Admin (port 3001) ]  ──►  build statique servi par Nginx
[ React Frontend (port 3000) ]  ──►  build statique servi par Nginx
```

---

## 1. Variables d'environnement backend

Créer un fichier `/backend/.env` sur le serveur :

```env
# Django
SECRET_KEY=votre_cle_secrete_tres_longue_et_aleatoire
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com

# Base de données MySQL
DB_ENGINE=mysql
DB_NAME=faaz_db
DB_USER=faaz_user
DB_PASSWORD=mot_de_passe_securise
DB_HOST=localhost
DB_PORT=3306

# E-mail Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre_app_password_gmail
DEFAULT_FROM_EMAIL=Fondation FAAZ <noreply@lafaaz.org>

# URLs
FRONTEND_URL=https://votre-domaine.com
CORS_ORIGINS=https://votre-domaine.com,https://admin.votre-domaine.com
```

> ⚠️ Pour Gmail : activer la **validation en 2 étapes** et générer un **App Password** (compte Google → Sécurité → Mots de passe des applications)

---

## 2. Installer les dépendances Python

```bash
cd /backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn mysqlclient python-dotenv
```

Ajouter au début de `config/settings.py` :
```python
from dotenv import load_dotenv
load_dotenv(BASE_DIR / '.env')
```

---

## 3. Préparer Django

```bash
# Migrations
python manage.py migrate

# Fichiers statiques
python manage.py collectstatic --no-input

# Créer le superuser admin
python manage.py createsuperuser
```

---

## 4. Gunicorn (service backend)

Créer `/etc/systemd/system/faaz-backend.service` :

```ini
[Unit]
Description=FAAZ Django Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/chemin/vers/backend
ExecStart=/chemin/vers/backend/venv/bin/gunicorn config.wsgi:application --workers 3 --bind 127.0.0.1:8000
Restart=always
EnvironmentFile=/chemin/vers/backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable faaz-backend
systemctl start faaz-backend
```

---

## 5. Build des frontends React

```bash
# Panel Admin
cd /admin
npm ci
npm run build    # → dist/

# Site Client
cd /frontend
npm ci
npm run build    # → dist/
```

---

## 6. Nginx

```nginx
# /etc/nginx/sites-available/faaz

# Site client public (port 80 / 443)
server {
    server_name votre-domaine.com www.votre-domaine.com;

    root /chemin/vers/frontend/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Django
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Fichiers media Django
    location /media/ {
        alias /chemin/vers/backend/media/;
    }
}

# Panel Admin
server {
    server_name admin.votre-domaine.com;

    root /chemin/vers/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/faaz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 7. SSL avec Let's Encrypt

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d votre-domaine.com -d admin.votre-domaine.com
```

---

## 8. Checklist avant mise en ligne

- [ ] `DEBUG=False` dans `.env`
- [ ] `SECRET_KEY` aléatoire et sécurisée
- [ ] Mot de passe admin changé (pas `Admin1234!`)
- [ ] `sandbox: false` dans `Profile.jsx` (KKiaPay production)
- [ ] Clé KKiaPay production renseignée dans les Paramètres admin
- [ ] MySQL configuré et migré
- [ ] E-mails testés (envoi activation + reset password)
- [ ] SSL actif (HTTPS)
- [ ] Backup automatique de la base de données configuré

---

## Infos utiles

| Composant | Technologie | Port local |
|---|---|---|
| Backend API | Django + Gunicorn | 8000 |
| Site Client | React (Vite) | 3000 (dev) |
| Panel Admin | React (Vite) | 3001 (dev) |
| Base de données | MySQL | 3306 |
