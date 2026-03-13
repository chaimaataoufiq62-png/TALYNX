@echo off
echo ==========================================
echo Lancement du projet Talynx (Backend/Frontend)
echo ==========================================

echo [1/2] Lancement du Backend...
start cmd /k "cd backend && npm install && npm run dev"

echo [2/2] Lancement du Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo ==========================================
echo Serveurs lances dans de nouvelles fenetres.
echo - Backend: http://localhost:5000 (MySQL requis port 3306 bd:talynx root:dbweb12)
echo - Frontend: http://localhost:5173
echo ==========================================
