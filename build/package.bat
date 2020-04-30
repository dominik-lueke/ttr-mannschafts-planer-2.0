set name=%1
set platform=%2
set arch=%3
set version=%4

electron-packager . %name% --platform=%platform% --arch=%arch% --out=dist --icon=.\src\image\appicon.ico --app-version=%version% --overwrite --ignore=build*