'use strict';

const fs = require('fs');
const path = require('path');
// const util = require('util');
const { Wallets, Gateway } = require('fabric-network');

class QueryPPA{
    async queryPPA(user,userID) {
        const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');
        const gateway = new Gateway();
        const walletPath = path.join(__dirname,'../', 'wallet',user);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        try {
    
            const identityLabel = user;
            const functionName = 'QueryPPA';
           
            const orgName = 'investor';
            // const orgNameWithoutDomain = orgName.split('.')[0];
    
            let connectionProfile = JSON.parse(fs.readFileSync(
                path.join(testNetworkRoot,
                    orgName,
                    `/connection-${orgName}.json`), 'utf8')
            );
            //We must define who can have access to this data using UserID
    
            let connectionOptions = {
                identity: identityLabel,
                wallet: wallet,
                discovery: { enabled: true, asLocalhost: true }
            };
    
            console.log('Connect to a Hyperledger Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);
    
            console.log('Use channel "securitization".');
            const network = await gateway.getNetwork('securitization');
    
            console.log('Use Contract.');
            const contract = network.getContract('securitizationcode','ppa.securitization.com');
            let tx = contract.createTransaction(functionName);
    
            console.log('Submit ' + functionName + ' transaction.');
            const response = await tx.submit(userID);
    
            setTimeout(() => {
                if (`${response}` !== '') {
                    console.log(`Response from ${functionName}: ${response}`);
                }
            }, 20000);
    
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        } finally {
            console.log('Disconnect from the gateway.');
            gateway.disconnect();
        }
    }
    
}


module.exports=QueryPPA