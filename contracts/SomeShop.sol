// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ABCDFToken.sol";

struct Item {
    uint256 price;
    uint256 quantity;
    string name;
    bool exists;
}

struct ItemInStock {
    bytes32 uid;
    uint256 price;
    uint256 quantity;
    string name;
}

struct BoughtItem {
    bytes32 uniqueId;
    uint256 numOfPurchasedItems;
    string deliveryAddress;
}

contract SomeShop {
    mapping(bytes32 => Item) public items;
    bytes32[] public uniqueIds;
    mapping(address => BoughtItem[]) public buyers;
    ABCDFToken public token;
    address owner;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    constructor(address _token) {
        token = ABCDFToken(_token);
        owner = msg.sender;
    }

    function addItem(uint _price, uint _quantity, string calldata _name)  external onlyOwner returns(bytes32 uid) {
        uid = keccak256(abi.encode(_price,_name ));

        items[uid] = Item({
            uid: uid,
            price: _price,
            quantity: _quantity,
            name: _name
        });

        uniqueIds.push(uid);
    }

    function buy(bytes32 _uid, uint _numOfItems, string calldata _address) external {
        Item storage itemToBuy = items[_uid];

        require(itemToBuy.exists);
        require(itemToBuy.quantity >= _numOfItems);

        uint totalPrice = _numOfItems * itemToBuy.price;

        token.transferFrom(msg.sender, address(this), totalPrice);

        itemToBuy.quantity -= _numOfItems;

        buyers[msg.sender] .push(
            BoughtItem({
                 uniqueId: _uid,
                 numOfPurchasedItems: _numOfItems,
                 deliveryAddress: _address
            })
        );
    }
}
