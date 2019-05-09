pragma solidity ^0.5.8;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract TokenBasic is ERC20 {
    constructor(uint256 totalSupply) public {
        _mint(msg.sender, totalSupply);
    }
}
