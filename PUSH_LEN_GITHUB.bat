@echo off
chcp 65001 >nul
title Đẩy Mã Nguồn Lên GitHub - Tonytuyenle/baogiavugia
echo =================================================================
echo       ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB: baogiavugia
echo =================================================================
echo.

set "PATH=C:\Users\ADMIN\git\cmd;%PATH%"

echo Đang kết nối và đẩy mã nguồn lên https://github.com/Tonytuyenle/baogiavugia.git ...
echo (Nếu xuất hiện cửa sổ trình duyệt, vui lòng bấm Sign in / Ủy quyền GitHub một lần)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo =================================================================
    echo    THÀNH CÔNG: ĐÃ ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB!
    echo    Đường dẫn: https://github.com/Tonytuyenle/baogiavugia
    echo =================================================================
) else (
    echo.
    echo [LƯU Ý] Nếu đẩy thất bại do yêu cầu Token:
    echo Bạn có thể dán GitHub Personal Access Token (PAT) vào đây hoặc gửi cho trợ lý AI để đẩy tự động.
)
echo.
pause
