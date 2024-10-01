@echo off
title Studio-AI-Server
"c:\Program Files\nodejs\node.exe" ^
    .\dst\server\index.js ^
    -v 2 ^
    -a 0.0.0.0 -p 12345
