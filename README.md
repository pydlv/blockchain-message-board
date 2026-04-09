# Divvy — Blockchain Message Board

Divvy is a decentralised message board (think Reddit) that runs entirely on the Ethereum blockchain. Posts, replies, and votes are stored on-chain via a Solidity smart contract. The frontend is a plain HTML/CSS/JS application built with Vue.js and ethers.js — no build step required.

---

## Features

- **Subs** — organise posts into named communities (similar to subreddits)
- **Posts** — create text posts with titles and a body
- **Replies** — reply to any post
- **Voting** — upvote or downvote posts and replies (recorded on-chain)
- **Image previews** — inline image previews for URLs ending in `.jpg`, `.jpeg`, `.png`, `.gif`, or prefixed with `img:`
- **Ethereum transaction images** — embed images stored in transaction input data with the `eth-tx-img:<txhash>` syntax
- **Read-only mode** — the board is fully browsable without a wallet; MetaMask (or another injected provider) is only required to write

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity 0.5.12 |
| Ethereum client | [ethers.js](https://docs.ethers.io/) |
| Frontend framework | [Vue.js 2](https://v2.vuejs.org/) |
| Styling | [Bootstrap 4](https://getbootstrap.com/docs/4.3/) |

---

## Project Structure

```
.
├── index.html          # Main HTML page (markup only)
├── css/
│   └── styles.css      # Application styles
├── js/
│   ├── config.js       # Contract address, ABI, and constants
│   ├── utils.js        # Helper functions and Vue prototype extensions
│   ├── components.js   # Vue components (new-post-form, new-reply-form, post, view-post-page)
│   └── app.js          # Main Vue app instance and Ethereum provider initialisation
├── divvy.sol           # Solidity smart contract source
├── ethers.min.js       # Bundled ethers.js library
└── README.md
```

---

## Getting Started

### Prerequisites

- A modern web browser
- [MetaMask](https://metamask.io/) (or another Web3 wallet) if you want to post, reply, or vote

### Running locally

Because the frontend uses plain `<script src="...">` tags, it must be served over HTTP rather than opened directly as a `file://` URL (MetaMask cannot inject into `file://` pages anyway).

Any static file server will work. For example, using Python:

```bash
# Python 3
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> **Note:** The app connects to the already-deployed contract at `0x8D3AbD6664bdf0abfA5cf5344cf0F81f2f34d79D` on Ethereum mainnet. No local blockchain setup is required to browse existing content.

---

## Smart Contract

The `Divvy` contract (`divvy.sol`) exposes the following public interface:

| Function | Description |
|---|---|
| `createPost(title, content, subName)` | Create a new post in a sub |
| `createReply(parentPostId, content)` | Reply to an existing post |
| `getPost(pid)` | Fetch a post by ID |
| `getRecentPostIdsInSub(subName, offset, limit)` | Paginated post IDs for a sub |
| `getRecentlyActiveSubs()` | Up to 50 recently active sub names |
| `upvotePost(postId)` / `downvotePost(postId)` | Vote on a post |
| `upvoteReply(replyId)` / `downvoteReply(replyId)` | Vote on a reply |

Post and reply `content` fields are stored as raw bytes (UTF-8 encoded).

---

## Post Formatting

Inside a post or reply body you can use the following special prefixes:

- `img:<url>` — force an image preview for any URL
- `eth-tx-img:<txhash>` — display the image embedded in the input data of an Ethereum transaction

Image previews are hidden by default and must be explicitly loaded (to avoid leaking your IP address to external image hosts).
