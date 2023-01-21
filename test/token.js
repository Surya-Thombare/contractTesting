const {expect} =  require("chai")


describe("Token contract", () => {

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async () => {
        Token =  await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        it("Deployment should assign total supply to owner", async () => {
            const ownerBalance =  await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    
        })
    })

    describe("transaction", () => {
        it("Should transfer token b/w accounts", async () => {
            await hardhatToken.transfer(addr1.address, 10);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

            await hardhatToken.connect(addr1).transfer(addr2.address,5);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
            
        })

        it("Should fail if sender does not have enough tokens",async () => {
            const initialOwnerBalance =  await hardhatToken.balanceOf(owner.address);

            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not enough tokens")

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);

        })

        it("should update balances after transfers",async () => {
            const initialOwnerBalance =  await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 5);
            await hardhatToken.transfer(addr2.address,10);

            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 15);

            const addr1balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1balance).to.equal(5);

            const addr2balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2balance).to.equal(10);
        })
    })
})