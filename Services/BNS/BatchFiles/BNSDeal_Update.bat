set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set LawyerID=%6%
set FCTURN=%7%
set LenderRefNum=%8%
set ClosingDate=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set City=%1%
set MortgageCentreFirstName=%2%
set Province=%3%
set IsRFF=%4%
set IsSolicitorClose=%5%
set SoapPath=%6%
c:
cd %SoapPath% 

testrunner.bat -s "BNS Test Suite" -c "UpdateDeal" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLawyerID=%LawyerID%  -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PClosingDate=%ClosingDate% -PCity=%City% -PMortgageCentreFirstName=%MortgageCentreFirstName% -PProvince=%Province% -PIsRFF=%IsRFF% -PIsSolicitorClose=%IsSolicitorClose% -e%RequestURL% %projectFileName%