
set projectFileName=%1%
set KeystorePath=%2%
set KeystorePassword=%3%
set ResponseFilePath=%4%
set RequestURL=%5%
set LawyerID=%6%
set FctURN=%7%
set LenderRefNo=%8%
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

set InterestRate=%1%
set Type=%2%
set Province=%3%
set SoapPath=%4%
c:
cd %SoapPath% 


testrunner.bat -s "TD Test Suite" -c "TD Update Creation" -PKeystorePath=%KeystorePath% -PKeystorePassword=%KeystorePassword% -PResponseDealDataPath=%ResponseFilePath% -PFCTURN=%FctURN% -PLenderRefNum=%LenderRefNo%  -PClosingDate=%ClosingDate% -PInterestRate=%InterestRate% -PType=%Type% -PProvince=%Province% -PLawyerID=%LawyerID% -e%RequestURL% %projectFileName% 