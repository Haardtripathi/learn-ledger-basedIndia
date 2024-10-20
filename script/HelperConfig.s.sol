// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 chainId;
        string rpcUrl;
        uint256 deployerPrivateKey;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 84532) {
            activeNetworkConfig = getBaseSepoliaTestnetConfig();
        } else if (block.chainid == 8453) {
            activeNetworkConfig = getBaseConfig();
        } else {
            activeNetworkConfig = getLocalConfig();
        }
    }

    function getBaseSepoliaTestnetConfig()
        public
        view
        returns (NetworkConfig memory)
    {
        return
            NetworkConfig({
                chainId: 84532,
                rpcUrl: "https://sepolia.base.org",
                deployerPrivateKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getBaseConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                chainId: 8453,
                rpcUrl: "https://mainnet.base.org",
                deployerPrivateKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getLocalConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                chainId: 31337,
                rpcUrl: "http://127.0.0.1:8545",
                deployerPrivateKey: vm.envUint("PRIVATE_KEY")
            });
    }
}
