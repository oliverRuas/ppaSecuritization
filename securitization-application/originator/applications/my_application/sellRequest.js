'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');


async function main() {
    const gateway = new Gateway();
    const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');


    try {
        let args = process.argv.slice(2);

        const identityLabel = args[0];

        const functionName = 'SellRequest';
        const chaincodeArgs = args.slice(1);

        const orgNameWithoutDomain = 'originator';

        const wallet = await Wallets.newFileSystemWallet('../APPandUI/wallet/'+identityLabel+'/');


        let connectionProfile = JSON.parse(fs.readFileSync(
            path.join(testNetworkRoot,  
                orgNameWithoutDomain, 
                `/connection-${orgNameWithoutDomain}.json`), 'utf8')
        );


        let connectionOptions = {
            identity: identityLabel,
            wallet: wallet,
            discovery: {enabled: true, asLocalhost: true}
        };

        console.log('Connect to a Hyperledger Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use channel "securitization".');
        const network = await gateway.getNetwork('securitization');

        console.log('Use SecuritizationContract.');
        const contract = network.getContract('securitizationcode','bonds.securitization.com');
        let tx = contract.createTransaction(functionName);

        tx.setEndorsingPeers(['peer.originator.securitization.com','peer.farmer.securitization.com','peer.ratingagency.securitization.com','peer.spv.securitization.com','peer.investor.securitization.com'])
        console.log('Submit ' + functionName + ' transaction.');
        const response = await tx.submit(...chaincodeArgs);

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

main().then(() => {
    console.log('Transaction execution completed successfully.');
}).catch((e) => {
    console.log('Transaction execution exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});