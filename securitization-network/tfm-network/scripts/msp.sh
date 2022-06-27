export NEW_PATH=$(cd ../ && pwd)

# ORIGINATOR

MSP_PATH=$NEW_PATH/fabric-ca/originator/msp
mkdir -p $MSP_PATH
mkdir $MSP_PATH/cacerts && cp ../network/fabric-ca/originator/fabric-ca-server-originator/ca-cert.pem $MSP_PATH/cacerts/ca-cert.pem
mkdir $MSP_PATH/tlscacerts && cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $MSP_PATH/tlscacerts/ca-cert.pem
cp ./config.yaml $MSP_PATH

# FARMER

MSP_PATH=$NEW_PATH/fabric-ca/farmer/msp
mkdir -p $MSP_PATH
mkdir $MSP_PATH/cacerts && cp ../network/fabric-ca/farmer/fabric-ca-server-farmer/ca-cert.pem $MSP_PATH/cacerts/ca-cert.pem
mkdir $MSP_PATH/tlscacerts && cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $MSP_PATH/tlscacerts/ca-cert.pem
cp ./config.yaml $MSP_PATH

# RATINGAGENCY

MSP_PATH=$NEW_PATH/fabric-ca/ratingagency/msp
mkdir -p $MSP_PATH
mkdir $MSP_PATH/cacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-server-ratingagency/ca-cert.pem $MSP_PATH/cacerts/ca-cert.pem
mkdir $MSP_PATH/tlscacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $MSP_PATH/tlscacerts/ca-cert.pem
cp ./config.yaml $MSP_PATH

# SPV

MSP_PATH=$NEW_PATH/fabric-ca/spv/msp
mkdir -p $MSP_PATH
mkdir $MSP_PATH/cacerts && cp ../network/fabric-ca/spv/fabric-ca-server-spv/ca-cert.pem $MSP_PATH/cacerts/ca-cert.pem
mkdir $MSP_PATH/tlscacerts && cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $MSP_PATH/tlscacerts/ca-cert.pem
cp ./config.yaml $MSP_PATH

# INVESTOR

MSP_PATH=$NEW_PATH/fabric-ca/investor/msp
mkdir -p $MSP_PATH
mkdir $MSP_PATH/cacerts && cp ../network/fabric-ca/investor/fabric-ca-server-investor/ca-cert.pem $MSP_PATH/cacerts/ca-cert.pem
mkdir $MSP_PATH/tlscacerts && cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $MSP_PATH/tlscacerts/ca-cert.pem
cp ./config.yaml $MSP_PATH


#PEERS

# ORIGINATOR

LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/originator/peers/originator-peer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/originator/fabric-ca-server-originator/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/originator/peers/originator-peer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/originator/tls-ca/clients/originator-peer/msp/keystore -name *_sk)
cp ../network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls/peer-key.pem $TLS_FOLDER_PATH/server.key

# FARMER


LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/farmer/peers/farmer-peer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/farmer/fabric-ca-server-farmer/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/farmer/peers/farmer-peer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/tls/peer-key.pem $TLS_FOLDER_PATH/server.key


# RATINGAGENCY


LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/ratingagency/peers/ratingagency-peer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-server-ratingagency/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/ratingagency/peers/ratingagency-peer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/tls/peer-key.pem $TLS_FOLDER_PATH/server.key



# SPV


LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/spv/peers/spv-peer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/spv/fabric-ca-server-spv/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/spv/peers/spv-peer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/peer-key.pem $TLS_FOLDER_PATH/server.key


# INVESTOR



LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/investor/peers/investor-peer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/investor/fabric-ca-server-investor/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/investor/peers/investor-peer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/peer-key.pem $TLS_FOLDER_PATH/server.key



#ORDERERS

# ORIGINATOR

LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/originator/orderers/originator-orderer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/originator/fabric-ca-server-originator/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/ordererOrganizations/originator/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/ordererOrganizations/originator/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/originator/orderers/originator-orderer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/originator/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/originator/tls/orderer-key.pem $TLS_FOLDER_PATH/server.key


# FARMER
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/farmer/orderers/farmer-orderer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/farmer/fabric-ca-server-farmer/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/ordererOrganizations/farmer/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/ordererOrganizations/farmer/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/farmer/orderers/farmer-orderer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/farmer/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/farmer/tls/orderer-key.pem $TLS_FOLDER_PATH/server.key



