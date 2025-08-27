@echo off
echo Copying images from C:\Users\Admin\Downloads\ganesh-photo-gallery-react\Images to public\Images...

if not exist "public\Images" mkdir "public\Images"

xcopy "C:\Users\Admin\Downloads\ganesh-photo-gallery-react\Images\*" "public\Images\" /Y /I

echo Images copied successfully!
echo.
echo Please update the data.js file with your actual image filenames.
echo Current structure expects files like:
echo - SheikhBazar.jpg
echo - Stadium.jpg  
echo - MohammedaBazar.jpg
echo - etc.
echo.
pause