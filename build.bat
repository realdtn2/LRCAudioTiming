@echo off
echo Building LRC Audio Timing for Windows...
echo.

echo Installing dependencies...
call npm install

echo.
echo Building executable...
call npm run build-win

echo.
echo Build complete! Check the 'dist' folder for your executable.
pause
