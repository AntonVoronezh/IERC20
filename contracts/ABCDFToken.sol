ABCDFToken// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./ERC20Burnable.sol";

contract ABCDFToken is ERC20, ERC20Burnable {
    address owner;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    constructor(address _initialOwner) ERC20("ABCDFToken", "ABCDF") {
        owner = _initialOwner;
        _mint(msg.sender, 5 * 10 ** decimals());
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
