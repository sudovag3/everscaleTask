pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
import "locklift/src/console.sol";
// import { IAcceptTokensTransferCallback }; 
// Решение тестового задания для EverScale
import "broxus-ton-tokens-contracts/contracts/libraries/TokenMsgFlag.sol";
import 'broxus-ton-tokens-contracts/contracts/interfaces/IAcceptTokensTransferCallback.sol';
import 'broxus-ton-tokens-contracts/contracts/interfaces/ITokenRoot.sol';

library BridgeContractErrors {
  uint8 constant error_tvm_pubkey_not_set = 100;
  uint8 constant error_message_sender_is_not_my_owner = 101;
  uint8 constant error_message_sender_is_not_token_root = 104;
  uint8 constant error_message_internal_transfer_bad_sender = 105;
}

/* отдельный интерфейс не нужен, можно использовать https://github.com/broxus/tip3/blob/master/contracts/interfaces/IAcceptTokensTransferCallback.sol подключив эту репу как github зависимость в npm */

//Инициализируем контракт
contract Bridge is IAcceptTokensTransferCallback {
    /*стоит добавить static nonce и проставлять его случайным образом, чтобы при деплое контракт попадал на разные адреса, т к значения static влияют на адрес*/
    uint256 static randomNonce_;

    /*тут проблема курицы и яйца, с одной стороны мы могли бы передать это как static переменную или параметр конструктора, но тогда такой адрес нам должен быть заранее известен, а значит tokenRoot задеплоен.
      Вот только mint может вызывать только владелец, а значит в скрипте нужно передать владельца TokenRoot */

    //Вот тут сложнее. Нам нужно в дальнейшем вызывать функцию mint() у контракта токенов, которые хотим получить. 
    //Следовательно нам для этого нужен по крайней мере адресс контракта токена B  
    address public TOKEN_B_ADDRESS;
    address public TOKEN_A_ADDRESS;
    address public walletB;
    /*этот адрес контракт должен узнать у TokenRoot в конструкторе вызвав ITokenRoot.deployWallet и приняв ответ в каллбэке */
    //А это адресс токен-кошелька контракта, с которым мы будем сверять адрес отправителя callback-а 
    address public tokenRootMaster;




    constructor(address tokenA) public {
        /*в целом тут не нужна такая проверка, так как далее ключ не будет использоваться для управления контрактом*/
        //Проверяем наличие пабКея и его валидность
        require(tvm.pubkey() != 0, BridgeContractErrors.error_tvm_pubkey_not_set);
        TOKEN_A_ADDRESS = tokenA;
        // TOKEN_B_ADDRESS = tokenB;
        /*тут верно, так как деплой внешним сообщением*/
        //Даём "Добро" на оплату транзакций
        tvm.accept();

        ITokenRoot(TOKEN_A_ADDRESS).deployWallet
        {   
            value: 10000000000,
            flag: TokenMsgFlag.SENDER_PAYS_FEES,
            callback: onGetDeployedA
        }
            (
            address(this),
            10000000
            );
  
    }

    modifier onlyOwner() {
        require(tvm.pubkey() != 0 && tvm.pubkey() == msg.pubkey(), BridgeContractErrors.error_message_sender_is_not_my_owner);
    _;
  }

    function onGetDeployedA(
    address _address
    ) public {
        require(msg.sender == TOKEN_A_ADDRESS, BridgeContractErrors.error_message_sender_is_not_token_root);
        tokenRootMaster = _address;
    }

    function setTokenRootB(address tokenB) public onlyOwner {
    tvm.accept();
    TOKEN_B_ADDRESS = tokenB;
    }

    //Вот и главный герой
    //Исходя из требований по заданию все параметры и названия взял из интерфейса
    function onAcceptTokensTransfer(
        address tokenRoot,
        uint128 amount,
        address sender,
        address senderWallet,
        address remainingGasTo,
        TvmCell payload
    ) override external 
    {   
        //Сомневаюсь в правильности проверки, объясню:
        // 1) Мы проверяем, что колбэк отправлен с того же контракта, который был указан при создании нашего контракта (msg.sender == tokenRootMaster)
        // 2) Мы проверяем, что данные с колбэка соответсвуют данным с нашего контракта (msg.sender == tokenRoot)
        require(msg.sender == tokenRootMaster, BridgeContractErrors.error_message_internal_transfer_bad_sender);
        
        /* все так, только флаги нужны к вызову */
        //Вообще не уверен над реализацией...
        //Вызываем функцию mint в контракте токена B 

        ITokenRoot(TOKEN_B_ADDRESS).mint{
            flag: 0,
            value: 1 ton
         }(amount, sender, 0, address(this), true, payload);

    }
}
