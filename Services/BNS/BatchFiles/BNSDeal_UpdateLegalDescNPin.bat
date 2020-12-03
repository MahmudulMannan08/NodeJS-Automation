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
set updateLegalNPin=%7%
c:
cd %SoapPath% 
echo %updateLegalNPin%
IF NOT DEFINED updateLegalNPin (SET updateLegalNPin="false")
IF "%updateLegalNPin%"=="true" (
testrunner.bat -s "BNS Test Suite" -c "UpdateDealLegalNpin" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLawyerID=%LawyerID%  -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PClosingDate=%ClosingDate% -PCity=%City% -PMortgageCentreFirstName=%MortgageCentreFirstName% -PProvince=%Province% -PIsRFF=%IsRFF% -PIsSolicitorClose=%IsSolicitorClose% -e%RequestURL% %projectFileName%
) ELSE (
testrunner.bat -s "BNS Test Suite" -c "UpdateDealRemoveLegalNpin" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLawyerID=%LawyerID%  -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PClosingDate=%ClosingDate% -PCity=%City% -PMortgageCentreFirstName=%MortgageCentreFirstName% -PProvince=%Province% -PIsRFF=%IsRFF% -PIsSolicitorClose=%IsSolicitorClose% -e%RequestURL% %projectFileName%
)