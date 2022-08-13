import { expect } from "chai";
import { Contract, Signer, Address } from "locklift";
import { FactorySource } from "../build/factorySource";
import { zeroAddress } from 'locklift';
import {BigNumber} from 'bignumber.js'
import { log } from "console";

// Тут перечислены основные константы прямиком из utils.js Их по хорошему нужно отдельно вынести, но, думаю, для тестового задания, не критично
const EMPTY_TVM_CELL = 'te6ccgEBAQEAAgAAAA==';
const Constants = {
  tokens: {
    foo: {
      name: 'Foo',
      symbol: 'Foo',
      decimals: 6,
      upgradeable: true
    },
    wever: {
      name: 'Wrapped EVER',
      symbol: 'WEVER',
      decimals: 9,
      upgradeable: true
    }
  },
  LP_DECIMALS: 9,

  TESTS_TIMEOUT: 1200000
}

//Объявляю основные контракты
let bridge: Contract<FactorySource["Bridge"]>;
let account: Contract<FactorySource["Wallet"]>;
let tokenA: Contract<FactorySource["TokenRoot"]>;
let tokenB: Contract<FactorySource["TokenRoot"]>;

let accountWallet: Contract<FactorySource["TokenWallet"]>;
let signer: Signer;

describe("Test Bridge contract", async function () {
  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
  });
  //Это тест из примера Locklift
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const bridgeData = await locklift.factory.getContractArtifacts("Bridge");
      
      expect(bridgeData.code).not.to.equal(undefined, "Code should be available");
      expect(bridgeData.abi).not.to.equal(undefined, "ABI should be available");
      expect(bridgeData.tvc).not.to.equal(undefined, "tvc should be available");
    });
    //Тут все ок, отрабатывает без замечаний, пока не разбирался с внутренними переменными

    //Аналогично
    it("Deploy account contract", async function () {
      const { contract } = await locklift.factory.deployContract({
        contract: "Wallet",
        publicKey: signer.publicKey,
        initParams: {
          _randomNonce: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
        },
        value: locklift.utils.toNano(50),
      });
      account = contract;
      console.log(`Account - ${account.address}`);
    });

    it("Deploy token A contract", async function () {
      //новый аналог .code
      const walletCode = await locklift.factory.getContractArtifacts("TokenWallet");
      //беру тестовые названия токенов
      let tokenData = Constants.tokens.foo;

      let { contract } = await locklift.tracing.trace(locklift.factory.deployContract({
        contract: "TokenRoot",
        publicKey: signer.publicKey,
        initParams: {
          randomNonce_: locklift.utils.getRandomNonce(),
          deployer_: new Address(zeroAddress),
          name_: tokenData.name,
          symbol_: tokenData.symbol,
          decimals_: tokenData.decimals,
          walletCode_: walletCode.code,
          rootOwner_: account.address
        },
        constructorParams: {
          initialSupplyTo: account.address,
          initialSupply: locklift.utils.toNano(8),
          deployWalletValue: locklift.utils.toNano(0.5),
          mintDisabled: false,
          burnByRootDisabled: true,
          burnPaused: true,
          remainingGasTo: new Address(zeroAddress)
        },
        value: locklift.utils.toNano(10),
      }));
      tokenA = contract;
      console.log(`Token A - ${tokenA.address}`);
      expect(await locklift.provider.getFullContractState({ address: tokenA.address }).then(res => res.state?.isDeployed)).to.be.true;
    });

    it("Deploy token B contract", async function () {
      const walletCode = await locklift.factory.getContractArtifacts("TokenWallet");

      let tokenData = Constants.tokens.wever;

      let { contract } = await locklift.factory.deployContract({
        contract: "TokenRoot",
        publicKey: signer.publicKey,
        initParams: {
          randomNonce_: locklift.utils.getRandomNonce(),
          deployer_: new Address(zeroAddress),
          name_: tokenData.name,
          symbol_: tokenData.symbol,
          decimals_: tokenData.decimals,
          walletCode_: walletCode.code,
          rootOwner_: account.address
        },
        constructorParams: {
          initialSupplyTo: account.address,
          initialSupply: locklift.utils.toNano(8),
          deployWalletValue: locklift.utils.toNano(1.5),
          mintDisabled: false,
          burnByRootDisabled: true,
          burnPaused: true,
          remainingGasTo: new Address(zeroAddress)
        },
        value: locklift.utils.toNano(10),
      });
      tokenB = contract;
      console.log(`Token B - ${tokenB.address}`);
      expect(await locklift.provider.getFullContractState({ address: tokenB.address }).then(res => res.state?.isDeployed)).to.be.true;

    });

    it("Deploy bridge contract", async function () {
      const accountwalletB = await tokenB.methods.walletOf({answerId: 1,walletOwner: account.address}).call();
      expect(await locklift.provider.getFullContractState({ address: accountwalletB.value0 }).then(res => res.state?.isDeployed)).to.be.true;
      const { contract } = await locklift.factory.deployContract({
        contract: "Bridge",
        publicKey: signer.publicKey,
        initParams: {
          randomNonce_: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
          tokenA: tokenA.address,
          tokenB: tokenB.address
        },
        value: locklift.utils.toNano(50),
      });
      bridge = contract;
      expect(await locklift.provider.getFullContractState({ address: bridge.address }).then(res => res.state?.isDeployed)).to.be.true;
      console.log(`Bridge - ${bridge.address}`);
    });

    it("mint token A for account", async function () {
    });

    it("SendTrasfer and check balances (In comming...)", async function () {

      const accountwallet = await tokenA.methods.walletOf({answerId: 1,walletOwner: account.address}).call();
      console.log(`Account Wallet = ${accountwallet.value0}`);
      const walletContract = await locklift.factory.getDeployedContract("TokenWallet", accountwallet.value0);
      let balance = await walletContract.methods.balance({answerId: 1}).call();
      expect(balance.value0).to.be.equal('8000000000');

      const accountwalletB = await tokenB.methods.walletOf({answerId: 1,walletOwner: account.address}).call();
      console.log(`Account Wallet B = ${accountwalletB.value0}`);
      const walletContractB = await locklift.factory.getDeployedContract("TokenWallet", accountwalletB.value0);
      let balanceb = await walletContractB.methods.balance({answerId: 1}).call();
      expect(balanceb.value0).to.be.equal('8000000000');
  

      const accountFactory = locklift.factory.getAccountsFactory("Wallet");
      const rootOwner = accountFactory.getAccount(account.address, signer.publicKey);

      await locklift.tracing.trace(rootOwner.runTarget({contract: walletContract, value: locklift.utils.toNano(7), bounce: false, flags: 0}, contract => 
       contract.methods.transfer({
          recipient: bridge.address,
          amount: "10000",
          notify: true,
          deployWalletValue: "0",
          remainingGasTo: walletContract.address,
          payload: ""
        })))

      balance = await walletContract.methods.balance({answerId: 1}).call();
      expect(balance.value0).to.be.equal('7999990000');
      balanceb = await walletContractB.methods.balance({answerId: 1}).call();
      expect(balance.value0).to.be.equal('8000010000');

      });
    
      const NEW_STATE = 1;
    });
  });
