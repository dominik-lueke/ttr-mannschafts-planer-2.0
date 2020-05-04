set name=TischtennisMannschaftsPlaner
set platform=win32
set arch=x64
set version=2.1.0

build\package.bat %name% %platform% %arch% %version% && build\archive.bat %name% %platform% %arch% %version%
