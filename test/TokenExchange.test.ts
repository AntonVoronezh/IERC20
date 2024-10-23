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

  // it("should allow to add  albums", async function () {
  //   const { shop } = await loadFixture(deploy);
  //
  //   const title = "Demo";
  //   const price = 100;
  //   const uid = ethers.solidityPackedKeccak256(["string"], [title]);
  //   const qty = 5;
  //   const initialIndex = 0;
  //
  //   const addTx = await shop.addAlbum(uid, title, price, qty);
  //   await addTx.wait();
  //
  //   const album  = await shop.albums(initialIndex);
  //
  //   expect(album.index).to.eq(initialIndex);
  //   expect(album.uid).to.eq(uid);
  //   expect(album.price).to.eq(price);
  //   expect(album.quantity).to.eq(qty);
  //
  //   expect(await shop.currentIndex()).to.eq(initialIndex + 1);
  // });

});
