export NEW_PATH=$(cd ../ && pwd)

# ORIGINATOR
# Registramos la identidad de arranque del CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client register --id.name rcaadmin --id.secret rcaadminpw -u https://localhost:7054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --mspdir $FABRIC_CA_CLIENT_HOME


# Inscribimos la identidad de arranque del CA
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/originator/fabric-ca-client/tls-ca/rcaadmin/msp
fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:7054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.originator.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME


# FARMER

# Registramos la identidad de arranque del CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client register --id.name rcaadmin --id.secret rcaadminpw -u https://localhost:8054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --mspdir $FABRIC_CA_CLIENT_HOME


# Inscribimos la identidad de arranque del CA
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/farmer/fabric-ca-client/tls-ca/rcaadmin/msp
fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:8054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.farmer.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME



# RATINGAGENCY

# Registramos la identidad de arranque del CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client register --id.name rcaadmin --id.secret rcaadminpw -u https://localhost:9054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --mspdir $FABRIC_CA_CLIENT_HOME


# Inscribimos la identidad de arranque del CA
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/ratingagency/fabric-ca-client/tls-ca/rcaadmin/msp
fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:9054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.ratingagency.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME



# SPV

# Registramos la identidad de arranque del CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client register --id.name rcaadmin --id.secret rcaadminpw -u https://localhost:10054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --mspdir $FABRIC_CA_CLIENT_HOME


# Inscribimos la identidad de arranque del CA
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/spv/fabric-ca-client/tls-ca/rcaadmin/msp
fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:10054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.spv.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME



# INVESTOR

# Registramos la identidad de arranque del CA
export FABRIC_CA_CLIENT_TLS_CERTFILES=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-root-cert/tls-ca-cert.pem
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca/tlsadmin/msp
fabric-ca-client register --id.name rcaadmin --id.secret rcaadminpw -u https://localhost:11054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --mspdir $FABRIC_CA_CLIENT_HOME


# Inscribimos la identidad de arranque del CA
export FABRIC_CA_CLIENT_HOME=$NEW_PATH/network/fabric-ca/investor/fabric-ca-client/tls-ca/rcaadmin/msp
fabric-ca-client enroll -u https://rcaadmin:rcaadminpw@localhost:11054 --tls.certfiles $FABRIC_CA_CLIENT_TLS_CERTFILES --enrollment.profile tls --csr.hosts 'localhost,*.investor.securitization.com' --mspdir $FABRIC_CA_CLIENT_HOME
