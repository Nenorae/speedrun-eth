// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";

contract Vendor is Ownable {
    YourToken public yourToken;
    uint256 public constant tokensPerEth = 100;

    event BuyTokens(address indexed buyer, uint256 amountOfETH, uint256 amountOfTokens);
    event SellTokens(address indexed seller, uint256 amountOfTokens, uint256 amountOfETH);
    event Withdraw(address indexed owner, uint256 amount);

    // Konstruktor yang memanggil Ownable dengan msg.sender sebagai initialOwner
    constructor(address tokenAddress) Ownable(msg.sender){
        yourToken = YourToken(tokenAddress);
    }

    function buyTokens() external payable {
        require(msg.value > 0, "send ETH to buy token");

        uint256 amountToBuy = msg.value * tokensPerEth;
        require(yourToken.balanceOf(address(this)) >= amountToBuy, "vendor has insufficient tokens");

        yourToken.transfer(msg.sender, amountToBuy);
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
    }

    function sellTokens(uint256 _amount) external {
        require(_amount > 0, "specify an amount of tokens to sell");
        require(yourToken.balanceOf(msg.sender) >= _amount, "insufficient token balance");

        uint256 ethAmount = _amount / tokensPerEth;
        require(address(this).balance >= ethAmount, "vendor has insufficient ETH");

        yourToken.transferFrom(msg.sender, address(this), _amount);
        (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
        require(success, "eth transfer failed");

        emit SellTokens(msg.sender, _amount, ethAmount);
    }

    // Fungsi untuk menarik ETH dari kontrak (hanya pemilik)
    function withdraw() external onlyOwner {
       uint256 contractBalance = address(this).balance;
    require(contractBalance > 0, "No ETH to withdraw");

    (bool success, ) = msg.sender.call{value: contractBalance}("");
    require(success, "ETH transfer failed");

    emit Withdraw(msg.sender, contractBalance);
    }

    // Fungsi untuk kontrak menerima ETH
    receive() external payable {}
}
