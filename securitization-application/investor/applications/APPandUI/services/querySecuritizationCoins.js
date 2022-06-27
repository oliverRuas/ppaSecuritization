'use strict';

const fs = require('fs');
const path = require('path');
// const util = require('util');
const nodemailer = require('nodemailer'); 
const { Wallets, Gateway } = require('fabric-network');
// const username='User1@org1.example.com';

// When we finally use our own network, each user cert will have custom fields: email, userID... 
// so it is not necessary to provide userID
class QuerySecuritizationCoins{
    async querySecuritizationCoins(user) {
        const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');
        const gateway = new Gateway();
        const walletPath = path.join(__dirname,'../', 'wallet',user);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        try {
            const identityLabel = user;
            const functionName = 'QueryMyCoins';
            
            const orgNameWithoutDomain = 'investor';
    
            let connectionProfile = JSON.parse(fs.readFileSync(
                path.join(testNetworkRoot,
                    orgNameWithoutDomain,
                    `/connection-${orgNameWithoutDomain}.json`), 'utf8')
            );
    
            let connectionOptions = {
                identity: identityLabel,
                wallet: wallet,
                discovery: { enabled: true, asLocalhost: true }
            };
    
            console.log('Connect to a Hyperledger Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);
    
            console.log('Use channel securitization.');
            const network = await gateway.getNetwork('securitization');
    
            console.log('Use Contract.');
            const contract = network.getContract('securitizationcode','common.securitization.com');
        
            let tx = contract.createTransaction(functionName);
            tx.setEndorsingPeers(['peer.originator.securitization.com','peer.farmer.securitization.com','peer.ratingagency.securitization.com','peer.spv.securitization.com','peer.investor.securitization.com'])

            console.log('Submit ' + functionName + ' transaction.');
            const response = await tx.submit();
    
            setTimeout(() => {
                if (`${response}` !== '') {
                    console.log(`Response from ${functionName}: ${response}`);
                }
            }, 2000);
            return response?JSON.parse(response):response;
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        } finally {
            console.log('Disconnect from the gateway.');
            gateway.disconnect();
        }
    }
    
}

module.exports=QuerySecuritizationCoins