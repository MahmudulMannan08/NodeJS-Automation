set projectFileName=%1%
set RequestURL=%2%
set KeystorePath=%3%
set KeystorePassword=%4%
set DealResponseFilePath=%5%
set LawyerID=%6%
set FCTURN=%7%
set LenderRefNum=%8%
set RequestType=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set Reason=%1%
set SoapPath=%2%
c:
cd %SoapPath% 

testrunner.bat -s "TD Test Suite" -c "TD Deal Status Change" -PKeystorePath=%KeystorePath% -PKeystorePassword=%KeystorePassword%   -PDealResponseFilePath="%DealResponseFilePath%" -PLawyerID=%LawyerID% -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PRequestType=%RequestType%  -PReason=%Reason% -e%RequestURL% %projectFileName% 