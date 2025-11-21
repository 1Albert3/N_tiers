@echo off
echo Reconstruction des images Docker...

docker-compose build --no-cache

echo.
echo Images reconstruites avec succes!
