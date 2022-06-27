'use strict';

const fs = require('fs');
const path = require('path');

const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway } = require('fabric-network');

const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca');

async function main() {
    try {
        // Create a new FileSystemWallet object for managing identities.
        const wallet = await Wallets.newFileSystemWallet('./spv/applications/my_application/wallet/');

        // Process input parameters.
        let args = process.argv.slice(2);

        const registrarLabel = args[0];

        // Check to see if we've already enrolled the registrar user.
        let registrarIdentity = await wallet.get(registrarLabel);
        if (!registrarIdentity) {
            console.log(`An identity for the registrar user ${registrarLabel} does not exist in the wallet`);
            console.log('Run the enrollUser.js application before retrying');
            return;
        }

        const orgNameWithoutDomain ='spv';

        // Read the connection profile.
        let connectionProfile = JSON.parse(fs.readFileSync(
            path.join(testNetworkRoot, 
                orgNameWithoutDomain, 
                `/connection-${orgNameWithoutDomain}.json`), 'utf8')
        );

        // Create a new CA client for interacting with the CA.
        const ca = new FabricCAServices(connectionProfile['certificateAuthorities'][`rootca.spv.securitization.com`].url);

        const provider = wallet.getProviderRegistry().getProvider(registrarIdentity.type);
		const registrarUser = await provider.getUserContext(registrarIdentity, registrarLabel);

        const enrollmentID = args[1];

        // optional parameters
        let optional = {};
        if (args.length > 2) {
            optional = JSON.parse(args[2]);
        }


        // Register the user and return the enrollment secret.
        let registerRequest = {
            enrollmentID: enrollmentID,
            enrollmentSecret: optional.secret || "",
            role: 'client',
            attrs: optional.attrs || []
        };

        const secret = await ca.register(registerRequest, registrarUser);
        console.log(`Successfully registered the user with the ${enrollmentID} enrollment ID and ${secret} enrollment secret.`);
    
        const identityLabel = `${enrollmentID}@${orgNameWithoutDomain}`;

        const my_wallet = await Wallets.newFileSystemWallet('./spv/applications/APPandUI/wallet/'+identityLabel);

        // Check to see if we've already enrolled the user.
        let identity = await my_wallet.get(enrollmentID);
        if (identity) {
            console.log(`An identity for the ${enrollmentID} user already exists in the wallet`);
            return;
        }

        let client='client'

        let enrollmentAttributesString = '[{"name": "role", "value": "'+client+'"},{"name": "cif", "value": "'+optional.attrs[0].value+'"},{"name": "email", "value": "'+optional.attrs[1].value+'"}]';
        let enrollmentAttributes=JSON.parse(enrollmentAttributesString);

        let enrollmentRequest = {
            enrollmentID: enrollmentID,
            enrollmentSecret: secret,
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

        let pathToFile = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/spv/users/'+identityLabel+'/');
        // let data = JSON.stringify(student);
        fs.writeFileSync(pathToFile+'/cert.pem', enrollment.certificate);
        fs.writeFileSync(pathToFile+'/priv.key', enrollment.key.toBytes());

        await wallet.put(identityLabel, identity);
        await my_wallet.put(identityLabel, identity);

        console.log(`Successfully enrolled ${enrollmentID} user and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
}

main().then(() => {
    console.log('User registration completed successfully.');
}).catch((e) => {
    console.log('User registration exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
