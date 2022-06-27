#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP1=$(one_line_pem $1)
    local CP1=$(one_line_pem $2)
    local OP1=$(one_line_pem $3)
    local PP2=$(one_line_pem $4)
    local CP2=$(one_line_pem $5)
    local OP2=$(one_line_pem $6)
    local PP3=$(one_line_pem $7)
    local CP3=$(one_line_pem $8)
    local OP3=$(one_line_pem $9)
    # local PP4=$(one_line_pem $10)
    # local CP4=$(one_line_pem $11)
    # local OP4=$(one_line_pem $12)
    # local PP5=$(one_line_pem $13)
    # local CP5=$(one_line_pem $14)
    # local OP5=$(one_line_pem $15)
    sed -e "s#\${PEER1PEM}#$PP1#" \
        -e "s#\${CA1PEM}#$CP1#" \
        -e "s#\${ORDERER1PEM}#$OP1#" \
        -e "s#\${PEER2PEM}#$PP2#" \
        -e "s#\${CA2PEM}#$CP2#" \
        -e "s#\${ORDERER2PEM}#$OP2#" \
        -e "s#\${PEER3PEM}#$PP3#" \
        -e "s#\${CA3PEM}#$CP3#" \
        -e "s#\${ORDERER3PEM}#$OP3#" \
        ./ccp-template.json
}


# PEER1PEM=../network/fabric-ca/organizations/peerOrganizations/originator/peers/originator-peer/tls/cert.pem
# ORDERER1PEM=../network/fabric-ca/organizations/ordererOrganizations/originator/tls/cert.pem
# CA1PEM=../network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp/cacerts/localhost-7055.pem

# PEER2PEM=../network/fabric-ca/organizations/peerOrganizations/farmer/peers/farmer-peer/tls/cert.pem
# ORDERER2PEM=../network/fabric-ca/organizations/ordererOrganizations/farmer/tls/cert.pem
# CA2PEM=../network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp/cacerts/localhost-8055.pem

# PEER3PEM=../network/fabric-ca/organizations/peerOrganizations/ratingagency/peers/ratingagency-peer/tls/cert.pem
# ORDERER3PEM=../network/fabric-ca/organizations/ordererOrganizations/ratingagency/tls/cert.pem
# CA3PEM=../network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp/cacerts/localhost-9055.pem

# PEER4PEM=../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/cert.pem
# ORDERER4PEM=../network/fabric-ca/organizations/ordererOrganizations/spv/tls/cert.pem
# CA4PEM=../network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp/cacerts/localhost-10055.pem

# PEER5PEM=../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/cert.pem
# ORDERER5PEM=../network/fabric-ca/organizations/ordererOrganizations/investor/tls/cert.pem
# CA5PEM=../network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp/cacerts/localhost-11055.pem



PEER1PEM=../fabric-ca/originator/peers/originator-peer/tls/ca.crt
ORDERER1PEM=../fabric-ca/originator/orderers/originator-orderer/tls/ca.crt
CA1PEM=../network/fabric-ca/originator/fabric-ca-client/originator-ca/rcaadmin/msp/cacerts/localhost-7055.pem

PEER2PEM=../fabric-ca/farmer/peers/farmer-peer/tls/ca.crt
ORDERER2PEM=../fabric-ca/farmer/orderers/farmer-orderer/tls/ca.crt
CA2PEM=../network/fabric-ca/farmer/fabric-ca-client/farmer-ca/rcaadmin/msp/cacerts/localhost-8055.pem

PEER3PEM=../fabric-ca/ratingagency/peers/ratingagency-peer/tls/ca.crt
ORDERER3PEM=../fabric-ca/ratingagency/orderers/ratingagency-orderer/tls/ca.crt
CA3PEM=../network/fabric-ca/ratingagency/fabric-ca-client/ratingagency-ca/rcaadmin/msp/cacerts/localhost-9055.pem

# PEER4PEM=../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/cert.pem
# ORDERER4PEM=../network/fabric-ca/organizations/ordererOrganizations/spv/tls/cert.pem
# CA4PEM=../network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp/cacerts/localhost-10055.pem

# PEER5PEM=../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/cert.pem
# ORDERER5PEM=../network/fabric-ca/organizations/ordererOrganizations/investor/tls/cert.pem
# CA5PEM=../network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp/cacerts/localhost-11055.pem







# echo "$(json_ccp $ORG1 $P1PORT $CA1PORT $ORDERER1PORT $PEER1PEM $CA1PEM $ORDERER1PEM $ORG2 $P2PORT $CA2PORT $ORDERER2PORT $PEER2PEM $CA2PEM $ORDERER2PEM $ORG3 $P3PORT $CA3PORT $ORDERER3PORT $PEER3PEM $CA3PEM $ORDERER3PEM $ORG4 $P4PORT $CA4PORT $ORDERER4PORT $PEER4PEM $CA4PEM $ORDERER4PEM $ORG5 $P5PORT $CA5PORT $ORDERER5PORT $PEER5PEM $CA5PEM $ORDERER5PEM)" > ../fabric-ca/originator/connection-originator.json

echo "$(json_ccp  $PEER1PEM $CA1PEM $ORDERER1PEM $PEER2PEM $CA2PEM $ORDERER2PEM $PEER3PEM $CA3PEM $ORDERER3PEM)" > ./ccp-template_2.json

# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > ../fabric-ca/originator/connection-originator.yaml



