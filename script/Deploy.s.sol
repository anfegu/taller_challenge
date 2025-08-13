// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/Proposals.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Proposals proposals = new Proposals();

        vm.stopBroadcast();

        console.log("Proposals contract deployed to:", address(proposals));
        console.log("Deployer account:", vm.addr(deployerPrivateKey));
    }
}
