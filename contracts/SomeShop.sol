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

    function addItem(uint _price, uint _quantity, string calldata _name)  external onlyOwner returns(bytes32) {
        bytes32 uid = keccak256(abi.encode(_price, _name));

        items[uid] = Item({
            price: _price,
            quantity: _quantity,
            name: _name,
            exists: true
        });

        uniqueIds.push(uid);

        return uid;
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

    function availableItems(uint _page, uint _count)  external view returns(ItemInStock[] memory) {
        require(_page > 0 && _count > 0);

        uint totalItems = uniqueIds.length;

        ItemInStock[] memory stockItems = new ItemInStock[](_count);

        uint counter;

        for(uint i = _count * _page - _count; i < _count * _page; ++i) {
            if(i >= totalItems) {
                break;
            }

            bytes32 currenId = uniqueIds[i];
            Item storage currentItem = items[currenId];

            stockItems[counter] = ItemInStock({
                uid: currenId,
                price: currentItem.price,
                quantity: currentItem.quantity,
                name: currentItem.name
            });

            counter++;
        }

        return stockItems;
    }
}
