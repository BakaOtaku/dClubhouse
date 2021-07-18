<p align="center"><img src="/client/public/cat_1.svg" align="center" width="250"></p>
<h6 align="center">Dynamic NFT based decentralized Clubhouse.</h6>

Cattery is a decentralised Clubhouse dynamic NFT based membership dapp. This allows decentralised membership based platform for Clubhouse where even users can join even with anonymity.

### Live Links

- [👨🏻‍💼 PPT File](https://www.canva.com/design/DAEkAcwe2Jw/BXgJ9ug4KJODVKDo7gIlYA/view)
- [💻 Presentation Video](https://youtu.be/jh7_RvPqvfQ)
- [👩🏻‍💻 Deployed Contract](https://dora.coz.io/contract/neo3/mainnet/0xfbf28fbe5925b0e6c0b878207ee4ffc9a429d37b)

### Inspiration

Clubhouse is an invitation-only social media app for iOS and Android where users can communicate in voice chat rooms that accommodate groups of thousands of people. The audio-only app hosts live discussions, with opportunities to participate through speaking and listening. We find this use case suitable for an NFT based model. Only each NFT holder will have a permission to join clubhouse. Each user has one NFT and he can mint 2 NFTs for other people which he wants to invite to the platform.

### Idea

- Dynamic NFT based membership the dapp.
- This allows a decentralized membership-based platform for Clubhouse.
- Even users can join even with anonymity.
- Earn rewards just by being part of the community.

### Tokenomics

We will have a limited supply of Whisker (WSK) NEP-17 tokens which any invitee will be asked to stake only then he will be eligible to receive an NFT from others. Earning rewards while being a member of the ecosystem.

### Tech Stack

<summary>Blockchain</summary>
<ul>
	  <li>Neo Blockchain</li>
		<li>Neo Native Oracle Service</li>
</ul>

<summary>Smart Contracts</summary>
<ul>
	  <li>C#</li>
</ul>

<summary>Frontend</summary>
<ul>
	  <li>Next.js</li>
		<li>Neoline.js</li>
		<li>Socket io</li>
		<li>Signal Client</li>
</ul>

<summary>Backend (JS server)</summary>
<ul>
	  <li>Express</li>
		<li>Socket io</li>
		<li>Mongodb</li>
</ul>

<summary>Backend (Python server)</summary>
<ul>
	  <li>Keras / Tensorflow</li>
		<li>GAN Machine Learning Model</li>
</ul>

### User Acquisition Model

Velvet rope strategy and FOMO 💸😉.

The clubhouse has over 10 million users and growing, let us say even if we are able to capture 10% of these users then we will be able to have 1 million users for the clubhouse.

We will make great use of something known as the "Velvet Rope strategy".

Velvet rope strategy means trying to create loyal customers out of the existing user base by creating exclusivity with services or product offerings.

In short, it's a way to add a level of scarcity and Fomo to any new offer.

### What's next for dClubhouse

Create a membership marketplace using WSK NEP-17 tokens

Give exclusive memberships like more room capacity, exclusive joining for users staking more tokens.

### How to set up?

Genesis private key for testing

```
KwPMakChCEpGHtc919QvJcaHpwjD7KR8XcwZe15NK6AQGbe41VkX
```

Client Set Up

```bash
# git clone
cd client
# create and addd env variables
vim .env.local
# add variables
MONGO_URI=mongodb+srv:// userid : pass @ url /myFirstDatabase?retryWrites=true&w=majority
MONGO_DB=clubhouse
```

```bash
yarn
yarn run dev
```

Setting up backend 

```bash
# git clone
cd backend
# create and addd env variables
vim .env
# add variables
MONGO_URI=mongodb+srv:// userid : pass @ url /myFirstDatabase?retryWrites=true&w=majority
MONGO_DB=clubhouse
```

```bash
docker build -t back .
docker run -p 80:80
```

### Team

- [ 👨🏻‍🎓 Arpit Srivastava](https://github.com/fuzious)
- [ 👨🏻‍💻 Aniket Dixit ](https://github.com/dixitaniket)
- [ 🌊 Aman Raj](https://amanraj.dev/)

<p align="center"> Made with ❤️ and 💻</p>
