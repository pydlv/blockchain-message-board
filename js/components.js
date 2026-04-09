Vue.component('new-post-form', {
    props: {
        defaultSub: { required: false, default: '' }
    },

    data() {
        return {
            showing: false,
            sub: this.defaultSub,
            title: '',
            body: '',
            link: '',
            ipfs: ''
        };
    },

    methods: {
        async submitted(e) {
            e.preventDefault();

            const content = hexlifyString(this.body);
            const tx = await contract.createPost(this.title, content, ethers.utils.formatBytes32String(this.sub));

            alert("Post sent successfully. PLEASE BE PATIENT AS IT CAN TAKE A FEW MINUTES FOR POSTS TO CONFIRM AND SHOW UP.");

            this.showing = false;

            await tx.wait();

            document.location = this.$buildUrl({ s: this.sub }, false);
        },

        canceled(e) {
            e.preventDefault();
            this.showing = false;
        }
    },

    template: `
    <div>
        <button @click="showing=!showing">New Post</button>
        <div v-show="showing" class="m-3">
            <form>
                <label>Sub: <input type="text" size="30" v-model="sub"></input></label>
                <label>Title: <input type="text" size="50" v-model="title"></input></label>
                <label>Body:</label>
                <textarea cols="100" rows="8" v-model="body" class="d-block"></textarea>
                <button @click="submitted($event)">Save</button>
                <button @click="canceled($event)">Cancel</button>
            </form>
        </div>
    </div>
    `
});

Vue.component('new-reply-form', {
    props: ['parentPostId'],

    data() {
        return {
            showing: false,
            body: ''
        };
    },

    methods: {
        async submitted(e) {
            e.preventDefault();

            const content = hexlifyString(this.body);
            const tx = await contract.createReply(this.parentPostId, content);

            alert("Reply created successfully. PLEASE BE PATIENT AS IT CAN TAKE A FEW MINUTES FOR REPLIES TO CONFIRM AND SHOW UP.");

            this.showing = false;

            await tx.wait();

            this.body = '';
        },

        canceled(e) {
            e.preventDefault();
            this.showing = false;
        }
    },

    template: `
    <div>
        <button @click="showing=!showing">Reply</button>
        <div v-show="showing" class="m-3">
            <form>
                <label>Message:</label>
                <textarea cols="100" rows="8" v-model="body" class="d-block"></textarea>
                <button @click="submitted($event)">Save</button>
                <button @click="canceled($event)">Cancel</button>
            </form>
        </div>
    </div>
    `
});

