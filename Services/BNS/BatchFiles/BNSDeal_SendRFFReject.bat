set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set FCTURN=%6%
set LenderRefNum=%7%
set ClosingDate=%8%
set SoapPath=%9%
c:
cd %SoapPath% 

testrunner.bat -s "BNS Test Suite" -c "SendRFFReject" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PClosingDate=%ClosingDate% -e%RequestURL% %projectFileName% 