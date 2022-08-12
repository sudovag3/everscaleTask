pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
// import { IAcceptTokensTransferCallback }; 
// Решение тестового задания для EverScale
import "broxus-ton-tokens-contracts/contracts/libraries/TokenMsgFlag.sol";
import 'broxus-ton-tokens-contracts/contracts/interfaces/IAcceptTokensTransferCallback.sol';
import 'broxus-ton-tokens-contracts/contracts/interfaces/ITokenRoot.sol';

library BridgeContractErrors {
  uint8 constant error_tvm_pubkey_not_set = 100;
  uint8 constant error_message_sender_is_not_my_owner = 101;
  uint8 constant error_message_internal_transfer_bad_sender = 105;
}

/* отдельный интерфейс не нужен, можно использовать https://github.com/broxus/tip3/blob/master/contracts/interfaces/IAcceptTokensTransferCallback.sol подключив эту репу как github зависимость в npm */

//Инициализируем контракт
contract Bridge is IAcceptTokensTransferCallback {
    /*стоит добавить static nonce и проставлять его случайным образом, чтобы при деплое контракт попадал на разные адреса, т к значения static влияют на адрес*/
    uint256 static randomNonce_;
    //Так как по заданию контракт "будет принимать токены А", значит для их баланса нужна отдельная переменная
    uint128 public total_supply;

    /*тут проблема курицы и яйца, с одной стороны мы могли бы передать это как static переменную или параметр конструктора, но тогда такой адрес нам должен быть заранее известен, а значит tokenRoot задеплоен.
      Вот только mint может вызывать только владелец, а значит в скрипте нужно передать владельца TokenRoot */

    //Вот тут сложнее. Нам нужно в дальнейшем вызывать функцию mint() у контракта токенов, которые хотим получить. 
    //Следовательно нам для этого нужен по крайней мере адресс контракта токена B  
    address public TOKEN_B_ADDRESS;
    /*этот адрес контракт должен узнать у TokenRoot в конструкторе вызвав ITokenRoot.deployWallet и приняв ответ в каллбэке */
    //А это адресс токен-кошелька контракта, с которым мы будем сверять адрес отправителя callback-а 
    address public tokenRootMaster;



    constructor() public {
        /*в целом тут не нужна такая проверка, так как далее ключ не будет использоваться для управления контрактом*/
        //Проверяем наличие пабКея и его валидность
        // require(tvm.pubkey() != 0, BridgeContractErrors.error_tvm_pubkey_not_set);
        // require(msg.pubkey() == tvm.pubkey(), 102);

        /*тут верно, так как деплой внешним сообщением*/
        //Даём "Добро" на оплату транзакций
        tvm.accept();

        // address walletAdrress = ITokenRoot(TOKEN_A_ADDRESS).deployWallet
        // {
        //     flag: TokenMsgFlag.SENDER_PAYS_FEES
        // }
        //     (
        //     address(this),
        //     0
        //     );
        // tokenRootMaster = walletAddress
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
        require(msg.sender == tokenRootMaster && msg.sender == tokenRoot, BridgeContractErrors.error_message_internal_transfer_bad_sender);
        
        //Прибавляем себе баланс в размере указанного эмаунта
        total_supply += amount; 

        /* все так, только флаги нужны к вызову */
        //Вообще не уверен над реализацией...
        //Вызываем функцию mint в контракте токена B 
        ITokenRoot(TOKEN_B_ADDRESS).mint{
            flag: TokenMsgFlag.SENDER_PAYS_FEES
        }(amount, senderWallet, 0, address(this), false, payload);

    }
}
