set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set LenderId=%6%
set LawyerID=%7%
set LenderRefNum=%8%
set SoapPath=%9%
c:
cd %SoapPath% 

testrunner.bat -s "BNS Test Suite" -c "GetLawyerDealEvent" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLenderId=%LenderId% -PLawyerID=%LawyerID% -PLenderRefNum=%LenderRefNum% -e%RequestURL% %projectFileName% 