export NEW_PATH=$(cd ../ && pwd)

mkdir $NEW_PATH/network/fabric-ca/organizations
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/

mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor



# mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls


# mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/tls


# mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/tls


# mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls


# mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/msp
mkdir $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls


mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor

cp $NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls/tls-cert.pem
cp $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/tls/tls-cert.pem
cp $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/tls/tls-cert.pem
cp $NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/tls-cert.pem
cp $NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/tls-cert.pem


cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/msp



# Register admins

export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp
# fabric-ca-client register --id.name originator-admin --id.secret originator-adminpw -u https://localhost:7055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost'
fabric-ca-client register --id.name originator-admin --id.secret originator-adminpw -u https://localhost:7055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.originator.securitization.com'


export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp
fabric-ca-client register --id.name farmer-admin --id.secret farmer-adminpw -u https://localhost:8055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost, *.farmer.securitization.com'



export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp
fabric-ca-client register --id.name ratingagency-admin --id.secret ratingagency-adminpw -u https://localhost:9055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.ratingagency.securitization.com'



export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp
fabric-ca-client register --id.name spv-admin --id.secret spv-adminpw -u https://localhost:10055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.spv.securitization.com'


export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp
fabric-ca-client register --id.name investor-admin --id.secret investor-adminpw -u https://localhost:11055 --mspdir $FABRIC_CA_CLIENT_HOME --id.type admin --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.investor.securitization.com'


# Enroll identity. MSPDIR points to org msp folder

export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/msp
fabric-ca-client enroll -u https://originator-admin:originator-adminpw@localhost:7055 --mspdir $FABRIC_CA_CLIENT_HOME --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost, *.originator.securitization.com'


export CERTS_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/msp
mv $CERTS_PATH/signcerts/cert.pem $CERTS_PATH/signcerts/admin-cert.pem 
key=$(find $CERTS_PATH/keystore -name *_sk)
mv $key $CERTS_PATH/keystore/admin-key.pem




export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/msp
fabric-ca-client enroll -u https://farmer-admin:farmer-adminpw@localhost:8055 --mspdir $FABRIC_CA_CLIENT_HOME --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.farmer.securitization.com'

export CERTS_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/msp
mv $CERTS_PATH/signcerts/cert.pem $CERTS_PATH/signcerts/admin-cert.pem 
key=$(find $CERTS_PATH/keystore -name *_sk)
mv $key $CERTS_PATH/keystore/admin-key.pem



export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/msp
fabric-ca-client enroll -u https://ratingagency-admin:ratingagency-adminpw@localhost:9055 --mspdir $FABRIC_CA_CLIENT_HOME --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.ratingagency.securitization.com'

export CERTS_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/msp
mv $CERTS_PATH/signcerts/cert.pem $CERTS_PATH/signcerts/admin-cert.pem 
key=$(find $CERTS_PATH/keystore -name *_sk)
mv $key $CERTS_PATH/keystore/admin-key.pem


export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/msp
fabric-ca-client enroll -u https://spv-admin:spv-adminpw@localhost:10055 --mspdir $FABRIC_CA_CLIENT_HOME --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.spv.securitization.com'

export CERTS_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/msp
mv $CERTS_PATH/signcerts/cert.pem $CERTS_PATH/signcerts/admin-cert.pem 
key=$(find $CERTS_PATH/keystore -name *_sk)
mv $key $CERTS_PATH/keystore/admin-key.pem

export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/msp
fabric-ca-client enroll -u https://investor-admin:investor-adminpw@localhost:11055 --mspdir $FABRIC_CA_CLIENT_HOME --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.investor.securitization.com'

export CERTS_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/msp
mv $CERTS_PATH/signcerts/cert.pem $CERTS_PATH/signcerts/admin-cert.pem 
key=$(find $CERTS_PATH/keystore -name *_sk)
mv $key $CERTS_PATH/keystore/admin-key.pem


# issue certificates for peer node identity and for peer server tls

export CSR_NAMES_originator="C=SP,ST=originatorState,L=originatorLocation,O=originator,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls/tls-cert.pem

fabric-ca-client register --id.name peer.originator.securitization.com --id.secret peer.originator.securitization.compw --id.type peer -u https://localhost:7054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer
fabric-ca-client enroll -u https://peer.originator.securitization.com:peer.originator.securitization.compw@localhost:7054 --csr.names "$CSR_NAMES_originator"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.originator.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/peer-key.pem






