'use strict';

const fs = require('fs');
const path = require('path');

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');

class EnrollUser{
    async enrollUser(identityLabel,enrollmentID,enrollmentSecret,enrollmentCIF, enrollmentEmail){
        try {
            const testNetworkRoot = path.resolve(require('os').homedir(), 'go/src/github.com/hyperledger/fabric-samples/securitization-network/tfm-network/fabric-ca/');

    
            const orgNameWithoutDomain ='farmer';
    
            // Read the connection profile.
            let connectionProfile = JSON.parse(fs.readFileSync(
                path.join(testNetworkRoot, 
                    orgNameWithoutDomain, 
                    `/connection-${orgNameWithoutDomain}.json`), 'utf8')
            );
    
            
            const ca = new FabricCAServices(connectionProfile['certificateAuthorities'][`rootca.farmer.securitization.com`].url);
    
    
            // Create a new FileSystemWallet object for managing identities.
            const wallet = await Wallets.newFileSystemWallet('../APPandUI/wallet/'+identityLabel+'/');
    
            // Check to see if we've already enrolled the user.
            let identity = await wallet.get(identityLabel);
            if (identity) {
                console.log(`An identity for the ${identityLabel} user already exists in the wallet`);
                return;
            }
    
            // // Enroll the user, and import the new identity into the wallet.
            // const enrollmentID = args[1];
            // const enrollmentSecret = args[2];
    
            // optional
            let client='client'
            let enrollmentAttributesString = '[{"name": "role", "value": "'+client+'"},{"name": "cif", "value": "'+enrollmentCIF+'"},{"name": "email", "value": "'+enrollmentEmail+'"}]';
            console.log(`enrollmentAttributesString: ${enrollmentAttributesString}`);
            let enrollmentAttributes=JSON.parse(enrollmentAttributesString);
            let enrollmentRequest = {
                enrollmentID: enrollmentID,
                enrollmentSecret: enrollmentSecret,
                attr_reqs: enrollmentAttributes
            };
            const enrollment = await ca.enroll(enrollmentRequest);
    
            // const orgNameCapitalized = orgNameWithoutDomain.charAt(0).toUpperCase() + orgNameWithoutDomain.slice(1);
            identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: `farmerMSP`,
                type: 'X.509',
            };
    
            let response=await wallet.put(identityLabel, identity);
            console.log(`Successfully enrolled ${identityLabel} user and imported it into the wallet`);
            return response?JSON.parse(response):response;

        } catch (error) {
            console.error(`Failed to enroll user: ${error}`);
            process.exit(1);
        }
    
    }
}


module.exports=EnrollUser;
