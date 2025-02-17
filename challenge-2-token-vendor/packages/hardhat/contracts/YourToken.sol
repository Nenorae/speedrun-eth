pragma solidity 0.8.20; //Do not change the solidity version as it negatively impacts submission grading
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// learn more: https://docs.openzeppelin.com/contracts/4.x/erc20

contract YourToken is ERC20, Ownable {
    constructor() ERC20("Gold", "GLD") Ownable(msg.sender) {
        //_mint( ~~~YOUR FRONTEND ADDRESS HERE~~~~ , 1000 * 10 ** 18);
        _mint(msg.sender, 100000 * 10 ** 18);
    }

    // Fungsi mint yang hanya bisa dipanggil oleh pemilik kontrak
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount); // Fungsi mint untuk mencetak token ke alamat yang dituju
    }

}
