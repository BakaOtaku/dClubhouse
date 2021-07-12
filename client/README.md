# dClubhouse

### Run Locally

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

Project Flow

```
/account
  - check getOwnerActive
      --- if 1 then already locked ask for nft
      --- else 0 lock tokens
  - check ownernft url
     -- if locked and minted redirect to /wallet

/wallet
  - check getInviteeNftDetails
      --- if gets invite nft url then
            --- fetch number of nft left
            --- show nft and refer option
      --- else show get nft to access this page
  - check ownernft url
     -- if locked and minted redirect to /wallet
```

```
- neo wallet
- neo call function
- UI changes
-  display all rooms page
-  Account ->
   -- fetch balance nft
     -- (new user) lock tokens -> check nft
     -- (old user) give nft ref
-> structure
 --- connect wallet
 --- check nft bal && create room
 --- join room
```
