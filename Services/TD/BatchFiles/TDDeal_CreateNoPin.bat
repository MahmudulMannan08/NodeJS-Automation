
set projectFileName=%1%
set KeystorePath=%2%
set KeystorePassword=%3%
set URNFileName=%4%
set RequestURL=%5%
set LawyerID=%6%
set ClosingDate=%7%
set Type=%8%
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
set SoapPath=%1%
c:
cd %SoapPath% 


testrunner.bat -s "TD Test Suite" -c "TD Deal Creation Without Pin" -PKeystorePath=%KeystorePath% -PKeystorePassword=%KeystorePassword% -PFctURNFile=%URNFileName% -PLawyerID=%LawyerID%  -PClosingDate=%ClosingDate% -PType=%Type% -PProvince=%Province% -e%RequestURL% %projectFileName%