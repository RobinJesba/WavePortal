const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();

    /* hre => Hardhat Runtime Environment, will be injected as global varible
    every time you run a terminal command that starts with npx hardhat you are 
    getting this hre object built on the fly using the hardhat.config.js 
    specified in your code! This means you will never have to actually do some 
    sort of import into your files like:
    const hre = require("hardhat")
    */    
    // compile the contract under artifacts 
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    // deploying to local blockchain
    const waveContract = await waveContractFactory.deploy();

    await waveContract.deployed();

    // gives the address of the smart contract
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    let waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
    
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait();

    await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();