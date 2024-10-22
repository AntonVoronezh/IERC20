// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";


contract TokenExchange {
    IERC20 token;
    address owner;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }

    function buy() pubic payable {
        uint amount  = msg.value; // wei

        require(amount >= 1);

        uint currentBalance = token.balanceOf(address(this));

        require(currentBalance >= amount);

        token.transfer(msg.sender, amount);
    }
}