export CSR_NAMES_farmer="C=SP,ST=farmerState,L=farmerLocation,O=farmer,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.farmer.securitization.com --id.secret peer.farmer.securitization.compw --id.type peer -u https://localhost:8054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer
fabric-ca-client enroll -u https://peer.farmer.securitization.com:peer.farmer.securitization.compw@localhost:8054 --csr.names "$CSR_NAMES_farmer"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost, *.farmer.securitization.com"


export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/peer-key.pem



export CSR_NAMES_ratingagency="C=SP,ST=ratingagencyState,L=ratingagencyLocation,O=ratingagency,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.ratingagency.securitization.com --id.secret peer.ratingagency.securitization.compw --id.type peer -u https://localhost:9054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer
fabric-ca-client enroll -u https://peer.ratingagency.securitization.com:peer.ratingagency.securitization.compw@localhost:9054 --csr.names "$CSR_NAMES_ratingagency"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.ratingagency.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/peer-key.pem


export CSR_NAMES_spv="C=SP,ST=spvState,L=spvLocation,O=spv,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.spv.securitization.com --id.secret peer.spv.securitization.compw --id.type peer -u https://localhost:10054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer
fabric-ca-client enroll -u https://peer.spv.securitization.com:peer.spv.securitization.compw@localhost:10054 --csr.names "$CSR_NAMES_spv"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.spv.securitization.com"


export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/peer-key.pem

export CSR_NAMES_investor="C=SP,ST=investorState,L=investorLocation,O=investor,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.investor.securitization.com --id.secret peer.investor.securitization.compw --id.type peer -u https://localhost:11054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer
fabric-ca-client enroll -u https://peer.investor.securitization.com:peer.investor.securitization.compw@localhost:11054 --csr.names "$CSR_NAMES_investor"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.investor.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/peer-key.pem


rm -r $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/msp/




export CSR_NAMES_originator="C=SP,ST=originatorState,L=originatorLocation,O=originator,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.originator.securitization.com --id.secret peer.originator.securitization.compw --id.type peer -u https://localhost:7055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer
fabric-ca-client enroll -u https://peer.originator.securitization.com:peer.originator.securitization.compw@localhost:7055 --csr.names "$CSR_NAMES_originator"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.originator.securitization.com"




export CSR_NAMES_farmer="C=SP,ST=farmerState,L=farmerLocation,O=farmer,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.farmer.securitization.com --id.secret peer.farmer.securitization.compw --id.type peer -u https://localhost:8055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer
fabric-ca-client enroll -u https://peer.farmer.securitization.com:peer.farmer.securitization.compw@localhost:8055 --csr.names "$CSR_NAMES_farmer"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.farmer.securitization.com"



export CSR_NAMES_ratingagency="C=SP,ST=ratingagencyState,L=ratingagencyLocation,O=ratingagency,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.ratingagency.securitization.com --id.secret peer.ratingagency.securitization.compw --id.type peer -u https://localhost:9055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer
fabric-ca-client enroll -u https://peer.ratingagency.securitization.com:peer.ratingagency.securitization.compw@localhost:9055 --csr.names "$CSR_NAMES_ratingagency"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.ratingagency.securitization.com"




export CSR_NAMES_spv="C=SP,ST=spvState,L=spvLocation,O=spv,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.spv.securitization.com --id.secret peer.spv.securitization.compw --id.type peer -u https://localhost:10055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer
fabric-ca-client enroll -u https://peer.spv.securitization.com:peer.spv.securitization.compw@localhost:10055 --csr.names "$CSR_NAMES_spv"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.spv.securitization.com"




export CSR_NAMES_investor="C=SP,ST=investorState,L=investorLocation,O=investor,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name peer.investor.securitization.com --id.secret peer.investor.securitization.compw --id.type peer -u https://localhost:11055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer
fabric-ca-client enroll -u https://peer.investor.securitization.com:peer.investor.securitization.compw@localhost:11055 --csr.names "$CSR_NAMES_investor"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.investor.securitization.com"



# Ordering service
# First register and enroll orderer with TLS



export CSR_NAMES_originator="C=SP,ST=originatorState,L=originatorLocation,O=originator,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.originator.securitization.com --id.secret orderer.originator.securitization.compw --id.type orderer -u https://localhost:7054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator
fabric-ca-client enroll -u https://orderer.originator.securitization.com:orderer.originator.securitization.compw@localhost:7054 --csr.names "$CSR_NAMES_originator"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.originator.securitization.com"


export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator/tls
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/orderer-key.pem



