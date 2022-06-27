'use strict';

const fs = require('fs');
const path = require('path');
// const util = require('util');
// const nodemailer = require('nodemailer'); 
const { Wallets, Gateway } = require('fabric-network');

// When we finally use our own network, each user cert will have custom fields: email, userID... 
// so it is not necessary to provide userID
class AcceptPPA{
    async acceptPPA(acceptUser,ppaID) {
        const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');
        const gateway = new Gateway();
        const walletPath = path.join(__dirname,'../', 'wallet/',acceptUser);
        console.log(`wallet path: ${walletPath}`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        const identityLabel = acceptUser;

        const orgName = 'farmer';

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

        const date=new Date()
        const argDate=date.toUTCString();

        console.log('Connect to a Hyperledger Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use channel securitization.');
        const network = await gateway.getNetwork('securitization');

        console.log('Use SecuritizationContract.');
        const contract = network.getContract('securitizationcode','ppa.securitization.com');    
        try {
    
            const functionName = 'AcceptPPA';

            let tx = contract.createTransaction(functionName);
            tx.setEndorsingPeers(['peer.farmer.securitization.com','peer.originator.securitization.com','peer.spv.securitization.com','peer.investor.securitization.com','peer.ratingagency.securitization.com'])
            console.log('Submit ' + functionName + ' transaction.');
            await tx.submit(ppaID);

        } catch (error) {
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        }
    }
    
}

module.exports=AcceptPPA