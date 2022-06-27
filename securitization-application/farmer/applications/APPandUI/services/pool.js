'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

// When we finally use our own network, each user cert will have custom fields: email, userID... 
// so it is not necessary to provide userID
class PoolAssets{
    async poolAssets(user,assetType) {
        const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');
        const gateway = new Gateway();
        const walletPath = path.join(__dirname,'../', 'wallet',user);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        try {    
            const identityLabel = user;
            const functionName = 'Pool'+assetType;
            
            const orgName = 'farmer';
            // const orgNameWithoutDomain = o;
    
            let connectionProfile = JSON.parse(fs.readFileSync(
                path.join(testNetworkRoot,
                    orgName,
                    `/connection-${orgName}.json`), 'utf8')
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
    
            console.log('Use SimpleContract.');
            const contract = network.getContract('securitizationcode','common.securitization.com');
        
            let tx = contract.createTransaction(functionName);
            tx.setEndorsingPeers(['peer.originator.securitization.com','peer.farmer.securitization.com','peer.ratingagency.securitization.com','peer.spv.securitization.com','peer.investor.securitization.com'])
    
            console.log('Submit ' + functionName + ' transaction.');

            let response = await tx.submit();
            
            setTimeout(() => {
                if (`${response}` !== '') {
                    console.log(`Response from ${functionName}: ${response}`);
                }
            }, 2000);
    
        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        } finally {
            console.log('Disconnect from the gateway.');
            gateway.disconnect();
        }
    }
    
}

module.exports=PoolAssets