export CSR_NAMES_farmer="C=SP,ST=farmerState,L=farmerLocation,O=farmer,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.farmer.securitization.com --id.secret orderer.farmer.securitization.compw --id.type orderer -u https://localhost:8054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer
fabric-ca-client enroll -u https://orderer.farmer.securitization.com:orderer.farmer.securitization.compw@localhost:8054 --csr.names "$CSR_NAMES_farmer"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.farmer.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer/tls
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/orderer-key.pem

export CSR_NAMES_ratingagency="C=SP,ST=ratingagencyState,L=ratingagencyLocation,O=ratingagency,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.ratingagency.securitization.com --id.secret orderer.ratingagency.securitization.compw --id.type orderer -u https://localhost:9054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency
fabric-ca-client enroll -u https://orderer.ratingagency.securitization.com:orderer.ratingagency.securitization.compw@localhost:9054 --csr.names "$CSR_NAMES_ratingagency"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.ratingagency.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency/tls
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/orderer-key.pem

export CSR_NAMES_spv="C=SP,ST=spvState,L=spvLocation,O=spv,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.spv.securitization.com --id.secret orderer.spv.securitization.compw --id.type orderer -u https://localhost:10054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv
fabric-ca-client enroll -u https://orderer.spv.securitization.com:orderer.spv.securitization.compw@localhost:10054 --csr.names "$CSR_NAMES_spv"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.spv.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv/tls
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/orderer-key.pem

export CSR_NAMES_investor="C=SP,ST=investorState,L=investorLocation,O=investor,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca/tlsadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.investor.securitization.com --id.secret orderer.investor.securitization.compw --id.type orderer -u https://localhost:11054

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor
fabric-ca-client enroll -u https://orderer.investor.securitization.com:orderer.investor.securitization.compw@localhost:11054 --csr.names "$CSR_NAMES_investor"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.investor.securitization.com"

export CA_PATH=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor
mkdir $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor/tls
cp $CA_PATH/msp/signcerts/cert.pem $CA_PATH/tls 
key=$(find $CA_PATH/msp/keystore -name *_sk)
cp $key $CA_PATH/tls/orderer-key.pem


rm -r $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv/msp/
rm -r $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor/msp/





export CSR_NAMES_originator="C=SP,ST=originatorState,L=originatorLocation,O=originator,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.originator.securitization.com --id.secret orderer.originator.securitization.compw --id.type orderer -u https://localhost:7055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator
fabric-ca-client enroll -u https://orderer.originator.securitization.com:orderer.originator.securitization.compw@localhost:7055 --csr.names "$CSR_NAMES_originator"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.originator.securitization.com"




export CSR_NAMES_farmer="C=SP,ST=farmerState,L=farmerLocation,O=farmer,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.farmer.securitization.com --id.secret orderer.farmer.securitization.compw --id.type orderer -u https://localhost:8055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer
fabric-ca-client enroll -u https://orderer.farmer.securitization.com:orderer.farmer.securitization.compw@localhost:8055 --csr.names "$CSR_NAMES_farmer"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.farmer.securitization.com"



export CSR_NAMES_ratingagency="C=SP,ST=ratingagencyState,L=ratingagencyLocation,O=ratingagency,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.ratingagency.securitization.com --id.secret orderer.ratingagency.securitization.compw --id.type orderer -u https://localhost:9055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency
fabric-ca-client enroll -u https://orderer.ratingagency.securitization.com:orderer.ratingagency.securitization.compw@localhost:9055 --csr.names "$CSR_NAMES_ratingagency"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.ratingagency.securitization.com"




export CSR_NAMES_spv="C=SP,ST=spvState,L=spvLocation,O=spv,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.spv.securitization.com --id.secret orderer.spv.securitization.compw --id.type orderer -u https://localhost:10055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv
fabric-ca-client enroll -u https://orderer.spv.securitization.com:orderer.spv.securitization.compw@localhost:10055 --csr.names "$CSR_NAMES_spv"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.spv.securitization.com"




export CSR_NAMES_investor="C=SP,ST=investorState,L=investorLocation,O=investor,OU=Hyperledger Fabric"
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client register --id.name orderer.investor.securitization.com --id.secret orderer.investor.securitization.compw --id.type orderer -u https://localhost:11055

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor
fabric-ca-client enroll -u https://orderer.investor.securitization.com:orderer.investor.securitization.compw@localhost:11055 --csr.names "$CSR_NAMES_investor"  --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts "localhost,*.investor.securitization.com"




cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/originator/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/farmer/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/ratingagency/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/spv/msp
cp ./config.yaml $NEW_PATH/network/fabric-ca/organizations/ordererOrganizations/investor/msp

