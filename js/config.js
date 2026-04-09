const CONTRACT_ADDRESS = '0x8D3AbD6664bdf0abfA5cf5344cf0F81f2f34d79D';

const CONTRACT_ABI = [
    {"constant":false,"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"bytes","name":"content","type":"bytes"},{"internalType":"bytes32","name":"subName","type":"bytes32"}],"name":"createPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"parentPostId","type":"uint256"},{"internalType":"bytes","name":"content","type":"bytes"}],"name":"createReply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"downvotePost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"replyId","type":"uint256"}],"name":"downvoteReply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"getPost","outputs":[{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"postId","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"address","name":"author","type":"address"},{"internalType":"bytes","name":"content","type":"bytes"},{"internalType":"uint256","name":"upvotes","type":"uint256"},{"internalType":"uint256","name":"downvotes","type":"uint256"},{"internalType":"bytes32","name":"subName","type":"bytes32"},{"internalType":"uint256[]","name":"replyIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"},{"internalType":"uint256","name":"offset","type":"uint256"},{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"getRecentPostIdsInSub","outputs":[{"internalType":"uint256[]","name":"postIds","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"getRecentlyActiveSubs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"replies","outputs":[{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"replyId","type":"uint256"},{"internalType":"uint256","name":"parentPostId","type":"uint256"},{"internalType":"address","name":"author","type":"address"},{"internalType":"bytes","name":"content","type":"bytes"},{"internalType":"uint256","name":"upvotes","type":"uint256"},{"internalType":"uint256","name":"downvotes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"subCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"totalPosts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"totalReplies","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"upvotePost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"replyId","type":"uint256"}],"name":"upvoteReply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
];

const Page = Object.freeze({ HOME: 0, VIEWPOST: 1, HELP: 2 });

const IMAGE_REGEX = /(?=(?:img:)?|.*(?:\.(?:jpg|jpeg|png|gif)))((?:(?:f|ht)tp(?:s)?:\/\/)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)/gi;
