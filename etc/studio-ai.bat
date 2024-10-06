@echo off
title Studio-AI-Server
"C:\Program Files\nodejs\node.exe" ^
    .\dst\server\index.mjs ^
    -v 2 ^
    -a 0.0.0.0 -p 12345
