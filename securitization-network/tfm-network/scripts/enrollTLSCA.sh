export NEW_PATH=$(cd ../ && pwd)
# ORIGINATOR
mkdir $NEW_PATH/network/fabric-ca/originator/fabric-ca-client
mkdir $NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca
mkdir $NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert
cp $NEW_PATH/network/fabric-ca/originator/fabric-ca-server-tls/ca-cert.pem $NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
# Inscribimos la identidad de arranque de la TLS CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client enroll -u https://tls-ca-originator-admin:tls-ca-originator-adminpw@localhost:7054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost, *.originator.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME

# FARMER
mkdir $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client
mkdir $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca
mkdir $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert
cp $NEW_PATH/network/fabric-ca/farmer/fabric-ca-server-tls/ca-cert.pem $NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
# Inscribimos la identidad de arranque de la TLS CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client enroll -u https://tls-ca-farmer-admin:tls-ca-farmer-adminpw@localhost:8054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.farmer.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME


# RATING AGENCY
mkdir $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client
mkdir $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca
mkdir $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert
cp $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-server-tls/ca-cert.pem $NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
# Inscribimos la identidad de arranque de la TLS CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export NEW_PATH=$(cd ../ && pwd)
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client enroll -u https://tls-ca-ratingagency-admin:tls-ca-ratingagency-adminpw@localhost:9054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.ratingagency.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME

# SPV
mkdir $NEW_PATH/network/fabric-ca/spv/fabric-ca-client
mkdir $NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca
mkdir $NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert
cp $NEW_PATH/network/fabric-ca/spv/fabric-ca-server-tls/ca-cert.pem $NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
# Inscribimos la identidad de arranque de la TLS CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client enroll -u https://tls-ca-spv-admin:tls-ca-spv-adminpw@localhost:10054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.spv.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME

# Investor
mkdir $NEW_PATH/network/fabric-ca/investor/fabric-ca-client
mkdir $NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca
mkdir $NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert
cp $NEW_PATH/network/fabric-ca/investor/fabric-ca-server-tls/ca-cert.pem $NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
# Inscribimos la identidad de arranque de la TLS CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client enroll -u https://tls-ca-investor-admin:tls-ca-investor-adminpw@localhost:11054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.investor.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME



# No dice nada de que hay que modificar el archivo fabric-ca-client-config que sale de cada enrollment