set name=%1
set platform=%2
set arch=%3
set version=%4

cd dist
build\tools\7-ZipPortable-1805\7z.exe a -aoa -mx=9 .\%name%-%platform%-%arch%-%version%.zip %name%-%platform%-%arch%\*