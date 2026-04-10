set GIT_EXE=C:\Users\YASH SHUKLA\.gemini\antigravity\scratch\mingit\cmd\git.exe
cd /d "C:\Users\YASH SHUKLA\OneDrive\Desktop\vc11\final-voltchain"
"%GIT_EXE%" add src/pages/Account.tsx
"%GIT_EXE%" commit -m "Make Account profile fields strictly read-only except passwords"
"%GIT_EXE%" push origin main
