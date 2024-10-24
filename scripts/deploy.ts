import hre, {ethers} from "hardhat";

// npx hardhat run scripts\deploy.ts --network localhost

async function main() {
    console.log('DEPLOYING...') // eslint-disable-line
    const [signer] = await ethers.getSigners();

    const ABCDFToken = await ethers.getContractFactory("ABCDFToken");
    const abcdf = await ABCDFToken.deploy(signer.address);
    await abcdf.waitForDeployment();

    const TokenExchange = await ethers.getContractFactory("TokenExchange");
    const exch = await TokenExchange.deploy(abcdf.target);
    await exch.waitForDeployment();

    console.log(`Token: ${abcdf.target}`) // eslint-disable-line
    console.log(`Exchange: ${exch.target}`) // eslint-disable-line
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
