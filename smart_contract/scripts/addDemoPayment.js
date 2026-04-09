const main = async () => {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // From src/utils/constants.js
    const Transactions = await hre.ethers.getContractFactory("Transactions");

    // Attach to the deployed contract
    const transactions = await Transactions.attach(contractAddress);

    console.log("Attached to Transactions contract at:", transactions.address);

    // Define demo payment details
    const receiver = "0x8aa395Ab97837576aF9cd6946C79024ef1acfdbE"; // Using a dummy address from dummyData.js
    const amount = hre.ethers.utils.parseEther("0.001");
    const message = "Demo payment via Hardhat script";
    const keyword = "demo";

    console.log(`Sending demo payment of 0.001 ETH to ${receiver}...`);

    // Call addToBlockchain
    // Note: addToBlockchain does not actually transfer ETH in the contract logic, 
    // but we can send value with the transaction if we want, though the contract isn't payable.
    // We will just call the function to log the transaction as per the contract definition.

    const tx = await transactions.addToBlockchain(receiver, amount, message, keyword);

    console.log("Transaction sent! Hash:", tx.hash);

    await tx.wait();

    console.log("Transaction mined.");

    // Verify count
    const count = await transactions.getTransactionCount();
    console.log("Total transactions count:", count.toString());
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();
