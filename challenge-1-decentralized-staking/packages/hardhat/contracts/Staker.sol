// SPDX-License-Identifier: MIT
pragma solidity 0.8.20; // Solidity versi tetap 0.8.20

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;

    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public immutable deadline;
    bool public completed = false;

    event Stake(address indexed staker, uint256 amount);
    event Executed(uint256 contractBalance);
    event Withdraw(address indexed staker, uint256 amount);

    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
        deadline = block.timestamp + 72 hours; // Gunakan immutable variable
    }

    function stake() public payable {
        require(block.timestamp < deadline, "Staking period has ended!"); // Tambahkan validasi waktu
        require(msg.value > 0, "You need to stake some ETH!");
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    function execute() public {
        require(block.timestamp >= deadline, "Deadline has not been reached yet");
        require(!completed, "Contract already executed!");

        if (address(this).balance >= threshold) {
            exampleExternalContract.complete{value: address(this).balance}();
            completed = true;
            emit Executed(address(this).balance);
        }
    }

    function withdraw() public {
        require(block.timestamp >= deadline, "Deadline has not been reached yet");
        require(address(this).balance < threshold, "Threshold has been met!");

        uint256 userBalance = balances[msg.sender];
        require(userBalance > 0, "No balance to withdraw!");

        balances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: userBalance}("");
        require(success, "Withdrawal failed!");
        
        emit Withdraw(msg.sender, userBalance);
    }

    function timeLeft() public view returns (uint256) {
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }

    receive() external payable {
        require(block.timestamp < deadline, "Staking period has ended!"); // Tambahkan validasi waktu
        stake();
    }
}
