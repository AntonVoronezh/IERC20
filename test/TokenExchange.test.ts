import { loadFixture, expect, ethers } from "./setup";
import {ABCDFToken} from "../typechain-types"

describe("TokenExchange", function () {
  async function deploy() {
    const [owner, buyer] = await  ethers.getSigners();

    const ABCDFToken = await ethers.getContractFactory("ABCDFToken");
    const abcdf = await ABCDFToken.deploy(owner.address);
    await abcdf.waitForDeployment();

    const TokenExchange = await ethers.getContractFactory("TokenExchange");
    const exch = await TokenExchange.deploy(abcdf.target);
    await exch.waitForDeployment();

    return { abcdf, exch, owner, buyer };
  }

  it("should allow to buy", async function () {
    const { abcdf, exch, owner, buyer } = await loadFixture(deploy);

    const tokensInStock = 3n;
    const tokensWithDecimals = await withDecimals(abcdf, tokensInStock);

    const transferTx = await abcdf.transfer(exch.target, tokensWithDecimals);

    // expect(abcdf.balanceOf(exch.target)).to.eq(tokensWithDecimals);
    await expect(transferTx).to.changeTokenBalances(
        abcdf, [owner, exch], [-tokensWithDecimals, tokensWithDecimals]
    );

    const tokensToBuy = 1n;
    const value  = ethers.parseEther(tokensToBuy.toString());

    const buyTx = await  exch.connect(buyer).buy({value: value});
    await buyTx.wait();

    await expect(buyTx).to.changeEtherBalances([buyer, exch], [-value, value]);
    await expect(buyTx).to.changeTokenBalances(abcdf, [exch, buyer], [-value, value]);
  });

  it("should allow to sell", async function () {
    const { abcdf, exch, owner, buyer } = await loadFixture(deploy);

    const tokensInStock = 3n;
    const tokensWithDecimals = await withDecimals(abcdf, tokensInStock);


  });

  async function withDecimals(token: ABCDFToken, value: bigint): Promise<bigint> {
    return value * 10n ** await token.decimals();
  }

});
