@echo off
echo Protection des fichiers sensibles...

IF EXIST index.html ren index.html index_backup.html
IF EXIST style.css ren style.css style_backup.css
IF EXIST src ren src src_backup

echo Initialisation du projet Vite...
npm create vite@latest . -- --template vanilla-ts
npm install

echo Suppression des fichiers generes par Vite...
IF EXIST index.html del index.html
IF EXIST style.css del style.css
IF EXIST src rmdir /S /Q src

echo Restauration des fichiers originaux...
IF EXIST index_backup.html ren index_backup.html index.html
IF EXIST style_backup.css ren style_backup.css style.css
IF EXIST src_backup ren src_backup src

echo ✅ Projet Vite initialisé avec votre code existant.
pause

cd market-simulator
npm install
npm run dev