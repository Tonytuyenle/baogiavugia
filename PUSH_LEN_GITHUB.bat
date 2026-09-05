@echo off
chcp 65001 >nul
title Đẩy Mã Nguồn Lên GitHub - Tonytuyenle/baogiavugia
echo =================================================================
echo       ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB: baogiavugia
echo =================================================================
echo.

set "PATH=C:\Users\ADMIN\git\cmd;C:\Users\ADMIN\git\mingw64\bin;%PATH%"

echo Đang kết nối và đẩy mã nguồn lên https://github.com/Tonytuyenle/baogiavugia.git ...
echo (Nếu cửa sổ trình duyệt hiện ra, vui lòng bấm Sign in / Ủy quyền tài khoản GitHub)
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =================================================================
    echo    THÀNH CÔNG: ĐÃ ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB!
    echo    Đường dẫn: https://github.com/Tonytuyenle/baogiavugia
    echo =================================================================
    echo.
    pause
    exit /b 0
)

echo.
echo -----------------------------------------------------------------
echo [HƯỚNG DẪN XÁC THỰC GITHUB NHANH CHÓNG]
echo GitHub yêu cầu bảo mật. Nếu trình duyệt không tự động mở,
echo bạn có thể nhập trực tiếp GitHub Personal Access Token (PAT):
echo -----------------------------------------------------------------
set /p TOKEN="Nhập GitHub Token của bạn (bỏ qua nếu không có, nhấn Enter): "

if not "%TOKEN%"=="" (
    echo.
    echo Đang đẩy mã nguồn bằng Token...
    git push https://%TOKEN%@github.com/Tonytuyenle/baogiavugia.git main
    if %ERRORLEVEL% equ 0 (
        echo =================================================================
        echo    THÀNH CÔNG: ĐÃ ĐẨY TOÀN BỘ MÃ NGUỒN LÊN GITHUB!
        echo    Đường dẫn: https://github.com/Tonytuyenle/baogiavugia
        echo =================================================================
    ) else (
        echo Đẩy thất bại, vui lòng kiểm tra lại Token.
    )
)
