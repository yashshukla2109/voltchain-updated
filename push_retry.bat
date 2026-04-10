set GIT_EXE=C:\Users\YASH SHUKLA\.gemini\antigravity\scratch\mingit\cmd\git.exe
cd /d "C:\Users\YASH SHUKLA\OneDrive\Desktop\vc11\final-voltchain"
"%GIT_EXE%" add src/pages/chatbot.tsx
"%GIT_EXE%" commit -m "Add automatic retry logic to absorb Google AI 503 server errors"
"%GIT_EXE%" push origin main
