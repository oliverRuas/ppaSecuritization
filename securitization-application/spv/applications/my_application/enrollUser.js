'use strict';

const fs = require('fs');
const path = require('path');

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');

const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization/tfm-network/fabric-ca/');

async function main() {
    try {
        let args = process.argv.slice(2);

        const identityLabel = args[0];
        const orgNameWithoutDomain ='spv';

        // Read the connection profile.
        let connectionProfile = JSON.parse(fs.readFileSync(
            path.join(testNetworkRoot, 
                orgNameWithoutDomain, 
                `/connection-${orgNameWithoutDomain}.json`), 'utf8')
        );

        
        const ca = new FabricCAServices(connectionProfile['certificateAuthorities'][`rootca.spv.securitization.com`].url);

        // Create a new FileSystemWallet object for managing identities.
        const wallet = await Wallets.newFileSystemWallet('./wallet');

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(identityLabel);
        if (identity) {
            console.log(`An identity for the ${identityLabel} user already exists in the wallet`);
            return;
        }

        // Enroll the user, and import the new identity into the wallet.
        const enrollmentID = args[1];
        const enrollmentSecret = args[2];

        // optional
        let enrollmentAttributes = [];
        if (args.length > 3) {
            enrollmentAttributes = JSON.parse(args[3]);
        }

        let enrollmentRequest = {
            enrollmentID: enrollmentID,
            enrollmentSecret: enrollmentSecret,
            attr_reqs: enrollmentAttributes
        };
        const enrollment = await ca.enroll(enrollmentRequest);

        identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `spvMSP`,
            type: 'X.509',
        };

        await wallet.put(identityLabel, identity);
        console.log(`Successfully enrolled ${identityLabel} user and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to enroll user: ${error}`);
        process.exit(1);
    }
}

main().then(() => {
    console.log('User enrollment completed successfully.');
}).catch((e) => {
    console.log('User enrollment exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
