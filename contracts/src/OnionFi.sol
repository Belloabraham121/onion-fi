// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OnionFi
 * @dev DeFi protocol that allows users to deposit ERC20 tokens and uses AI to optimize investments
 */
contract OnionFi is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    event InvestmentMade(
        address indexed user,
        string protocolName,
        uint256 amount,
        uint256 timestamp
    );
    event Withdrawal(
        address indexed user,
        string protocolName,
        uint256 amount,
        uint256 timestamp
    );
    event ProtocolAdded(string name, address contractAddress, bool isActive);
    event ProtocolUpdated(string name, address newAddress, bool isActive);
    event AIAddressUpdated(address oldAI, address newAI);
    event YieldClaimed(
        address indexed user,
        string protocolName,
        uint256 amount
    );

    // Structs
    struct ProtocolInfo {
        string name;
        address contractAddress;
        uint256 totalDeposited;
        uint256 userCount;
        uint256 currentAPY; // Basis points (e.g., 1250 = 12.5%)
        bool isActive;
        uint256 lastUpdated;
    }

    struct UserInvestment {
        uint256 amount;
        uint256 timestamp;
        uint256 earnedYield;
        bool isActive;
    }

    struct UserProfile {
        uint256 totalDeposited;
        uint256 totalYieldEarned;
        uint256 protocolCount;
        bool isActive;
    }

    // State variables
    address public aiAddress;
    address public supportedToken; // The ERC20 token supported (e.g., USDC, DAI)

    // Protocol management
    mapping(string => ProtocolInfo) public protocolRegistry;
    string[] public protocolNames;
    uint256 public protocolCount;

    // User management
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256) public userBalances; // Available balance for investment
    mapping(address => mapping(string => UserInvestment))
        public userInvestments;
    mapping(address => string[]) public userProtocolList;
    mapping(address => uint256) public userProtocolCount;

    // Access control
    modifier onlyAI() {
        require(
            msg.sender == aiAddress,
            "OnionFi: Only AI can call this function"
        );
        _;
    }

    modifier validProtocol(string memory protocolName) {
        require(
            protocolRegistry[protocolName].isActive,
            "OnionFi: Protocol not active"
        );
        _;
    }

    constructor(
        address _supportedToken,
        address _aiAddress
    ) Ownable(msg.sender) {
        supportedToken = _supportedToken;
        aiAddress = _aiAddress;
    }

    // =============================================================================
    // CORE DEPOSIT AND WITHDRAWAL FUNCTIONS
    // =============================================================================

    /**
     * @dev User deposits ERC20 tokens into the contract
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "OnionFi: Amount must be greater than 0");

        IERC20 token = IERC20(supportedToken);
        require(
            token.balanceOf(msg.sender) >= amount,
            "OnionFi: Insufficient token balance"
        );

        // Transfer tokens from user to contract
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Update user balance
        userBalances[msg.sender] += amount;
        userProfiles[msg.sender].totalDeposited += amount;
        userProfiles[msg.sender].isActive = true;

        emit Deposit(msg.sender, supportedToken, amount, block.timestamp);
    }

    /**
     * @dev User withdraws available balance (not invested)
     * @param amount Amount to withdraw
     */
    function withdrawAvailableBalance(uint256 amount) external nonReentrant {
        require(amount > 0, "OnionFi: Amount must be greater than 0");
        require(
            userBalances[msg.sender] >= amount,
            "OnionFi: Insufficient available balance"
        );

        userBalances[msg.sender] -= amount;

        IERC20(supportedToken).safeTransfer(msg.sender, amount);

        emit Withdrawal(
            msg.sender,
            "available_balance",
            amount,
            block.timestamp
        );
    }

    /**
     * @dev Withdraw from a specific protocol investment
     * @param protocolName Name of the protocol to withdraw from
     * @param amount Amount to withdraw
     */
    function withdrawFromProtocol(
        string memory protocolName,
        uint256 amount
    ) external nonReentrant validProtocol(protocolName) {
        require(amount > 0, "OnionFi: Amount must be greater than 0");
        require(
            userInvestments[msg.sender][protocolName].amount >= amount,
            "OnionFi: Insufficient investment"
        );

        // Update user investment
        userInvestments[msg.sender][protocolName].amount -= amount;

        // Update protocol totals
        protocolRegistry[protocolName].totalDeposited -= amount;

        // Execute protocol withdrawal (this would interact with the actual protocol)
        _executeProtocolWithdrawal(protocolName, amount);

        // Transfer tokens back to user
        IERC20(supportedToken).safeTransfer(msg.sender, amount);

        emit Withdrawal(msg.sender, protocolName, amount, block.timestamp);
    }

    // =============================================================================
    // AI INTEGRATION FUNCTIONS
    // =============================================================================

    /**
     * @dev AI-triggered function to invest user funds into a protocol
     * @param protocolName Name of the protocol to invest in
     * @param amount Amount to invest
     * @param user User address whose funds to invest
     * @param contractAddress Protocol contract address (for auto-adding new protocols)
     */
    function investInProtocol(
        string memory protocolName,
        uint256 amount,
        address user,
        address contractAddress
    ) external onlyAI nonReentrant {
        require(amount > 0, "OnionFi: Amount must be greater than 0");
        require(
            userBalances[user] >= amount,
            "OnionFi: Insufficient user balance"
        );
        require(
            bytes(protocolName).length > 0,
            "OnionFi: Protocol name cannot be empty"
        );

        // Automatically add protocol if it doesn't exist
        _addProtocolIfNotExists(protocolName, contractAddress);

        // Update user investment
        if (userInvestments[user][protocolName].amount == 0) {
            // First investment in this protocol
            userProtocolList[user].push(protocolName);
            userProtocolCount[user]++;
            protocolRegistry[protocolName].userCount++;
        }

        userInvestments[user][protocolName].amount += amount;
        userInvestments[user][protocolName].timestamp = block.timestamp;
        userInvestments[user][protocolName].isActive = true;

        // Update protocol totals
        protocolRegistry[protocolName].totalDeposited += amount;
        protocolRegistry[protocolName].lastUpdated = block.timestamp;

        // Deduct from user available balance
        userBalances[user] -= amount;

        // Execute actual protocol deposit
        _executeProtocolDeposit(protocolName, amount);

        emit InvestmentMade(user, protocolName, amount, block.timestamp);
    }

    /**
     * @dev AI recommendation with yield data
     * @param user User address
     * @param amount Amount to invest
     * @param protocolName Recommended protocol
     * @param expectedYield Expected yield in basis points
     */
    function recommendProtocol(
        address user,
        uint256 amount,
        string memory protocolName,
        uint256 expectedYield
    ) external onlyAI validProtocol(protocolName) {
        require(
            userBalances[user] >= amount,
            "OnionFi: Insufficient user balance"
        );

        // This function can be used for logging AI recommendations
        // The actual investment would be triggered separately

        // Update protocol APY based on AI analysis
        protocolRegistry[protocolName].currentAPY = expectedYield;
        protocolRegistry[protocolName].lastUpdated = block.timestamp;
    }

    /**
     * @dev Set new AI address (admin only)
     * @param newAI New AI address
     */
    function setAIAddress(address newAI) external onlyOwner {
        require(newAI != address(0), "OnionFi: Invalid AI address");
        address oldAI = aiAddress;
        aiAddress = newAI;
        emit AIAddressUpdated(oldAI, newAI);
    }

    // =============================================================================
    // PROTOCOL MANAGEMENT FUNCTIONS
    // =============================================================================

    /**
     * @dev Internal function to add protocol if it doesn't exist
     * @param protocolName Name of the protocol
     * @param contractAddress Protocol contract address (can be zero for external protocols)
     */
    function _addProtocolIfNotExists(
        string memory protocolName,
        address contractAddress
    ) internal {
        if (
            !protocolRegistry[protocolName].isActive &&
            bytes(protocolRegistry[protocolName].name).length == 0
        ) {
            protocolRegistry[protocolName] = ProtocolInfo({
                name: protocolName,
                contractAddress: contractAddress,
                totalDeposited: 0,
                userCount: 0,
                currentAPY: 0, // Default APY, can be updated later
                isActive: true,
                lastUpdated: block.timestamp
            });

            protocolNames.push(protocolName);
            protocolCount++;

            emit ProtocolAdded(protocolName, contractAddress, true);
        }
    }

    // =============================================================================
    // DATA RETRIEVAL FUNCTIONS
    // =============================================================================

    /**
     * @dev Get all protocols with their data
     * @return protocols Array of all protocol information
     */
    function getAllProtocols()
        external
        view
        returns (ProtocolInfo[] memory protocols)
    {
        protocols = new ProtocolInfo[](protocolCount);
        for (uint i = 0; i < protocolCount; i++) {
            protocols[i] = protocolRegistry[protocolNames[i]];
        }
        return protocols;
    }

    /**
     * @dev Get all protocol names
     * @return names Array of protocol names
     */
    function getAllProtocolNames()
        external
        view
        returns (string[] memory names)
    {
        names = new string[](protocolCount);
        for (uint i = 0; i < protocolCount; i++) {
            names[i] = protocolNames[i];
        }
        return names;
    }

    /**
     * @dev Get specific protocol data with amount saved
     * @param protocolName Protocol name
     * @return name Protocol name
     * @return contractAddress Protocol contract address
     * @return totalDeposited Total amount deposited
     * @return userCount Number of users
     * @return currentAPY Current APY in basis points
     * @return isActive Whether protocol is active
     */
    function getProtocolData(
        string memory protocolName
    )
        external
        view
        returns (
            string memory name,
            address contractAddress,
            uint256 totalDeposited,
            uint256 userCount,
            uint256 currentAPY,
            bool isActive
        )
    {
        ProtocolInfo storage protocol = protocolRegistry[protocolName];
        return (
            protocol.name,
            protocol.contractAddress,
            protocol.totalDeposited,
            protocol.userCount,
            protocol.currentAPY,
            protocol.isActive
        );
    }

    /**
     * @dev Get user's investment in specific protocol
     * @param user User address
     * @param protocolName Protocol name
     * @return amount Amount invested
     * @return timestamp Investment timestamp
     * @return earnedYield Earned yield
     */
    function getUserProtocolBalance(
        address user,
        string memory protocolName
    )
        external
        view
        returns (uint256 amount, uint256 timestamp, uint256 earnedYield)
    {
        UserInvestment storage investment = userInvestments[user][protocolName];
        return (
            investment.amount,
            investment.timestamp,
            investment.earnedYield
        );
    }

    function getUserAllInvestments(
        address user
    )
        external
        view
        returns (
            string[] memory protocolNames_,
            uint256[] memory amounts,
            uint256[] memory timestamps
        )
    {
        uint256 count = userProtocolCount[user];
        protocolNames_ = new string[](count);
        amounts = new uint256[](count);
        timestamps = new uint256[](count);

        for (uint i = 0; i < count; i++) {
            string memory protocolName = userProtocolList[user][i];
            UserInvestment storage investment = userInvestments[user][
                protocolName
            ];
            protocolNames_[i] = protocolName;
            amounts[i] = investment.amount;
            timestamps[i] = investment.timestamp;
        }

        return (protocolNames_, amounts, timestamps);
    }

    /**
     * @dev Get user's total balance (available + invested)
     * @param user User address
     * @return availableBalance Available balance for investment
     * @return totalInvested Total amount invested across protocols
     * @return totalYieldEarned Total yield earned
     */
    function getUserBalance(
        address user
    )
        external
        view
        returns (
            uint256 availableBalance,
            uint256 totalInvested,
            uint256 totalYieldEarned
        )
    {
        availableBalance = userBalances[user];
        totalYieldEarned = userProfiles[user].totalYieldEarned;

        // Calculate total invested
        uint256 count = userProtocolCount[user];
        for (uint i = 0; i < count; i++) {
            string memory protocolName = userProtocolList[user][i];
            totalInvested += userInvestments[user][protocolName].amount;
        }

        return (availableBalance, totalInvested, totalYieldEarned);
    }

    // =============================================================================
    // YIELD MANAGEMENT FUNCTIONS
    // =============================================================================

    /**
     * @dev Claim yields from a specific protocol
     * @param protocolName Protocol name
     */
    function claimYields(
        string memory protocolName
    ) external nonReentrant validProtocol(protocolName) {
        require(
            userInvestments[msg.sender][protocolName].amount > 0,
            "OnionFi: No investment in protocol"
        );

        // Calculate and update yield (this would integrate with actual protocol)
        uint256 yieldAmount = _calculateYield(msg.sender, protocolName);
        require(yieldAmount > 0, "OnionFi: No yield to claim");

        userInvestments[msg.sender][protocolName].earnedYield += yieldAmount;
        userProfiles[msg.sender].totalYieldEarned += yieldAmount;

        // Transfer yield to user
        IERC20(supportedToken).safeTransfer(msg.sender, yieldAmount);

        emit YieldClaimed(msg.sender, protocolName, yieldAmount);
    }

    /**
     * @dev Get pending yields for user across all protocols
     * @param user User address
     * @return totalPendingYield Total pending yield
     */
    function getPendingYields(
        address user
    ) external view returns (uint256 totalPendingYield) {
        uint256 count = userProtocolCount[user];
        for (uint i = 0; i < count; i++) {
            string memory protocolName = userProtocolList[user][i];
            totalPendingYield += _calculateYield(user, protocolName);
        }
        return totalPendingYield;
    }

    // =============================================================================
    // SECURITY AND EMERGENCY FUNCTIONS
    // =============================================================================

    /**
     * @dev Pause all operations (admin only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause operations (admin only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal from protocol (admin only)
     * @param protocolName Protocol name
     */
    function emergencyProtocolWithdraw(
        string memory protocolName
    ) external onlyOwner {
        require(
            bytes(protocolRegistry[protocolName].name).length > 0,
            "OnionFi: Protocol does not exist"
        );

        uint256 totalAmount = protocolRegistry[protocolName].totalDeposited;
        if (totalAmount > 0) {
            _executeProtocolWithdrawal(protocolName, totalAmount);
            protocolRegistry[protocolName].totalDeposited = 0;
        }
    }

    /**
     * @dev Emergency user withdrawal (user can withdraw all their funds)
     */
    function emergencyWithdraw() external nonReentrant {
        uint256 availableBalance = userBalances[msg.sender];
        uint256 totalInvested = 0;

        // Calculate total invested and withdraw from all protocols
        uint256 count = userProtocolCount[msg.sender];
        for (uint i = 0; i < count; i++) {
            string memory protocolName = userProtocolList[msg.sender][i];
            uint256 investedAmount = userInvestments[msg.sender][protocolName]
                .amount;
            if (investedAmount > 0) {
                totalInvested += investedAmount;
                userInvestments[msg.sender][protocolName].amount = 0;
                protocolRegistry[protocolName].totalDeposited -= investedAmount;
            }
        }

        uint256 totalWithdrawal = availableBalance + totalInvested;
        require(totalWithdrawal > 0, "OnionFi: No funds to withdraw");

        // Reset user balances
        userBalances[msg.sender] = 0;

        // Transfer all funds to user
        IERC20(supportedToken).safeTransfer(msg.sender, totalWithdrawal);

        emit Withdrawal(
            msg.sender,
            "emergency",
            totalWithdrawal,
            block.timestamp
        );
    }

    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================

    /**
     * @dev Execute deposit to external protocol (placeholder)
     * @param protocolName Protocol name
     * @param amount Amount to deposit
     */
    function _executeProtocolDeposit(
        string memory protocolName,
        uint256 amount
    ) internal {
        // This function would integrate with actual DeFi protocols
        // For now, it's a placeholder that would be implemented based on specific protocol APIs
        // Example integration:
        // IProtocol protocol = IProtocol(protocolRegistry[protocolName].contractAddress);
        // IERC20(supportedToken).approve(address(protocol), amount);
        // protocol.deposit(amount);
    }

    /**
     * @dev Execute withdrawal from external protocol (placeholder)
     * @param protocolName Protocol name
     * @param amount Amount to withdraw
     */
    function _executeProtocolWithdrawal(
        string memory protocolName,
        uint256 amount
    ) internal {
        // This function would integrate with actual DeFi protocols
        // For now, it's a placeholder
        // Example integration:
        // IProtocol protocol = IProtocol(protocolRegistry[protocolName].contractAddress);
        // protocol.withdraw(amount);
    }

    /**
     * @dev Calculate yield for user in specific protocol (placeholder)
     * @param user User address
     * @param protocolName Protocol name
     * @return yieldAmount Calculated yield
     */
    function _calculateYield(
        address user,
        string memory protocolName
    ) internal view returns (uint256 yieldAmount) {
        // This would calculate actual yield based on protocol integration
        // For now, it's a placeholder calculation

        UserInvestment storage investment = userInvestments[user][protocolName];
        if (investment.amount == 0) return 0;

        uint256 timeElapsed = block.timestamp - investment.timestamp;
        uint256 apy = protocolRegistry[protocolName].currentAPY;

        // Simple yield calculation (APY * amount * time / year)
        // This is simplified and would be more complex in production
        yieldAmount =
            (investment.amount * apy * timeElapsed) /
            (10000 * 365 days);

        return yieldAmount;
    }

    /**
     * @dev Update supported token (admin only)
     * @param newToken New token address
     */
    function updateSupportedToken(address newToken) external onlyOwner {
        require(newToken != address(0), "OnionFi: Invalid token address");
        supportedToken = newToken;
    }

    /**
     * @dev Get contract information
     * @return token Supported token address
     * @return ai AI address
     * @return totalProtocols Total number of protocols
     */
    function getContractInfo()
        external
        view
        returns (address token, address ai, uint256 totalProtocols)
    {
        return (supportedToken, aiAddress, protocolCount);
    }
}
