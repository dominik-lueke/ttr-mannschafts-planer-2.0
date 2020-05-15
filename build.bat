set name=TischtennisMannschaftsPlaner
set platform=win32
set arch=x64
set version=2.2-SNAPSHOT

build\package.bat %name% %platform% %arch% %version% && build\archive.bat %name% %platform% %arch% %version%