# RATINGAGENCY
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/ratingagency/orderers/ratingagency-orderer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-server-ratingagency/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/ordererOrganizations/ratingagency/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/ordererOrganizations/ratingagency/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/ratingagency/orderers/ratingagency-orderer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/ratingagency/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/ratingagency/tls/orderer-key.pem $TLS_FOLDER_PATH/server.key



# SPV

LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/spv/orderers/spv-orderer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/spv/fabric-ca-server-spv/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/ordererOrganizations/spv/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/ordererOrganizations/spv/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/spv/orderers/spv-orderer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/spv/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/spv/tls/orderer-key.pem $TLS_FOLDER_PATH/server.key



#INVESTOR
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/investor/orderers/investor-orderer/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/investor/fabric-ca-server-investor/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/ordererOrganizations/investor/msp/signcerts $LOCAL_MSP_PATH/
key=$(find ../network/fabric-ca/organizations/ordererOrganizations/investor/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/investor/orderers/investor-orderer/tls

mkdir -p $TLS_FOLDER_PATH
cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $TLS_FOLDER_PATH/ca.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/investor/tls/cert.pem $TLS_FOLDER_PATH/server.crt
cp ../network/fabric-ca/organizations/ordererOrganizations/investor/tls/orderer-key.pem $TLS_FOLDER_PATH/server.key


#ADMINS 

# ORIGINATOR
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/originator/admins/originator-admin/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/originator/fabric-ca-server-originator/ca-cert.pem $LOCAL_MSP_PATH/cacerts/
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/originator/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/originator/ca/clients/originator-admin/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore
cp ../network/fabric-ca/organizations/peerOrganizations/originator/msp/keystore/admin-key.pem $LOCAL_MSP_PATH/keystore/priv.key

# Admin is a client, no tls folder needed, i think


# FARMER
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/farmer/admins/farmer-admin/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/farmer/fabric-ca-server-farmer/ca-cert.pem $LOCAL_MSP_PATH/cacerts/
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/farmer/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/farmer/ca/clients/farmer-admin/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore
cp ../network/fabric-ca/organizations/peerOrganizations/farmer/msp/keystore/admin-key.pem $LOCAL_MSP_PATH/keystore/priv.key


# RATINGAGENCY
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/ratingagency/admins/ratingagency-admin/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-server-ratingagency/ca-cert.pem $LOCAL_MSP_PATH/cacerts/
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/ratingagency/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/ratingagency/ca/clients/ratingagency-admin/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore
cp ../network/fabric-ca/organizations/peerOrganizations/ratingagency/msp/keystore/admin-key.pem $LOCAL_MSP_PATH/keystore/priv.key



#SPV
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/spv/admins/spv-admin/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/spv/fabric-ca-server-spv/ca-cert.pem $LOCAL_MSP_PATH/cacerts/
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/spv/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/spv/ca/clients/spv-admin/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore
cp ../network/fabric-ca/organizations/peerOrganizations/spv/msp/keystore/admin-key.pem $LOCAL_MSP_PATH/keystore/priv.key



#INVESTOR
LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/investor/admins/investor-admin/msp

mkdir -p $LOCAL_MSP_PATH
cp ./config.yaml $LOCAL_MSP_PATH
mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/investor/fabric-ca-server-investor/ca-cert.pem $LOCAL_MSP_PATH/cacerts/
mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/organizations/peerOrganizations/investor/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/investor/ca/clients/investor-admin/msp/keystore -name *_sk)
mkdir $LOCAL_MSP_PATH/keystore
cp ../network/fabric-ca/organizations/peerOrganizations/investor/msp/keystore/admin-key.pem $LOCAL_MSP_PATH/keystore/priv.key


# #CAs

# #originator
# LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/originator/cas/originator-ca/msp

# mkdir -p $LOCAL_MSP_PATH
# cp ./config.yaml $LOCAL_MSP_PATH
# mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/originator/ca/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/originator/tls-ca/ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/originator/ca/clients/admin/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/originator/ca/clients/admin/msp/keystore -name *_sk)
# mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


# TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/originator/tlscas/originator-tlsca/tls

# mkdir -p $TLS_FOLDER_PATH
# cp ../network/fabric-ca/originator/tls-ca/ca-cert.pem $TLS_FOLDER_PATH/ca.crt
# cp ../network/fabric-ca/originator/tls-ca/clients/admin/msp/signcerts/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/originator/tls-ca/clients/admin/msp/keystore -name *_sk)
# cp $key $TLS_FOLDER_PATH/server.key


