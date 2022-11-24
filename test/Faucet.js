const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("This is our main Faucet testing scope", function () {
    let faucet, signer;

    before("deploy the contract instance first", async function () {
       const Faucet = await ethers.getContractFactory("Faucet");
       faucet = await Faucet.deploy({
            value: ethers.utils.parseUnits("10", "ether"),
       });
       await faucet.deployed();

       //default signer address
       //[signer] = await ethers.provider.listAccounts();
       [signer] = await ethers.getSigners();
    });

    it("should set the owner to be the deployer of the contact", async function () {
        assert.equal(await faucet.owner(), signer.address);
    });

    it("should withdraw the correct amount", async function () {
        let withdrawAmount = ethers.utils.parseUnits("1", "ether");
        await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
    });

    it("should invoke the contracts fallback function", async function () {
      // send an empty transaction to the faucet
      let response = await signer.sendTransaction({
        to: faucet.address,
      });
      let receipt = await response.wait();
  
      // query the logs for the FallbackCalled event
      const topic = faucet.interface.getEventTopic('FallbackCalled');
      const log = receipt.logs.find(x => x.topics.indexOf(topic) >= 0);
      const deployedEvent = faucet.interface.parseLog(log);
  
      assert(deployedEvent, "Expected the Fallback Called event to be emitted!");
    });
});
