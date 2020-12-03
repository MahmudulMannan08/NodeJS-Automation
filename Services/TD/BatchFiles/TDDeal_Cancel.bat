set projectFileName=%1%
set FCTURN=%2%
set LenderRefNumber=%3%
set RequestURL=%4%
set SoapPath=%5%
c:
cd %SoapPath% 

echo projectFileName=%projectFileName%
echo FCTURN=%FCTURN%
echo LenderRefNumber=%LenderRefNumber%
echo RequestURL=%RequestURL%

testrunner.bat -s "TD Test Suite" -c "TD Deal Cancel" -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNumber% -e%RequestURL%  %projectFileName% 