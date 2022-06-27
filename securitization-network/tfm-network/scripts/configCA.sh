export NEW_PATH=$(cd ../ && pwd)

# ORIGINATOR CA
cp ./network-ca/originator/fabric-ca-server-config.yaml $NEW_PATH/network/fabric-ca/originator/fabric-ca-server-originator/


# export CA_PATH=$NEW_PATH/network/fabric-ca/originator
# mkdir $CA_PATH/fabric-ca-server-originator
# mkdir $CA_PATH/fabric-ca-server-originator/tls
# cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-originator/tls 
# key=$(find ../network/fabric-ca/originator/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
# cp $key $CA_PATH/fabric-ca-server-originator/tls/key.pem


# FARMER CA
cp ./network-ca/farmer/fabric-ca-server-config.yaml $NEW_PATH/network/fabric-ca/farmer/fabric-ca-server-farmer/
# export CA_PATH=$NEW_PATH/network/fabric-ca/farmer
# mkdir $CA_PATH/fabric-ca-server-farmer
# mkdir $CA_PATH/fabric-ca-server-farmer/tls
# cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-farmer/tls 
# key=$(find ../network/fabric-ca/farmer/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
# cp $key $CA_PATH/fabric-ca-server-farmer/tls/key.pem


# RATINGAGENCY CA
cp ./network-ca/ratingagency/fabric-ca-server-config.yaml $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-server-ratingagency/

# export CA_PATH=$NEW_PATH/network/fabric-ca/ratingagency
# mkdir $CA_PATH/fabric-ca-server-ratingagency
# mkdir $CA_PATH/fabric-ca-server-ratingagency/tls
# cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-ratingagency/tls 
# key=$(find ../network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
# cp $key $CA_PATH/fabric-ca-server-ratingagency/tls/key.pem


# SPV CA
cp ./network-ca/spv/fabric-ca-server-config.yaml $NEW_PATH/network/fabric-ca/spv/fabric-ca-server-spv/
# export CA_PATH=$NEW_PATH/network/fabric-ca/spv
# mkdir $CA_PATH/fabric-ca-server-spv
# mkdir $CA_PATH/fabric-ca-server-spv/tls
# cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-spv/tls 
# key=$(find ../network/fabric-ca/spv/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
# cp $key $CA_PATH/fabric-ca-server-spv/tls/key.pem


# INVESTOR CA
cp ./network-ca/investor/fabric-ca-server-config.yaml $NEW_PATH/network/fabric-ca/investor/fabric-ca-server-investor/
# export CA_PATH=$NEW_PATH/network/fabric-ca/investor
# mkdir $CA_PATH/fabric-ca-server-investor
# mkdir $CA_PATH/fabric-ca-server-investor/tls
# cp $CA_PATH/fabric-ca-client/tls-ca/rcaadmin/msp/signcerts/cert.pem $CA_PATH/fabric-ca-server-investor/tls 
# key=$(find ../network/fabric-ca/investor/fabric-ca-client/tls-ca/rcaadmin/msp/keystore -name *_sk)
# cp $key $CA_PATH/fabric-ca-server-investor/tls/key.pem
