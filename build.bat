set name=TischtennisMannschaftsPlaner
set platform=win32
set arch=x64
set version=1.0.0

build\package.bat %name% %platform% %arch% %version% && build\archive.bat %name% %platform% %arch% %version%