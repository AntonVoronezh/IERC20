import { loadFixture, expect, ethers } from "./setup";
import {ABCDFToken} from "../typechain-types"

describe("SomeShop", function () {
  async function deploy() {
    const [owner, buyer] = await  ethers.getSigners();

    const ABCDFToken = await ethers.getContractFactory("ABCDFToken");
    const abcdf = await ABCDFToken.deploy(owner.address);
    await abcdf.waitForDeployment();

    const SomeShop = await ethers.getContractFactory("SomeShop");
    const shop = await SomeShop.deploy(abcdf.target);
    await shop.waitForDeployment();

    return { abcdf, shop, owner, buyer };
  }

  it("should allow to buy", async function () {
    const { abcdf, shop, buyer } = await loadFixture(deploy);

    const transferTx = await abcdf.transfer(buyer.address, await withDecimals(abcdf, 3n));
    await transferTx.wait();

    const price = 1000n;

    const addTx = await shop.addItem(price,5, "test item");
    await addTx.wait();

    const uid = await shop.uniqueIds(0);
    const deliveryAdr = "some address";
    const quqntyty = 5n;
    const totalPrice = quqntyty & price;

    const approveTx = await abcdf.connect(buyer).approve(shop.target, totalPrice);
    await approveTx.wait();

    const buyTx = await  shop.connect(buyer).buy(uid, quqntyty, deliveryAdr);
    await buyTx.wait();

    await expect(buyTx).to.changeTokenBalances(abcdf, [shop, buyer], [totalPrice, -totalPrice]);

    expect(abcdf.allowance(buyer.address, shop.target)).to.eq(0);

    const boughtItem  = await shop.buyers(buyer.address, 0);

    expect(boughtItem.deliveryAddress).to.eq(deliveryAdr);
    expect(boughtItem.uniqueId).to.eq(uid);
    expect(boughtItem.numOfPurchasedItems).to.eq(quqntyty);
  });



  async function withDecimals(token: ABCDFToken, value: bigint): Promise<bigint> {
    return value * 10n ** await token.decimals();
  }

});
