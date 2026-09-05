@echo off
chcp 65001 >nul
title Phần Mềm Quản Trị Giá Lock&King
echo =================================================================
echo        KHỞI ĐỘNG PHẦN MỀM QUẢN TRỊ GIÁ LOCK&KING
echo =================================================================
echo.
echo Đang mở ứng dụng trong trình duyệt web của bạn...
echo.

if exist "C:\Users\ADMIN\nodejs\node-v20.18.0-win-x64\node.exe" (
    "C:\Users\ADMIN\nodejs\node-v20.18.0-win-x64\node.exe" server.js
) else (
    start "" "index.html"
)
pause
