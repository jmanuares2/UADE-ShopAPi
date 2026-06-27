@echo off
netstat -ano | findstr /C:":8080 " | findstr "LISTENING" >nul
if %ERRORLEVEL% equ 0 goto runTests

echo =========================================================================
echo AVISO IMPORTANTE:
echo No se detecto ninguna aplicacion corriendo en el puerto 8080.
echo Por favor, inicia tu proyecto Spring Boot antes de continuar.
echo Si ya lo iniciaste en otro puerto, o estas seguro de que esta corriendo,
echo presiona cualquier tecla para continuar de todos modos.
echo =========================================================================
pause

:runTests
echo.
echo Ejecutando Pruebas.postman_collection.json con Newman...
newman run Pruebas.postman_collection.json --environment newman-environment.json
pause
