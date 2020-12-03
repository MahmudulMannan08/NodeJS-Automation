set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set LenderId=%6%
set LawyerID=%7%
set ClosingDate=%8%
set Province=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set IsRFF=%1%
set IsSolicitorClose=%2%
set SoapPath=%3%
set docType=%4%
c:
cd %SoapPath% 

IF NOT DEFINED docType (SET docType="")
if %docType%=="" (
testrunner.bat -s "BNS Test Suite" -c "CreateDeal" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLenderId=%LenderId% -PLawyerID=%LawyerID% -PClosingDate=%ClosingDate% -PProvince=%Province% -PIsRFF=%IsRFF% -PIsSolicitorClose=%IsSolicitorClose% -e%RequestURL% %projectFileName% 
)
else
(
testrunner.bat -s "BNS Test Suite" -c "CreateDealWithDocType" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLenderId=%LenderId% -PLawyerID=%LawyerID% -PClosingDate=%ClosingDate% -PProvince=%Province% -PIsRFF=%IsRFF%  -PIsSolicitorClose=%IsSolicitorClose% -PdocType=%docType% -e%RequestURL% %projectFileName% 
)
