set projectFileName=%1%
set RequestURL=%2%
set basicAuthUser=%3%
set basicAuthPass=%4%
set DealResponseFilePath=%5%
set LenderId=%6%
set FCTURN=%7%
set LenderRefNum=%8%
set NoteID=%9%
shift
shift
shift
shift
shift
shift
shift
shift
shift
set NoteType=%1%
set NoteStatus=%2%
set NoteSubject=%3%
set NoteDetails=%4%
set SoapPath=%5%
c:
cd %SoapPath% 
testrunner.bat -s "BNS Test Suite" -c "SendNote" -PbasicAuthUser=%basicAuthUser% -PbasicAuthPass=%basicAuthPass% -PDealResponseFilePath="%DealResponseFilePath%" -PLenderId=%LenderId% -PFCTURN=%FCTURN% -PLenderRefNum=%LenderRefNum% -PNoteID=%NoteID% -PNoteType=%NoteType% -PNoteStatus=%NoteStatus% -PNoteSubject=%NoteSubject% -PNoteDetails=%NoteDetails% -e%RequestURL% %projectFileName% 