// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Crypto SIP Vault
/// @notice Simulates an ELSS (Tax Saver) fund where funds are locked for a duration
contract SIPVault {
    
    struct SIP {
        uint256 amount;
        uint256 depositTime;
        uint256 lockPeriod; // In seconds
        bool withdrawn;
    }

    mapping(address => SIP[]) public investments;

    event Deposit(address indexed user, uint256 amount, uint256 lockTime);
    event Withdrawal(address indexed user, uint256 amount, uint256 reward);

    /// @notice Deposit funds into a smart SIP
    /// @param _lockSeconds Duration to lock funds (e.g., 3 years = 94608000)
    function depositSIP(uint256 _lockSeconds) public payable {
        require(msg.value > 0, "Investment must be greater than 0");

        investments[msg.sender].push(SIP({
            amount: msg.value,
            depositTime: block.timestamp,
            lockPeriod: _lockSeconds,
            withdrawn: false
        }));

        emit Deposit(msg.sender, msg.value, block.timestamp + _lockSeconds);
    }

    /// @notice Withdraw a specific SIP index if lock-in period is over
    /// @param _index The index of the SIP in the user's array
    function withdrawSIP(uint256 _index) public {
        require(_index < investments[msg.sender].length, "Invalid SIP index");
        SIP storage userSIP = investments[msg.sender][_index];

        require(!userSIP.withdrawn, "Already withdrawn");
        require(block.timestamp >= userSIP.depositTime + userSIP.lockPeriod, "Funds are still in lock-in period");

        userSIP.withdrawn = true;
        
        // Simulating a 5% "Smart Contract Yield" reward (Mock Logic)
        uint256 reward = (userSIP.amount * 5) / 100;
        uint256 totalPayout = userSIP.amount + reward;

        // Ensure contract has enough funds for reward, else just return principal
        if (address(this).balance < totalPayout) {
            totalPayout = userSIP.amount;
        }

        payable(msg.sender).transfer(totalPayout);
        emit Withdrawal(msg.sender, userSIP.amount, totalPayout - userSIP.amount);
    }

    // Allow contract to receive funds for rewards pool
    receive() external payable {}
}