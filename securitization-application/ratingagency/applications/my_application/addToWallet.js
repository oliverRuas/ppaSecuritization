'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/network/fabric-ca/');


async function main() {
    try {
        const wallet = await Wallets.newFileSystemWallet('./ratingagency/applications/my_application/wallet');
        
        const predefinedOrg = {
            name: 'ratingagency',
            mspId: 'ratingagencyMSP',
            user: 'rcaadmin'
        };

        const credPath = path.join(testNetworkRoot, `${predefinedOrg.name}`, '/fabric-ca-client/',`${predefinedOrg.name}-ca/`);
            
        const mspFolderPath = path.join(credPath, `${predefinedOrg.user}`, '/msp');
        
        // expecting only one cert file and one key file to be in the directories
        const certFile = path.join(mspFolderPath, '/signcerts/', fs.readdirSync(path.join(mspFolderPath, '/signcerts'))[0]);
        const keyFile = path.join(mspFolderPath, '/keystore/', fs.readdirSync(path.join(mspFolderPath, '/keystore'))[0]);

        const cert = fs.readFileSync(certFile).toString();
        const key = fs.readFileSync(keyFile).toString();

        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: predefinedOrg.mspId,
            type: 'X.509',
        };

        const identityLabel = `${predefinedOrg.user}@${predefinedOrg.name}`;
        await wallet.put(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}
        
main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
