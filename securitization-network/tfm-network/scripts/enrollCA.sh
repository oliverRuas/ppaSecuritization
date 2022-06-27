export NEW_PATH=$(cd ../ && pwd)
# ORIGINATOR
mkdir $NEW_PATH/network/fabric-ca/originator/fabric-ca-client/originator-ca


export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:7055 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost, *.originator.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME

# FARMER
mkdir $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/farmer-ca



export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:8055 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.farmer.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME

# RATING AGENCY
mkdir $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca


export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:9055 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.ratingagency.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME


# SPV
mkdir $NEW_PATH/network/fabric-ca/spv/fabric-ca-client/spv-ca



export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:10055 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost, *.spv.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME


# Investor
mkdir $NEW_PATH/network/fabric-ca/investor/fabric-ca-client/investor-ca

export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem

fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:11055 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --csr.hosts 'localhost,*.investor.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME



