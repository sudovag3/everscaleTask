import { expect } from "chai";
import { Contract, Signer, Address } from "locklift";
import { FactorySource } from "../build/factorySource";
import { zeroAddress } from 'locklift';
import {BigNumber} from 'bignumber.js'

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
    it("Deploy bridge contract", async function () {
      const { contract } = await locklift.factory.deployContract({
        contract: "Bridge",
        publicKey: signer.publicKey,
        initParams: {
          randomNonce_: locklift.utils.getRandomNonce(),
        },
        constructorParams: {
        },
        value: locklift.utils.toNano(2),
      });
      bridge = contract;
      console.log(`Account - ${bridge.address}`);
    });
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
        value: locklift.utils.toNano(2),
      });
      account = contract;
      console.log(`Account - ${account.address}`);
    });

    it("Deploy token A contract", async function () {
      //новый аналог .code
      const walletCode = await locklift.factory.getContractArtifacts("TokenWallet");
      //беру тестовые названия токенов
      let tokenData = Constants.tokens.foo;

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
          initialSupplyTo: new Address(zeroAddress),
          initialSupply: '1000000',
          deployWalletValue: '0',
          mintDisabled: false,
          burnByRootDisabled: true,
          burnPaused: true,
          remainingGasTo: new Address(zeroAddress)
        },
        value: locklift.utils.toNano(2),
      });
      tokenA = contract;
      console.log(`Token A - ${tokenA.address}`);
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
          initialSupplyTo: new Address(zeroAddress),
          initialSupply: '1000000',
          deployWalletValue: '0',
          mintDisabled: false,
          burnByRootDisabled: true,
          burnPaused: true,
          remainingGasTo: new Address(zeroAddress)
        },
        value: locklift.utils.toNano(2),
      });
      tokenB = contract;
      console.log(`Token B - ${tokenB.address}`);
    });

    it("mint token A for account", async function () {

      // Вот здесь сейчас тупик
      // Застрял на том, чтобы вызвать функцию mint в контракте tokenA

      /*
      Это из доки уже не работает(((((

      await rootOwner.runTarget({
      contract: tokenRoot,
      method: 'mint',
      params: {
        amount: amount,
        recipient: account.address,
        deployWalletValue: locklift.utils.convertCrystal(0.2, 'nano'),
        remainingGasTo: rootOwner.address,
        notify: false,
        payload: EMPTY_TVM_CELL
      },
      value: locklift.utils.convertCrystal(0.5, 'nano'),
      keyPair
      });
      */
      
      //Пошел более правильным путём
      const mint =  
      {
        amount: 1100,
        token: 'foo'
      };
      const token = Constants.tokens['foo'];
      const amount = new BigNumber(mint.amount).shiftedBy(token.decimals).toFixed();
      const accountFactory = locklift.factory.getAccountsFactory("Wallet");

      const rootOwner = accountFactory.getAccount(account.address, signer.publicKey);
      
    
    const txTarget = await rootOwner.runTarget({
        contract: tokenA,
        value: locklift.utils.toNano(2.2)
        },
        root =>
          root.methods.mint({ 
            amount: amount, 
            recipient: rootOwner.address, 
            deployWalletValue: locklift.utils.toNano(1), 
            remainingGasTo: rootOwner.address, 
            notify: true, 
            payload: EMPTY_TVM_CELL, 
            }),
        );
        
      //увы и ах

      // const wallet = await tokenA.methods.deployWallet({
      //   answerId: 1, 
      //   walletOwner: account.address,
      //   deployWalletValue: locklift.utils.toNano(0.5)
      // }).call();
      // const walletContract = await locklift.factory.getDeployedContract("TokenWallet", wallet.tokenWallet);
      // console.log(walletContract);
      
      // const walletContract = await locklift.factory.getDeployedContract("TokenWallet", wallet.tokenWallet);
      // const walletTokenBalance = await walletContract.methods.balance({answerId: 0}).call();
      // console.log(`walletTokenBalane = ${walletTokenBalance}`);
      
      // const transaction = await locklift.transactions.waitFinalized(tokenA.methods.deployWallet({
      //   answerId: 1, 
      //   walletOwner: account.address,
      //   deployWalletValue: '0'
      // }))

      // console.log(wallet.tokenWallet);

        // const txTarget = await rootOwner.runTarget({
        //   contract: tokenA,
        //   value: locklift.utils.toNano(2.2),
        //   method: 'ming',
        //   params: {
        //     amount: amount,
        //     recipient: wallet.tokenWallet,
        //     deployWalletValue: locklift.utils.toNano(1),
        //     remainingGasTo: rootOwner.address,
        //     notify: true,
        //     payload: EMPTY_TVM_CELL
        //   }
        //   });  

      // const tx = await tokenA.methods.mint({
      //   amount: amount,
      //   recipient: wallet.tokenWallet,
      //   deployWalletValue: locklift.utils.toNano(0.1),
      //   remainingGasTo: wallet.tokenWallet,
      //   notify: true,
      //   payload: EMPTY_TVM_CELL
      // }).sendExternal({ publicKey: signer.publicKey});
      
      // console.log(tx);
      
      // const walletContract = await locklift.factory.getDeployedContract("TokenWallet", wallet.tokenWallet);
      // const walletTokenBalance = await walletContract.methods.balance({answerId: 0}).sendExternal({ publicKey: signer.publicKey});


      // const userBalance = await locklift.provider.getBalance(account.address);
      // const walletBalance = await locklift.provider.getBalance(wallet.tokenWallet);

      // console.log(`balance = ${userBalance} - ${walletBalance} - ${walletTokenBalance.transaction.}`);

      // await account.runTarget({
      //   contract: tokenA,
      //   method: 'mint',
      //   params: {
      //     amount: amount,
      //     recipient: account.address,
      //     deployWalletValue: locklift.utils.toNano(2),
      //     remainingGasTo: account.address,
      //     notify: false,
      //     payload: EMPTY_TVM_CELL
      //   },
      //   value: locklift.utils.toNano(0.5),
      //   keypat
      // });
    });

    it("Interact with contract", async function () {
      const NEW_STATE = 1;

      console.log('Hello');
    });
  });
});
