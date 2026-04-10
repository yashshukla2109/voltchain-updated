set GIT_EXE=C:\Users\YASH SHUKLA\.gemini\antigravity\scratch\mingit\cmd\git.exe
cd /d "C:\Users\YASH SHUKLA\OneDrive\Desktop\vc11\final-voltchain"
"%GIT_EXE%" add src/context/TransactionContext.jsx
"%GIT_EXE%" commit -m "Fix silent failure bug on Wallet sendTransaction"
"%GIT_EXE%" push origin main
