// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Sampatti AI Token (SAM)
/// @notice Represents loyalty rewards or fractionalized index units for the Sampatti Ecosystem
/// @dev Standard ERC20 with minting capabilities restricted to the owner (The Fund House)
contract SampattiToken is ERC20, Ownable {
    
    // Event to log when tokens are issued as rewards
    event RewardIssued(address indexed user, uint256 amount);

    constructor(address initialOwner) 
        ERC20("Sampatti AI Token", "SAM") 
        Ownable(initialOwner) 
    {
        // Mint initial supply to the treasury (1 Million Tokens)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @notice Airdrop tokens to users based on app usage or successful predictions
    /// @param to The user's wallet address
    /// @param amount The amount of tokens to mint
    function rewardUser(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit RewardIssued(to, amount);
    }

    /// @notice Burn tokens to redeem premium AI features
    function burnForPremiumAccess(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}