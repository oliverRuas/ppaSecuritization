
'use strict';

const fs = require('fs');
const path = require('path');

const { Wallets, Gateway } = require('fabric-network');

class CreateOrder{
    async createOrder(user,orderType,argAmount,argPrice,argID,argTypeID) {
        const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');
        const gateway = new Gateway();
        const walletPath = path.join(__dirname,'../', 'wallet',user);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        try {    
            const identityLabel = user;
            const functionName = orderType+'Order';
    
            const orgName = 'investor';
            // const orgNameWithoutDomain = orgName.split('.')[0];
    
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
            // const date=new Date()
            // const argDate=date.toUTCString();

            console.log('Connect to a Hyperledger Fabric gateway.');
            await gateway.connect(connectionProfile, connectionOptions);
    
            console.log('Use channel securitization.');
            const network = await gateway.getNetwork('securitization');
    
            console.log('Use SimpleContract.');
            const contract = network.getContract('securitizationcode','servicing.securitization.com');

            let tx = contract.createTransaction(functionName);
    
            tx.setEndorsingPeers(['peer.originator.securitization.com','peer.farmer.securitization.com','peer.ratingagency.securitization.com','peer.spv.securitization.com','peer.investor.securitization.com'])
            console.log('Submit ' + functionName + ' transaction.');
            const response = await tx.submit(argAmount,argPrice,argID,argTypeID);
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


module.exports=CreateOrder