export NEW_PATH=$(cd ../ && pwd)

# ORIGINATOR CA
export CA_PATH=$NEW_PATH/network/fabric-ca/originator
mkdir $CA_PATH/fabric-ca-server-originator
mkdir $CA_PATH/fabric-ca-server-originator/tls
cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-originator/tls 
key=$(find ../network/fabric-ca/originator/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
cp $key $CA_PATH/fabric-ca-server-originator/tls/key.pem


# FARMER CA
export CA_PATH=$NEW_PATH/network/fabric-ca/farmer
mkdir $CA_PATH/fabric-ca-server-farmer
mkdir $CA_PATH/fabric-ca-server-farmer/tls
cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-farmer/tls 
key=$(find ../network/fabric-ca/farmer/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
cp $key $CA_PATH/fabric-ca-server-farmer/tls/key.pem


# RATINGAGENCY CA
export CA_PATH=$NEW_PATH/network/fabric-ca/ratingagency
mkdir $CA_PATH/fabric-ca-server-ratingagency
mkdir $CA_PATH/fabric-ca-server-ratingagency/tls
cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-ratingagency/tls 
key=$(find ../network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
cp $key $CA_PATH/fabric-ca-server-ratingagency/tls/key.pem


# SPV CA
export CA_PATH=$NEW_PATH/network/fabric-ca/spv
mkdir $CA_PATH/fabric-ca-server-spv
mkdir $CA_PATH/fabric-ca-server-spv/tls
cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-spv/tls 
key=$(find ../network/fabric-ca/spv/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
cp $key $CA_PATH/fabric-ca-server-spv/tls/key.pem


# INVESTOR CA
export CA_PATH=$NEW_PATH/network/fabric-ca/investor
mkdir $CA_PATH/fabric-ca-server-investor
mkdir $CA_PATH/fabric-ca-server-investor/tls
cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-investor/tls 
key=$(find ../network/fabric-ca/investor/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
cp $key $CA_PATH/fabric-ca-server-investor/tls/key.pem