# #FARMER
# LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/farmer/cas/farmer-ca/msp

# mkdir -p $LOCAL_MSP_PATH
# cp ./config.yaml $LOCAL_MSP_PATH
# mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/farmer/ca/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/farmer/tls-ca/ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/farmer/ca/clients/admin/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/farmer/ca/clients/admin/msp/keystore -name *_sk)
# mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key




# TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/farmer/tlscas/farmer-tlsca/tls

# mkdir -p $TLS_FOLDER_PATH
# cp ../network/fabric-ca/farmer/tls-ca/ca-cert.pem $TLS_FOLDER_PATH/ca.crt
# cp ../network/fabric-ca/farmer/tls-ca/clients/admin/msp/signcerts/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/farmer/tls-ca/clients/admin/msp/keystore -name *_sk)
# cp $key $TLS_FOLDER_PATH/server.key


# #ratingagency
# LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/ratingagency/cas/ratingagency-ca/msp

# mkdir -p $LOCAL_MSP_PATH
# cp ./config.yaml $LOCAL_MSP_PATH
# mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/ratingagency/ca/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/ratingagency/tls-ca/ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/ratingagency/ca/clients/admin/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/ratingagency/ca/clients/admin/msp/keystore -name *_sk)
# mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key




# TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/ratingagency/tlscas/ratingagency-tlsca/tls

# mkdir -p $TLS_FOLDER_PATH
# cp ../network/fabric-ca/ratingagency/tls-ca/ca-cert.pem $TLS_FOLDER_PATH/ca.crt
# cp ../network/fabric-ca/ratingagency/tls-ca/clients/admin/msp/signcerts/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/ratingagency/tls-ca/clients/admin/msp/keystore -name *_sk)
# cp $key $TLS_FOLDER_PATH/server.key



# #SPV
# LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/spv/cas/spv-ca/msp

# mkdir -p $LOCAL_MSP_PATH
# cp ./config.yaml $LOCAL_MSP_PATH
# mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/spv/ca/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/spv/tls-ca/ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/spv/ca/clients/admin/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/spv/ca/clients/admin/msp/keystore -name *_sk)
# mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


# TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/spv/tlscas/spv-tlsca/tls

# mkdir -p $TLS_FOLDER_PATH
# cp ../network/fabric-ca/spv/tls-ca/ca-cert.pem $TLS_FOLDER_PATH/ca.crt
# cp ../network/fabric-ca/spv/tls-ca/clients/admin/msp/signcerts/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/spv/tls-ca/clients/admin/msp/keystore -name *_sk)
# cp $key $TLS_FOLDER_PATH/server.key


# #INVESTOR
# LOCAL_MSP_PATH=$NEW_PATH/fabric-ca/investor/cas/investor-ca/msp

# mkdir -p $LOCAL_MSP_PATH
# cp ./config.yaml $LOCAL_MSP_PATH
# mkdir $LOCAL_MSP_PATH/cacerts && cp ../network/fabric-ca/investor/ca/ca-cert.pem $LOCAL_MSP_PATH/cacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/tlscacerts && cp ../network/fabric-ca/investor/tls-ca/ca-cert.pem $LOCAL_MSP_PATH/tlscacerts/ca-cert.pem
# mkdir $LOCAL_MSP_PATH/signcerts && cp -r ../network/fabric-ca/investor/ca/clients/admin/msp/signcerts $LOCAL_MSP_PATH/
# key=$(find ../network/fabric-ca/investor/ca/clients/admin/msp/keystore -name *_sk)
# mkdir $LOCAL_MSP_PATH/keystore && cp $key $LOCAL_MSP_PATH/keystore/priv.key


# TLS_FOLDER_PATH=$NEW_PATH/fabric-ca/investor/tlscas/investor-tlsca/tls

# mkdir -p $TLS_FOLDER_PATH
# cp ../network/fabric-ca/investor/tls-ca/ca-cert.pem $TLS_FOLDER_PATH/ca.crt
# cp ../network/fabric-ca/investor/tls-ca/clients/admin/msp/signcerts/cert.pem $TLS_FOLDER_PATH/server.crt
# key=$(find ../network/fabric-ca/investor/tls-ca/clients/admin/msp/keystore -name *_sk)
# cp $key $TLS_FOLDER_PATH/server.key


