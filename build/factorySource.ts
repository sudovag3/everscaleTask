const bridgeAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[],"outputs":[]},{"name":"onAcceptTokensTransfer","inputs":[{"name":"tokenRoot","type":"address"},{"name":"amount","type":"uint128"},{"name":"sender","type":"address"},{"name":"senderWallet","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"total_supply","inputs":[],"outputs":[{"name":"total_supply","type":"uint128"}]},{"name":"TOKEN_B_ADDRESS","inputs":[],"outputs":[{"name":"TOKEN_B_ADDRESS","type":"address"}]},{"name":"tokenRootMaster","inputs":[],"outputs":[{"name":"tokenRootMaster","type":"address"}]}],"data":[{"key":1,"name":"randomNonce_","type":"uint256"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"randomNonce_","type":"uint256"},{"name":"total_supply","type":"uint128"},{"name":"TOKEN_B_ADDRESS","type":"address"},{"name":"tokenRootMaster","type":"address"}]} as const
const sampleAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]},{"name":"onAcceptTokensTransfer","inputs":[{"name":"tokenRoot","type":"address"},{"name":"amount","type":"uint128"},{"name":"sender","type":"address"},{"name":"senderWallet","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"total_supply","inputs":[],"outputs":[{"name":"total_supply","type":"uint128"}]},{"name":"TOKEN_A_ADDRESS","inputs":[],"outputs":[{"name":"TOKEN_A_ADDRESS","type":"address"}]},{"name":"TOKEN_B_ADDRESS","inputs":[],"outputs":[{"name":"TOKEN_B_ADDRESS","type":"address"}]}],"data":[],"events":[{"name":"StateChange","inputs":[{"name":"_state","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"total_supply","type":"uint128"},{"name":"state","type":"uint256"},{"name":"TOKEN_A_ADDRESS","type":"address"},{"name":"TOKEN_B_ADDRESS","type":"address"}]} as const
const tokenRootAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"initialSupplyTo","type":"address"},{"name":"initialSupply","type":"uint128"},{"name":"deployWalletValue","type":"uint128"},{"name":"mintDisabled","type":"bool"},{"name":"burnByRootDisabled","type":"bool"},{"name":"burnPaused","type":"bool"},{"name":"remainingGasTo","type":"address"}],"outputs":[]},{"name":"supportsInterface","inputs":[{"name":"answerId","type":"uint32"},{"name":"interfaceID","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"disableMint","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"mintDisabled","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnTokens","inputs":[{"name":"amount","type":"uint128"},{"name":"walletOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"disableBurnByRoot","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnByRootDisabled","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"burnPaused","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"setBurnPaused","inputs":[{"name":"answerId","type":"uint32"},{"name":"paused","type":"bool"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"transferOwnership","inputs":[{"name":"newOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"components":[{"name":"value","type":"uint128"},{"name":"payload","type":"cell"}],"name":"callbacks","type":"map(address,tuple)"}],"outputs":[]},{"name":"name","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"string"}]},{"name":"symbol","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"string"}]},{"name":"decimals","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint8"}]},{"name":"totalSupply","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint128"}]},{"name":"walletCode","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"cell"}]},{"name":"rootOwner","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"walletOf","inputs":[{"name":"answerId","type":"uint32"},{"name":"walletOwner","type":"address"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"deployWallet","inputs":[{"name":"answerId","type":"uint32"},{"name":"walletOwner","type":"address"},{"name":"deployWalletValue","type":"uint128"}],"outputs":[{"name":"tokenWallet","type":"address"}]},{"name":"mint","inputs":[{"name":"amount","type":"uint128"},{"name":"recipient","type":"address"},{"name":"deployWalletValue","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptBurn","id":"0x192B51B1","inputs":[{"name":"amount","type":"uint128"},{"name":"walletOwner","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"sendSurplusGas","inputs":[{"name":"to","type":"address"}],"outputs":[]}],"data":[{"key":1,"name":"name_","type":"string"},{"key":2,"name":"symbol_","type":"string"},{"key":3,"name":"decimals_","type":"uint8"},{"key":4,"name":"rootOwner_","type":"address"},{"key":5,"name":"walletCode_","type":"cell"},{"key":6,"name":"randomNonce_","type":"uint256"},{"key":7,"name":"deployer_","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"name_","type":"string"},{"name":"symbol_","type":"string"},{"name":"decimals_","type":"uint8"},{"name":"rootOwner_","type":"address"},{"name":"walletCode_","type":"cell"},{"name":"totalSupply_","type":"uint128"},{"name":"burnPaused_","type":"bool"},{"name":"burnByRootDisabled_","type":"bool"},{"name":"mintDisabled_","type":"bool"},{"name":"randomNonce_","type":"uint256"},{"name":"deployer_","type":"address"}]} as const
const tokenWalletAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[],"outputs":[]},{"name":"supportsInterface","inputs":[{"name":"answerId","type":"uint32"},{"name":"interfaceID","type":"uint32"}],"outputs":[{"name":"value0","type":"bool"}]},{"name":"destroy","inputs":[{"name":"remainingGasTo","type":"address"}],"outputs":[]},{"name":"burnByRoot","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"burn","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"callbackTo","type":"address"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"balance","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint128"}]},{"name":"owner","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"root","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"walletCode","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"cell"}]},{"name":"transfer","inputs":[{"name":"amount","type":"uint128"},{"name":"recipient","type":"address"},{"name":"deployWalletValue","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"transferToWallet","inputs":[{"name":"amount","type":"uint128"},{"name":"recipientTokenWallet","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptTransfer","id":"0x67A0B95F","inputs":[{"name":"amount","type":"uint128"},{"name":"sender","type":"address"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"acceptMint","id":"0x4384F298","inputs":[{"name":"amount","type":"uint128"},{"name":"remainingGasTo","type":"address"},{"name":"notify","type":"bool"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"sendSurplusGas","inputs":[{"name":"to","type":"address"}],"outputs":[]}],"data":[{"key":1,"name":"root_","type":"address"},{"key":2,"name":"owner_","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"root_","type":"address"},{"name":"owner_","type":"address"},{"name":"balance_","type":"uint128"}]} as const
const walletAbi = {"ABIversion":2,"version":"2.2","header":["time"],"functions":[{"name":"sendTransaction","inputs":[{"name":"dest","type":"address"},{"name":"value","type":"uint128"},{"name":"bounce","type":"bool"},{"name":"flags","type":"uint8"},{"name":"payload","type":"cell"}],"outputs":[]},{"name":"transferOwnership","inputs":[{"name":"newOwner","type":"uint256"}],"outputs":[]},{"name":"constructor","inputs":[],"outputs":[]},{"name":"owner","inputs":[],"outputs":[{"name":"owner","type":"uint256"}]},{"name":"_randomNonce","inputs":[],"outputs":[{"name":"_randomNonce","type":"uint256"}]}],"data":[{"key":1,"name":"_randomNonce","type":"uint256"}],"events":[{"name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"uint256"},{"name":"newOwner","type":"uint256"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"owner","type":"uint256"},{"name":"_randomNonce","type":"uint256"}]} as const

export const factorySource = {
    Bridge: bridgeAbi,
    Sample: sampleAbi,
    TokenRoot: tokenRootAbi,
    TokenWallet: tokenWalletAbi,
    Wallet: walletAbi
} as const

export type FactorySource = typeof factorySource
export type BridgeAbi = typeof bridgeAbi
export type SampleAbi = typeof sampleAbi
export type TokenRootAbi = typeof tokenRootAbi
export type TokenWalletAbi = typeof tokenWalletAbi
export type WalletAbi = typeof walletAbi
