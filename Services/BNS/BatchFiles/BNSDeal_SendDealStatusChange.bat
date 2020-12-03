set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set LenderId=%6%
set LawyerID=%7%
set FCTURN=%8%
set LenderRefNum=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set RequestType=%1%
set Reason=%2%
set SoapPath=%3%
c:
cd %SoapPath% 

testrunner.bat -s "BNS Test Suite" -c "GetDealStatusCange" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLenderId=%LenderId% -PLawyerID=%LawyerID% -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PRequestType=%RequestType%  -PReason=%Reason% -e%RequestURL% %projectFileName% 