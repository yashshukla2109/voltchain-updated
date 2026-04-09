set GIT_EXE=C:\Users\YASH SHUKLA\.gemini\antigravity\scratch\mingit\cmd\git.exe
cd /d "C:\Users\YASH SHUKLA\OneDrive\Desktop\vc11\final-voltchain"
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Revert model back to gemini-2.5-flash"
"%GIT_EXE%" push origin main
