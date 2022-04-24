require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('@openzeppelin/hardhat-upgrades');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
	console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
//defaultNetwork: "polygon_mumbai",
module.exports = {
	defaultNetwork: "polygon_mumbai",
	solidity: {
		version: "0.8.4",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	
	networks: {
		hardhat: {
			chainId: 1337
		},
        polygon_mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
            accounts: [process.env.PRIVATE_KEY]
        }
	},
	gasReporter: {
		enabled:true,
		currency:"USD"
	},
	etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGON_KEY
        }
	}
};
