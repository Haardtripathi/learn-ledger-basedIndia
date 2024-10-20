const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const ethers = require('ethers');
const axios = require("axios")

require('dotenv').config();

// Initialize Pinata client
const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_API_KEY, pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY });

// Define the ABI directly in your code
const ABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "courseId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "metadataIPFSHash", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "videoIPFSHash", "type": "string" }], "name": "CourseCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "courseId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }], "name": "CoursePurchased", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "courseId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "shares", "type": "uint256" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "courseId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "totalProfit", "type": "uint256" }], "name": "ProfitsDistributed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }], "name": "UserRegistered", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }, { "internalType": "uint256", "name": "_shares", "type": "uint256" }], "name": "buyCourseShares", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "courseCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "coursePurchases", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "courses", "outputs": [{ "internalType": "string", "name": "metadataIPFSHash", "type": "string" }, { "internalType": "string", "name": "videoIPFSHash", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "totalShares", "type": "uint256" }, { "internalType": "uint256", "name": "totalProfits", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_metadataIPFSHash", "type": "string" }, { "internalType": "string", "name": "_videoIPFSHash", "type": "string" }, { "internalType": "uint256", "name": "_price", "type": "uint256" }, { "internalType": "uint256", "name": "_ownerShares", "type": "uint256" }], "name": "createCourse", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "distributeProfits", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "getCourseDetails", "outputs": [{ "internalType": "string", "name": "metadataIPFSHash", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string", "name": "videoIPFSHash", "type": "string" }, { "internalType": "address", "name": "owner", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "getCourseOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "getCourseVideo", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }, { "internalType": "address", "name": "_owner", "type": "address" }], "name": "getOwnershipShares", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "getRemainingShares", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserAccessibleCourses", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }, { "internalType": "address", "name": "_user", "type": "address" }], "name": "hasAccessToCourse", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "purchaseCourse", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "registerUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "registeredUsers", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_courseId", "type": "uint256" }], "name": "withdrawProfits", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

// Connect to an Ethereum provider
const provider = new ethers.getDefaultProvider(process.env.BASE_SEPOLIA_RPC_URL);

// Use a wallet connected to your provider
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, ABI, wallet);

const RUPEES_TO_ETH_RATE = 0.000012; // Example conversion rate; adjust as necessary

function convertRupeesToWei(rupees) {
    const etherValue = rupees * RUPEES_TO_ETH_RATE; // Convert rupees to Ether
    return ethers.parseEther(etherValue.toString()); // Convert Ether to wei
}

