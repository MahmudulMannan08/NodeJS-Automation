set projectFileName=%1%
set KeystorePath=%2%
set KeystorePassword=%3%
set FCTURN=%4%
set LenderRefNumber=%5%
set RequestURL=%6%
set DealStatus=%7%
set ResponseFilePath=%8%
set DealReason=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set SoapPath=%1%
c:
cd %SoapPath% 

echo projectFileName=%projectFileName%
echo FCTURN=%FCTURN%
echo LenderRefNumber=%LenderRefNumber%
echo RequestURL=%RequestURL%
echo DealStatus=%DealStatus%
echo ResponseFilePath=%ResponseFilePath%

testrunner.bat -s "TD Test Suite" -c "TD Deal Status Change" -PKeystorePath=%KeystorePath% -PKeystorePassword=%KeystorePassword%  -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNumber% -PDealStatus=%DealStatus% -PReason=%DealReason% -PDealResponseFilePath=%ResponseFilePath% -e%RequestURL%  %projectFileName% 