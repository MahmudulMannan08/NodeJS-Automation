set projectFileName=%1%
set KeystorePath=%2%
set KeystorePassword=%3%
set LenderRefNumber=%4%
set RequestURL=%5%
set GetLDEResponseFilePath=%6%
set SoapPath=%7%
c:
cd %SoapPath% 

testrunner.bat -s "TD Test Suite" -c "TD GetLawyerEvents"  -PKeystorePath=%KeystorePath% -PKeystorePassword=%KeystorePassword% -PLenderRefNum=%LenderRefNumber% -PGetLDEResponseFile=%GetLDEResponseFilePath% -e%RequestURL%  %projectFileName% 