module.exports.createCourse = async (req, res) => {
    console.log("In create course");
    try {
        const { author, title, description, contentPoints, topics, duration, priceInRupees, ownerShares } = req.body;
        const video = req.file;
        console.log(author, title, description, contentPoints, topics, duration, priceInRupees, ownerShares)

        // Prepare metadata
        const metadata = {
            author,
            title,
            description,
            contentPoints: contentPoints.split(',').map(point => point.trim()),
            topics: topics.split(',').map(topic => topic.trim()),
            duration
        };

        // Upload metadata to IPFS via Pinata
        const metadataResult = await pinata.pinJSONToIPFS(metadata);
        const metadataIPFSHash = metadataResult.IpfsHash;
        console.log('Metadata IPFS Hash:', metadataIPFSHash);

        // Upload video to IPFS via Pinata
        const readableStreamForFile = fs.createReadStream(video.path);
        const options = {
            pinataMetadata: {
                name: `${title}-${author}-video.${video.originalname.split('.').pop()}`,
            },
        };
        const videoResult = await pinata.pinFileToIPFS(readableStreamForFile, options);
        const videoIPFSHash = videoResult.IpfsHash;
        console.log('Video IPFS Hash:', videoIPFSHash);

        // Clean up the uploaded file
        fs.unlinkSync(video.path);

        console.log("RPC URL:", process.env.BASE_SEPOLIA_RPC_URL);

        // Check if user is registered
        const isRegistered = await contract.registeredUsers(wallet.address);
        if (!isRegistered) {
            console.log("User not registered. Registering now...");
            const registerTx = await contract.registerUser();
            await registerTx.wait();
            console.log("User registered successfully");
        }

        // Convert price to wei using the conversion function
        const priceInWei = convertRupeesToWei(priceInRupees);
        console.log(priceInWei.toString(), "IN WEI");

        // Call the createCourse function
        const tx = await contract.createCourse(metadataIPFSHash, videoIPFSHash, priceInWei, ownerShares);
        const receipt = await tx.wait();

        res.status(201).json({
            message: "Course created successfully",
            transactionHash: tx.hash,
            metadataIPFSHash,
            videoIPFSHash
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Error creating course", details: error.message });
    }
};




async function fetchIPFSMetadata(hash) {
    try {
        console.log(`Fetching metadata for hash: ${hash}`); // Log the hash to ensure function is called
        const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
        const response = await axios.get(url, {
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
            }
        });
        console.log("Metadata fetched:", response.data); // Log the response from IPFS
        return response.data;
    } catch (error) {
        console.error('Error fetching IPFS metadata:', error);
        return null;
    }
}


module.exports.getCourses = async (req, res) => {
    console.log("Request received for courses");
    try {
        const courseCount = await contract.courseCount();
        console.log("Course count:", courseCount);

        const courses = [];

        for (let i = 1; i <= courseCount; i++) {
            console.log(`Fetching details for course ${i}`);
            const [metadataIPFSHash, price, videoIPFSHash, owner] = await contract.getCourseDetails(i);
            console.log(price)
            const metadata = await fetchIPFSMetadata(metadataIPFSHash);
            const remainingShares = await contract.getRemainingShares(i);
            const hasPurchased = await contract.coursePurchases(i, wallet.address); // Check if the user has purchased the course

            courses.push({
                id: i,
                name: metadata ? metadata.title : 'Unknown',
                duration: metadata ? metadata.duration : 'Unknown',
                topics: metadata ? metadata.topics : [],
                price: ethers.formatEther(price), // Convert to human-readable string
                remainingShares: remainingShares.toString(), // Convert BigInt to string
                author: metadata.author,
                hasPurchased // Add purchase status
            });
        }

        console.log("Courses fetched:", courses);
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.buyShares = async (req, res, next) => {
    const courseId = req.params.id;
    const { shares } = req.body;

    try {
        // Ensure shares are a positive integer
        if (shares <= 0) {
            return res.status(400).json({ error: "Shares must be a positive number." });
        }

        const isRegistered = await contract.registeredUsers(wallet.address);
        if (!isRegistered) {
            console.log("User not registered. Registering now...");
            const registerTx = await contract.registerUser();
            await registerTx.wait();
            console.log("User registered successfully");
        }

        // Call the buyCourseShares function
        const tx = await contract.buyCourseShares(courseId, shares);
        const receipt = await tx.wait();

        res.status(200).json({
            message: "Shares purchased successfully",
            transactionHash: tx.hash,
            courseId: courseId,
            shares: shares
        });
    } catch (error) {
        console.error("Error purchasing shares:", error);
        res.status(500).json({ error: "Error purchasing shares", details: error.message });
    }
};


const convertRupeesToEth = (rupees) => {
    if (!ethPrice) return 0;
    const ethAmount = (parseFloat(rupees) / ethPrice).toFixed(18);
    console.log(`Converted ${rupees} Rupees to ${ethAmount} ETH`); // Log for debugging
    return ethers.parseEther(ethAmount);
};


module.exports.purchaseCourse = async (req, res, next) => {
    const courseId = parseInt(req.params.id);

    try {
        // Fetch course details to check price
        const [metadataIPFSHash, price, videoIPFSHash, owner] = await contract.getCourseDetails(courseId);
        console.log(price)
        // Ensure price is in Wei (the correct format)
        const priceInWei = ethers.parseUnits(price.toString(), 'wei');
        console.log("Course Price (in Wei):", priceInWei.toString());

        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        console.log("Wallet Balance (in Wei):", balance.toString()); // Log balance in Wei

        // Check if the user has enough funds
        if (balance.lt(priceInWei)) {
            return res.status(400).json({ error: "Insufficient funds in the wallet." });
        }

        // Check if the user has already purchased the course
        const hasPurchased = await contract.coursePurchases(courseId, wallet.address);
        if (hasPurchased) {
            return res.status(400).json({ error: "Course already purchased." });
        }

        // Check if the user is registered
        const isRegistered = await contract.registeredUsers(wallet.address);
        if (!isRegistered) {
            console.log("User not registered. Registering now...");
            const registerTx = await contract.registerUser();
            await registerTx.wait();
            console.log("User registered successfully");
        }

        // Call the purchaseCourse function with the value
        const tx = await contract.purchaseCourse(courseId, { value: priceInWei });
        console.log("Transaction sent. Waiting for confirmation...");
        const receipt = await tx.wait();

        res.status(200).json({
            message: "Course purchased successfully",
            transactionHash: tx.hash,
            courseId: courseId
        });
    } catch (error) {
        console.error("Error purchasing course:", error);
        res.status(500).json({ error: "Error purchasing course", details: error.message });
    }
};
