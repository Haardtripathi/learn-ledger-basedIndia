// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CourseOwnership {
    struct Course {
        string metadataIPFSHash;
        string videoIPFSHash;
        uint256 price;
        address owner;
        uint256 totalShares;
        mapping(address => uint256) ownershipShares;
        address[] owners;
        uint256 totalProfits;
    }

    mapping(uint256 => Course) public courses;
    uint256 public courseCount = 0;

    mapping(address => bool) public registeredUsers;
    mapping(uint256 => mapping(address => bool)) public coursePurchases;

    event CourseCreated(
        uint256 courseId,
        string metadataIPFSHash,
        uint256 price,
        string videoIPFSHash
    );
    event OwnershipTransferred(uint256 courseId, address buyer, uint256 shares);
    event ProfitsDistributed(uint256 courseId, uint256 totalProfit);
    event UserRegistered(address user);
    event CoursePurchased(uint256 courseId, address buyer);

    function registerUser() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function createCourse(
        string memory _metadataIPFSHash,
        string memory _videoIPFSHash,
        uint256 _price,
        uint256 _ownerShares
    ) public {
        require(
            _ownerShares >= 51 && _ownerShares <= 100,
            "Owner must take at least 51 shares"
        );
        require(registeredUsers[msg.sender], "User must be registered");

        courseCount++;
        Course storage newCourse = courses[courseCount];

        newCourse.metadataIPFSHash = _metadataIPFSHash;
        newCourse.videoIPFSHash = _videoIPFSHash;
        newCourse.price = _price;
        newCourse.owner = msg.sender;
        newCourse.totalShares = 100;
        newCourse.ownershipShares[msg.sender] = _ownerShares;
        newCourse.owners.push(msg.sender);

        emit CourseCreated(
            courseCount,
            _metadataIPFSHash,
            _price,
            _videoIPFSHash
        );
    }

    function distributeProfits(uint256 _courseId) public payable {
        Course storage course = courses[_courseId];
        require(msg.value > 0, "No profit to distribute");

        course.totalProfits += msg.value;

        emit ProfitsDistributed(_courseId, msg.value);
    }

    function withdrawProfits(uint256 _courseId) public {
        Course storage course = courses[_courseId];
        uint256 ownerShares = course.ownershipShares[msg.sender];
        require(ownerShares > 0, "You do not own any shares");

        uint256 profitShare = (course.totalProfits * ownerShares) /
            course.totalShares;

        (bool success, ) = msg.sender.call{value: profitShare}("");
        require(success, "Transfer failed");

        course.totalProfits -= profitShare;
    }

    function buyCourseShares(
        uint256 _courseId,
        uint256 _shares
    ) public payable {
        Course storage course = courses[_courseId];
        require(_shares > 0, "Must buy at least one share");
        require(course.owner != address(0), "Course does not exist");
        require(msg.sender != course.owner, "Course owner cannot buy shares");

        uint256 sharePrice = (course.price * _shares) / course.totalShares;
        require(msg.value >= sharePrice, "Insufficient payment");

        require(registeredUsers[msg.sender], "User must be registered");

        uint256 remainingShares = getRemainingShares(_courseId);
        require(_shares <= remainingShares, "Not enough shares available");

        require(
            remainingShares - _shares >= course.totalShares / 2,
            "Cannot buy more than 49% of total shares"
        );

        if (course.ownershipShares[msg.sender] == 0) {
            course.owners.push(msg.sender);
        }

        course.ownershipShares[msg.sender] += _shares;

        uint256 excess = msg.value - sharePrice;
        (bool success, ) = payable(course.owner).call{value: sharePrice}("");
        require(success, "Transfer to owner failed");

        if (excess > 0) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: excess}(
                ""
            );
            require(refundSuccess, "Refund transfer failed");
        }

        emit OwnershipTransferred(_courseId, msg.sender, _shares);
    }

    function purchaseCourse(uint256 _courseId) public payable {
        Course storage course = courses[_courseId];
        require(course.owner != address(0), "Course does not exist");
        require(msg.value >= course.price, "Insufficient payment");
        require(
            !coursePurchases[_courseId][msg.sender],
            "Course already purchased"
        );

        uint256 ownerShares = course.ownershipShares[course.owner];
        require(
            ownerShares >= 51,
            "Course owner must maintain at least 51% ownership"
        );

        uint256 remainingProfit = msg.value;

        for (uint256 i = 0; i < course.owners.length; i++) {
            address payable shareholder = payable(course.owners[i]);
            uint256 shares = course.ownershipShares[shareholder];
            if (shares > 0) {
                uint256 shareAmount = (msg.value * shares) / course.totalShares;
                (bool success, ) = shareholder.call{value: shareAmount}("");
                require(success, "Transfer failed");
                remainingProfit -= shareAmount;
            }
        }

        if (remainingProfit > 0) {
            (bool success, ) = payable(course.owner).call{
                value: remainingProfit
            }("");
            require(success, "Transfer to owner failed");
        }

        coursePurchases[_courseId][msg.sender] = true;
        emit CoursePurchased(_courseId, msg.sender);
    }

    function getCourseOwner(uint256 _courseId) public view returns (address) {
        return courses[_courseId].owner;
    }

    function getCourseVideo(
        uint256 _courseId
    ) public view returns (string memory) {
        require(
            hasAccessToCourse(_courseId, msg.sender),
            "You do not have access to this course"
        );
        return courses[_courseId].videoIPFSHash;
    }

    function getOwnershipShares(
        uint256 _courseId,
        address _owner
    ) public view returns (uint256) {
        return courses[_courseId].ownershipShares[_owner];
    }

    function getRemainingShares(uint256 _courseId) public returns (uint256) {
        Course storage course = courses[_courseId];
        uint256 totalAllocatedShares = 0;

        for (uint256 i = 0; i < course.owners.length; i++) {
            totalAllocatedShares += course.ownershipShares[course.owners[i]];
        }

        return course.totalShares - totalAllocatedShares;
    }

    function getCourseDetails(
        uint256 _courseId
    )
        public
        view
        returns (
            string memory metadataIPFSHash,
            uint256 price,
            string memory videoIPFSHash,
            address owner
        )
    {
        Course storage course = courses[_courseId];
        return (
            course.metadataIPFSHash,
            course.price,
            course.videoIPFSHash,
            course.owner
        );
    }

    function getUserAccessibleCourses(
        address _user
    ) public view returns (uint256[] memory) {
        uint256[] memory accessibleCourses = new uint256[](courseCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= courseCount; i++) {
            if (hasAccessToCourse(i, _user)) {
                accessibleCourses[count] = i;
                count++;
            }
        }

        // Create a new array with the exact size of accessible courses
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = accessibleCourses[i];
        }

        return result;
    }

    function hasAccessToCourse(
        uint256 _courseId,
        address _user
    ) public view returns (bool) {
        return
            coursePurchases[_courseId][_user] ||
            courses[_courseId].owner == _user;
    }
}
