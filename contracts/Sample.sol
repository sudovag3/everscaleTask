pragma ever-solidity >= 0.61.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

interface ITokenRootContract {
  function deployEmptyWallet(
    uint256 _wallet_public_key,
    uint128 _deploy_evers
  ) external responsible returns(address);

  function mint(
    address to,
    uint128 tokens
  ) external;

  function deployWalletWithBalance(
    uint256 _wallet_public_key,
    uint128 _deploy_evers,
    uint128 _tokens
  ) external returns ( address );
}


library BridgeContractErrors {
  uint8 constant error_tvm_pubkey_not_set = 100;
  uint8 constant error_message_sender_is_not_my_owner = 101;
  uint8 constant error_message_transfer_not_enough_balance = 102;
  uint8 constant error_message_transfer_wrong_recipient = 103;
  uint8 constant error_message_transfer_low_message_value = 104;
  uint8 constant error_message_internal_transfer_bad_sender = 105;
  uint8 constant error_message_transfer_balance_too_low = 106;
}

interface IBridge {
    
}

contract Bridge is IBridge {
    uint128 public total_supply;
    uint state;
    address public TOKEN_A_ADDRESS;
    address public TOKEN_B_ADDRESS;

    event StateChange(uint _state);

    constructor(uint _state) public {
    require(tvm.pubkey() != 0, BridgeContractErrors.error_tvm_pubkey_not_set);
    tvm.accept();
    }
    


    function onAcceptTokensTransfer(address tokenRoot,
        uint128 amount,
        address sender,
        address senderWallet,
        address remainingGasTo,
        TvmCell payload
    ) external 
    {
        require(msg.sender == sender, BridgeContractErrors.error_message_internal_transfer_bad_sender);
        total_supply += amount; 

        ITokenRootContract(TOKEN_B_ADDRESS).mint(sender, amount);

    }
}
