@echo off
rem ONE! Profile — локальный запуск (для сетей, где github.io заблокирован)
cd /d "%~dp0"
if not exist node_modules (
  echo Устанавливаю зависимости...
  call npm install
)
echo Откройте в браузере: http://127.0.0.1:5173/
call npm run dev -- --host 127.0.0.1 --port 5173