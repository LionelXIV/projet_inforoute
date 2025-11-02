#!/usr/bin/env bash
# build.sh - Script exécuté lors du build sur Render

set -o errexit  # Arrête en cas d'erreur

# Installer les dépendances (déjà fait par Render via pip install -r requirements.txt)
# mais on peut ajouter des commandes ici si nécessaire

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Appliquer les migrations
python manage.py migrate --noinput

