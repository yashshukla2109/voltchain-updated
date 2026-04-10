@echo off
title VoltChain Blockchain Launcher
color 0b

echo ========================================================
echo        ⚡ VOLTCHAIN LOCAL BLOCKCHAIN SYSTEM ⚡
echo ========================================================
echo.
cd smart_contract

echo [1/2] Spinning up your Local Blockchain Server...
:: This opens a brand new visible window strictly dedicated to the Blockchain Server!
start "VoltChain Node Manager (LEAVE OPEN)" cmd /k "color 0a && echo ================================== && echo ⚡ VOLTCHAIN BLOCKCHAIN SERVER ⚡ && echo ================================== && echo DO NOT CLOSE THIS WINDOW! Leave it running! && echo. && npx hardhat node"

echo Waiting 5 seconds for the blockchain to physically wake up...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Automatically injecting Smart Contract into the Blockchain...
call npx hardhat run scripts/deploy.js --network localhost

echo.
echo ========================================================
echo ✅ DONE! YOUR BLOCKCHAIN IS FULLY ONLINE AND DEPLOYED!
echo ========================================================
echo.
echo 1. Keep the other "VoltChain Node Manager" window open!
echo 2. Go test your Vercel website now, click Send, and it will work!
echo.
pause
