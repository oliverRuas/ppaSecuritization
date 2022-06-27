# ppaSecuritization
Prerequisites (my setup):

- Virtual Machine // Own system (Ubuntu 20.04.2.0 LTS)

- Hyperledger Fabric Prerequisites (https://hyperledger-fabric.readthedocs.io/en/release-1.1/prereqs.html)
We must install:

sudo apt update
sudo apt-get install -y gcc make perl

sudo apt install -y git

Install docker (version>= 18.03) and make docker available as non-root user

Install docker-compose (version>=1.14.0) 

sudo apt install -y docker-compose

Install node js (version 12.x, however greater version will probably work as well)

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -sudo apt-get install -y nodejs

Golang (optional, required to go versions of chaincode). Download from website and

sudo tar -C /usr/local -xzf go1.16.linux-amd64.tar.gz

(changing the version in the .tar.gz file)

Add go binaries to path environment variable and apply changes

export PATH=$PATH:/usr/local/go/bin
source $HOME/.profile

Install build essential package
sudo apt install -y build-essential

Create a folder:

mkdir -p $HOME/go/src/github.com/hyperledger
cd $HOME/go/src/github.com/hyperledger

curl -sSL http://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9

Verify that the git-version retrieved is v2.2.2

cd fabric-samples
git checkout v2.2.2

From hyperledger folder clone fabric repository

git clone https://github.com/hyperledger/fabric
cd fabric
git checkout release-2.2

Note: after several deployment trials we realized that implementation did not work due to internet firewall, so be careful if you deploy your docker images within an educational internet connection.

From fabric-samples folder clone this repository.

Go to fabric-samples/securitization-network/tfm-network/scripts and run:

./up.sh

This command will create a network with 5 peers, 5 orderers, 5 CAs, 5 TLS CAs and one channel

In order to deploy chaincode, from scripts folder open chaincode.sh file, copy lines 1-20 and paste them on console. This should return "Chaincode code package identifier: [...]". Copy this identifier and paste into the environmental variable CC_PACKAGE_ID. Copy the rest of the chaincode.sh file and paste on console. This should return that chaincode has been installed and approved succesfully.

Now we can start with the business process. We will start by registering and enrolling clients (this can be done before chaincode installation). The registration process must be carried out by CA admin identity, so first we have to import these CA identities (one per Organization) into a wallet. If we go to fabric-samples/securitization-application/ folder there is a file called addToWallet.sh which can be executed on console and will add to a wallet our 5 CA admins. Now, we can register default users with the script registerandenrollUser.sh (this will enroll these identities too). Nevertheless, registration should be carried out by CA admin (script registerUser.sh) and the user registered should enrolled him/herself with the "secret" provided in the registration process. This script exists just to ease execution and prove chaincode functions easily. The registration process will generate a key that must be provided in order to get succesfully enrolled.

So two ways:

./registerandenrollUser.sh which will remove old wallets, create connection profile, add CA admins into wallets, register one default user per organization labeled as "user3@organization" (where organization can be originator, farmer, ratingagency, spv or investor) and automatically enroll them.

or you can go to organization/applications/my_application and execute

node addToWallet.js
node registerUser 'rcaadmin@originator' 'user@originator' '{"attrs": [{"name": "cif", "value": "12345678A"},{"name": "email", "value": "user_originator@gmail.com"},{"name": "role", "value": "client"}]}'
node enrollUser.js 'user@originator' 'user@originator' 'enrollmentSecret' '{"attrs": [{"name": "cif", "value": "12345678A"},{"name": "email", "value": "user_originator@gmail.com"},{"name": "role", "value": "client"}]}'


If we choose the easy way nothing left is to do, but if CAs just register their users (as it should be) they must enroll themselves. Investor and Irrigator clients will enroll by means of web application (which is addapted from Hyperledger Oreilly) and Originator, SPV and Rating Agency will enroll by means of SDK application. So go to farmer/applications/APPandUI and run

node app.js

and the same for investor. This will create two similar user interfaces allowing farmer and investor clients interact with the network. This is adapted from the book "Hands-On Smart Contract Development with Hyperledger Fabric V2" (Matt Zand, Xun Wu, and Mark Anthony Morris) 

copy and paste http://localhost:$PORT into your web browser

Now you can enroll farmer and investor clients from a Web Application.

Bussiness logic will start with Farmer Client requesting a PPA (Click RequestPPA).

Now, originator will query PPA requests (from originator/applications/my_application) run

node queryPPARequest.js "user3@originator"

Where "user3@originator" is the label of the Digital Identity saved into the wallet. And s/he will propose a PPA 

node ppaProposal.js "user3@originator" "farmerID" "ppaRequestID"

Farmer will Accept that PPA (UserInterface) and originator will mint a Pool gathering PPAs

node mintPPA.js "user3@originator" "farmerID" "PPAID" "poolName"

The rest of this bussiness logic follows with 'periodic functions', i.e. electricity bill, which is an update of the PPA state, its payment and maintenance request. In order to pay, cash on-chain must be minted, so from every organization/applications/my_application we can run

node mintMoney "user@organization" "amount to mint"

which will create a UTXO state with amount_to_mint*100 cash tokens (securitizationCoin)

Now with this ID, farmer client will be able to pay for her/his electricity bills.


Once pool has achieved the size SPV requires, originator and SPV must agree and carry out a Delivery v. Payment in order to transfer PPA Pool ownership and cash tokens [ref. Bank of Japan (BOJ); European Central Bank (ECB). Stella Project: Securities settlement systems: Delivery versus payment in a distributed ledger environment. (2018) ]. In this way, SPV will own rights over PPA future payments. Functions to achieve dvp (delivery v. payment):

First open a new console and go to spv/applications/my_application folder and run

node queryPool.js "user3@spv" "poolName"

node buyRequest.js "user3@spv" "ppaNumber" "price" "poolName" "poolID"


From originator/applications/my_application folder:

node queryBuyRequest.js "user3@originator" 	
node sellRequest.js "user3@originator" "price" "poolName" "poolID"


From spv/applications/my_application folder

node querySellRequest.js "user3@spv"
node signRequestSPV.js "user3@spv" "tokenID" "typeID" "buyRequestID" "sellRequestID" "sellRequestPrice" "poolName" "sellRequestBackedBy" "sellRequestOwner"

From originator/applications/my_application folder

node queryFullRequest.js "user3@originator"
node signRequestOriginator.js "user3@originator" "poolName" "poolID" "fullRequestID" "buyRequestIdentity" "buyRequestAmount" "buyRequestPrice"


Obviously you should change these attributes by its values. Now SPV is the owner of the pool and farmer payments will be addressed to it.

Now ratingagency organization will inspect the PPA Pool and give a rating score to that underlying assets. Open a new console and go to ratingagency/applications/my_application folder and run 

node queryPool "user3@ratingagency" "poolName"
node rating.js "user3@ratingagency" "poolName" "poolID" "RatingScore"

Now SPV can issue bonds according to this rating. Go to SPV folder and run 

node queryRating.js "user3@spv" 
node issueBonds "user3@spv" "ratingID" "couponFactor"

And spv will sell these bonds in a "secondary market" writing ask orders. 

node AskOrder "user3@spv" "Quantity" "Price" "TokenID" "TokenType"


In this last bussiness stage investors take place, and they can buy (Bid Order) these bonds, sell (Ask Order) them, redeem coupons, query OrderBook and query PPAs performance. A bid/ask checks whether it matches with any order and if it matches there is a mutual transference of bonds and cash tokens. However if there is no match, order is appended to order book and bonds or cash tokens are labeled as CanBeUsed: False. At this point there is no function to remove bid/ask order from order book, but it will be implemented in the near future.


Unit Test. Chaincode has been tested by means of unit testing. Folder securitization-chaincode/chaincodes/my_chaincodeTest and run npm run test. With these kind of tests we verify that chaincode works as it should and that it does not works as it expected to not work, e.g. access control, statements based on server time (redeem coupons), late electricity bill payment. However we were not able to mock 2 functions: getStateByPartialCompositeKey and getPPAHistory, which is a function that searches for old states of a key within the blockchain and not within the world state  

Note: CouchDB can be accessed in this way:
localhost:5984/_utils/#/ -> user couchdb-originator-admin password couchdb-originator-adminpw
localhost:5985/_utils/#/ -> user couchdb-farmer-admin password couchdb-farmer-adminpw
localhost:5986/_utils/#/ -> user couchdb-ratingagency-admin password couchdb-ratingagency-adminpw
localhost:5987/_utils/#/ -> user couchdb-spv-admin password couchdb-spv-adminpw
localhost:5988/_utils/#/ -> user couchdb-investor-admin password couchdb-investor-adminpw
