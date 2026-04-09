var provider;
var signer = null;
var readOnly;
var contract;

function createApp() {
    new Vue({
        el: '#app',

        data() {
            return {
                posts: [],
                recentlyActiveSubs: [],
                Page
            };
        },

        computed: {
            urlParams() {
                return new URLSearchParams(window.location.search);
            },

            page() {
                if (this.urlParams.has('postId')) {
                    return Page.VIEWPOST;
                } else if (this.urlParams.has('page') && this.urlParams.get('page') === 'help') {
                    return Page.HELP;
                }
                return Page.HOME;
            },

            postId() {
                return parseInt(this.urlParams.get('postId'));
            },

            sub() {
                return this.urlParams.has('s') ? this.urlParams.get('s') : '';
            },

            offset() {
                return this.urlParams.has('offset') ? parseInt(this.urlParams.get('offset')) : 0;
            },

            limit() {
                return this.urlParams.has('limit') ? parseInt(this.urlParams.get('limit')) : 20;
            },

            sortedPosts() {
                return this.posts.sort((a, b) => b.createdAt - a.createdAt);
            }
        },

        methods: {
            async loadPosts() {
                contract.getRecentPostIdsInSub(ethers.utils.formatBytes32String(this.sub), this.offset, this.limit).then((result) => {
                    result.forEach((postId) => {
                        contract.getPost(postId).then((post) => {
                            this.posts.push({
                                createdAt: post.createdAt.toNumber(),
                                postId: post.postId.toNumber(),
                                title: post.title,
                                author: post.author,
                                content: post.content,
                                upvotes: post.upvotes,
                                downvotes: post.downvotes,
                                subName: post.subName,
                                replyIds: post.replyIds
                            });
                        });
                    });
                });
            },

            subGo(e) {
                e.preventDefault();
                const newSub = this.$refs['sub-box'].value;
                document.location = this.$buildUrl({ s: newSub }, false);
            },

            nextClick() {
                document.location = this.$buildUrl({ offset: this.offset + this.limit });
            },

            previousClick() {
                document.location = this.$buildUrl({ offset: this.offset - this.limit });
            },

            fetchRecentlyActiveSubs() {
                this.recentlyActiveSubs = [];

                contract.getRecentlyActiveSubs().then((result) => {
                    const subNames = result
                        .map((bytes32) => ethers.utils.parseBytes32String(bytes32))
                        .filter((name) => name !== '');

                    subNames.forEach((name) => {
                        if (!this.recentlyActiveSubs.includes(name)) {
                            this.recentlyActiveSubs.push(name);
                        }
                    });
                });
            }
        },

        mounted() {
            this.loadPosts();
            this.fetchRecentlyActiveSubs();
        }
    });
}

window.addEventListener('load', async () => {
    let useDefaultProvider = true;

    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Accounts now exposed
            useDefaultProvider = false;
        } catch (error) {
            // User denied account access...
            useDefaultProvider = true;
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Accounts always exposed
        useDefaultProvider = false;
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        useDefaultProvider = true;
    }

    if (useDefaultProvider) {
        readOnly = true;
        Vue.prototype.$readOnly = readOnly;
        provider = ethers.getDefaultProvider();
    } else {
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
        signer = provider.getSigner();
        readOnly = false;
        Vue.prototype.$readOnly = readOnly;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    if (!useDefaultProvider) {
        contract = contract.connect(signer);
    }

    createApp();
});
