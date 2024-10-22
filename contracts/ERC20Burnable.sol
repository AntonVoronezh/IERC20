// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

abstract contract ERC20Burnable is ERC20 {

    function burn(uint256 _value) public virtual {
        _burn(msg.sender, _value);
    }

    function burnFrom(address _account, uint256 _value) public virtual {
        _spendAllowance(_account, msg.sender, _value);
        _burn(_account, _value);
    }
}
