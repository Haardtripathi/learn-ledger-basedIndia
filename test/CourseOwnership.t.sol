// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CourseOwnership.sol";

contract CourseOwnershipTest is Test {
    CourseOwnership public courseOwnership;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        courseOwnership = new CourseOwnership();
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        // Register users
        courseOwnership.registerUser();
        vm.prank(user1);
        courseOwnership.registerUser();
        vm.prank(user2);
        courseOwnership.registerUser();
    }

    function testUserRegistration() public {
        assertTrue(courseOwnership.registeredUsers(address(this)));
        assertTrue(courseOwnership.registeredUsers(user1));
        assertTrue(courseOwnership.registeredUsers(user2));
    }

    function testCreateCourse() public {
        string memory metadataIPFSHash = "QmTest1234567890";
        string memory videoIPFSHash = "QmVideo1234567890";
        uint256 price = 1 ether;
        uint256 ownerShares = 80;

        courseOwnership.createCourse(
            metadataIPFSHash,
            videoIPFSHash,
            price,
            ownerShares
        );

        (
            string memory returnedMetadataIPFSHash,
            uint256 returnedPrice,
            string memory returnedVideoIPFSHash,
            address returnedOwner
        ) = courseOwnership.getCourseDetails(1);

        assertEq(returnedMetadataIPFSHash, metadataIPFSHash);
        assertEq(returnedPrice, price);
        assertEq(returnedVideoIPFSHash, videoIPFSHash);
        assertEq(returnedOwner, address(this));
        assertEq(
            courseOwnership.getOwnershipShares(1, address(this)),
            ownerShares
        );
    }

    function testBuyCourseShares() public {
        _createTestCourse();

        deal(user1, 100 ether);
        vm.prank(user1);
        courseOwnership.buyCourseShares{value: 10 ether}(1, 10);

        assertEq(courseOwnership.getOwnershipShares(1, user1), 10);
    }

    function testPurchaseCourse() public {
        _createTestCourse();

        deal(user1, 100 ether);
        vm.prank(user1);
        courseOwnership.buyCourseShares{value: 10 ether}(1, 10);

        uint256 initialOwnerBalance = address(this).balance;
        uint256 initialUser1Balance = user1.balance;

        deal(user2, 100 ether);
        vm.prank(user2);
        courseOwnership.purchaseCourse{value: 1 ether}(1);

        uint256 finalOwnerBalance = address(this).balance;
        uint256 finalUser1Balance = user1.balance;

        assertGt(finalOwnerBalance, initialOwnerBalance);
        assertGt(finalUser1Balance, initialUser1Balance);
    }

    function testDistributeProfits() public {
        _createTestCourse();

        courseOwnership.distributeProfits{value: 1 ether}(1);

        (, , , , , uint256 totalProfits) = courseOwnership.courses(1);
        assertEq(totalProfits, 1 ether);
    }

    function testWithdrawProfits() public {
        _createTestCourse();

        courseOwnership.distributeProfits{value: 1 ether}(1);

        uint256 initialBalance = address(this).balance;
        courseOwnership.withdrawProfits(1);
        uint256 finalBalance = address(this).balance;

        assertGt(finalBalance, initialBalance);
    }

    function testFailCreateCourseWithInsufficientOwnerShares() public {
        vm.expectRevert("Owner must take at least 51 share");
        courseOwnership.createCourse(
            "QmTest1234567890",
            "QmVideo1234567890",
            1 ether,
            50 // This should fail as it's less than 51
        );
    }

    function testFailBuyTooManyShares() public {
        _createTestCourse();

        vm.prank(user1);
        vm.expectRevert("Cannot exceed 49% of total shares for others");
        courseOwnership.buyCourseShares{value: 21 ether}(1, 21); // This should fail as it would exceed 49% for non-owners
    }

    function testFailUnregisteredUserCreateCourse() public {
        address unregisteredUser = address(0x1234);
        vm.prank(unregisteredUser);
        vm.expectRevert("User must be registered/authenticated");
        courseOwnership.createCourse(
            "QmTest1234567890",
            "QmVideo1234567890",
            1 ether,
            80
        );
    }

    function testFailUnregisteredUserBuyShares() public {
        _createTestCourse();

        address unregisteredUser = address(0x1234);
        vm.prank(unregisteredUser);
        vm.expectRevert("User must be registered");
        courseOwnership.buyCourseShares{value: 10 ether}(1, 10);
    }

    function _createTestCourse() internal {
        courseOwnership.createCourse(
            "QmTest1234567890",
            "QmVideo1234567890",
            1 ether,
            80
        );
    }

    receive() external payable {}
}