Vue.component('post', {
    props: ['post', 'reply', 'index'],

    data() {
        return {
            previews: [],
            showPreviews: false
        };
    },

    computed: {
        contentText() {
            return ethers.utils.toUtf8String(this.post ? this.post.content : this.reply.content);
        }
    },

    methods: {
        replaceLinks() {
            const original = this.$refs['post-text'].innerHTML;
            const newTxt = original.replace(/(((f|ht)tp(s)?:\/\/)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)/gi, '<a href="$1" target="_blank">$1</a>');
            this.$refs['post-text'].innerHTML = newTxt;
        },

        loadPreviews() {
            const imageMatches = Array.from(new Set([...this.contentText.matchAll(IMAGE_REGEX)].map((match) => match[0])));
            imageMatches.forEach((imageUrl) => {
                this.previews.push(`<a href="${imageUrl}" target="_blank"><img src="${imageUrl}" class="preview-image" alt="Preview image" /></a>`);
            });

            const imageTxs = Array.from(new Set([...this.contentText.matchAll(/eth-tx-img:(0x[A-Fa-f0-9]{64})/gi)].map((match) => match[1])));
            imageTxs.forEach((txHash) => {
                provider.getTransaction(txHash).then((tx) => {
                    if (tx !== null) {
                        const hex = tx.data.slice(2);
                        const b64 = hexToBase64(hex);
                        this.previews.push(`<a href="https://etherscan.io/tx/${txHash}" target="_blank"><img src="data:image/jpeg;base64, ${b64}" class="preview-image" alt="Preview image" /></a>`);
                    }
                });
            });
        },

        async upvote() {
            if (this.post !== undefined) {
                await contract.upvotePost(this.post.postId);
            } else {
                await contract.upvoteReply(this.reply.replyId);
            }
            alert("Transaction sent successfully.");
        },

        async downvote() {
            if (this.post !== undefined) {
                await contract.downvotePost(this.post.postId);
            } else {
                await contract.downvoteReply(this.reply.replyId);
            }
            alert("Transaction sent successfully.");
        }
    },

    mounted() {
        this.replaceLinks();
        this.loadPreviews();
    },

    template: `
    <div class="border border-secondary mt-3 mb-3 p-1">
        <div v-if="post !== undefined">
            <!-- original post -->
            <p class="d-inline font-weight-bold">{{ post.title }}</p>
            <p class="d-inline" v-if="post.subName !== ''">in <a :href="$buildUrl({s: post.subName}, false)">{{ post.subName }}</a></p>
            <p class="d-inline"> {{ post.upvotes - post.downvotes }} points <span v-if="!$readOnly">(<a href="javascript:void(0)" @click="upvote">Upvote</a> <a href="javascript:void(0)" @click="downvote">Downvote</a>)</span></p>
            <a :href="'https://etherscan.io/address/' + post.author" target="_blank"><p class="d-inline">{{ post.author }}</p></a>
            <p class="d-inline">{{ $formatTimestamp(post.createdAt) }}</p>
            <p class="d-inline">{{ post.replyIds.length }} replies</p>
            <p class="d-inline float-right font-weight-bold">#{{ index }}</p>
        </div>
        <div v-else>
            <!-- reply -->
            <p class="d-inline"> {{ reply.upvotes - reply.downvotes }} points <span v-if="!$readOnly">(<a href="javascript:void(0)" @click="upvote">Upvote</a> <a href="javascript:void(0)" @click="downvote">Downvote</a>)</span></p>
            <a :href="'https://etherscan.io/address/' + reply.author" target="_blank"><p class="d-inline">{{ reply.author }}</p></a>
            <p class="d-inline">{{ $formatTimestamp(reply.createdAt) }}</p>
            <p class="d-inline float-right font-weight-bold">#{{ index }}</p>
        </div>
        <div class="p-2">
            <p><span style="white-space: pre;" ref="post-text">{{ contentText }}</span></p>
            <div v-if="showPreviews">
                <!-- Previews -->
                <div v-for="preview in previews" v-html="preview"></div>
            </div>
            <div v-else-if="previews.length > 0">
                <p><a href="javascript:void(0)" @click="showPreviews=true" style="color: green;">Click here to load image previews!</a><span class="text-danger" style="font-size: 0.8rem;"> Loading previews can leak your IP to the image host.</span></p>
            </div>
        </div>
        <div v-if="!$readOnly">
            <div v-if="post !== undefined">
                <new-reply-form :parentPostId="post.postId"></new-reply-form>
            </div>
            <div v-else>
                <new-reply-form :parentPostId="reply.parentPostId"></new-reply-form>
            </div>
        </div>
    </div>
    `
});

Vue.component('view-post-page', {
    props: {
        postId: { required: true }
    },

    data() {
        return {
            post: null,
            replies: []
        };
    },

    computed: {
        sortedReplies() {
            return this.replies.sort((a, b) => b.createdAt - a.createdAt);
        }
    },

    async mounted() {
        const post = await contract.getPost(this.postId);

        this.post = {
            createdAt: post.createdAt.toNumber(),
            postId: post.postId.toNumber(),
            title: post.title,
            author: post.author,
            content: post.content,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            subName: ethers.utils.parseBytes32String(post.subName),
            replyIds: post.replyIds
        };

        // Load the replies
        this.post.replyIds.forEach(async (replyId) => {
            const reply = await contract.replies(replyId);

            this.replies.push({
                createdAt: post.createdAt.toNumber(),
                replyId: reply.replyId.toNumber(),
                author: reply.author,
                parentPostId: reply.parentPostId.toNumber(),
                content: reply.content,
                upvotes: reply.upvotes,
                downvotes: reply.downvotes
            });
        });
    },

    template: `
    <div v-if="post !== null && replies.length === post.replyIds.length">
        <post :post="post" index="1"></post>
        <post v-for="(reply, index) in sortedReplies" :key="reply.replyId" :reply="reply" :index="index+2"></post>
    </div>
    `
});
