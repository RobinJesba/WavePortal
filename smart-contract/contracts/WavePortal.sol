// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    // auto initialized with zero
    uint256 totalWaves;
    address[] peopleWaved;

    constructor() {
        console.log("Smart Contract Constructor");
    }

    function wave() public {
        totalWaves += 1;
        // msg.sender -> wallet address of the sender who called the function
        console.log("%s has waved!",msg.sender);
        peopleWaved.push(msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getPeopleWaved() public view returns (address[] memory) {
        console.log("People who waved:");
        for(uint i=0; i<peopleWaved.length; i++)
            console.log(peopleWaved[i]);
        return peopleWaved;
    }
}