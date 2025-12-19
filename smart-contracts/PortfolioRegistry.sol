// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Portfolio Verification Registry
/// @notice Stores hashes of user portfolios to prove data integrity over time
contract PortfolioRegistry {
    
    struct PortfolioSnapshot {
        string ipfsHash;      // Link to the actual JSON data on IPFS
        bytes32 dataHash;     // Cryptographic hash of the portfolio content
        uint256 timestamp;    // When this snapshot was taken
        uint256 totalValue;   // Total AUM at that moment
    }

    // Mapping from User Wallet -> List of Snapshots
    mapping(address => PortfolioSnapshot[]) public userPortfolios;

    event PortfolioRecorded(address indexed user, uint256 timestamp, bytes32 dataHash);

    /// @notice Record a portfolio snapshot on-chain
    /// @param _ipfsHash The CID from IPFS where data is stored
    /// @param _dataHash The sha256 hash of the portfolio JSON
    /// @param _totalValue The current value of the portfolio in INR/USD
    function recordSnapshot(string memory _ipfsHash, bytes32 _dataHash, uint256 _totalValue) public {
        PortfolioSnapshot memory newSnapshot = PortfolioSnapshot({
            ipfsHash: _ipfsHash,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            totalValue: _totalValue
        });

        userPortfolios[msg.sender].push(newSnapshot);
        emit PortfolioRecorded(msg.sender, block.timestamp, _dataHash);
    }

    /// @notice Verify if a specific hash exists for a user (Proof of History)
    function verifySnapshot(address _user, bytes32 _hashToVerify) public view returns (bool) {
        PortfolioSnapshot[] memory history = userPortfolios[_user];
        for(uint i = 0; i < history.length; i++) {
            if(history[i].dataHash == _hashToVerify) {
                return true;
            }
        }
        return false;
    }

    function getSnapshotCount(address _user) public view returns (uint256) {
        return userPortfolios[_user].length;
    }
}