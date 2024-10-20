// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {CourseOwnership} from "../src/CourseOwnership.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployCourseOwnership is Script {
    function run() external returns (CourseOwnership, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        (
            uint256 chainId,
            string memory rpcUrl,
            uint256 deployerPrivateKey
        ) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerPrivateKey);
        CourseOwnership courseOwnership = new CourseOwnership();
        vm.stopBroadcast();
        return (courseOwnership, helperConfig);
    }
}
