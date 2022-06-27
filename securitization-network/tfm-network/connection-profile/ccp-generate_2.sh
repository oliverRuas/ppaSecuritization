#!/bin/bash
function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}


function json_ccp {
    local PP4=$(one_line_pem $1)
    local CP4=$(one_line_pem $2)
    local OP4=$(one_line_pem $3)
    local PP5=$(one_line_pem $4)
    local CP5=$(one_line_pem $5)
    local OP5=$(one_line_pem $6)
    sed -e "s#\${PEER4PEM}#$PP4#" \
        -e "s#\${CA4PEM}#$CP4#" \
        -e "s#\${ORDERER4PEM}#$OP4#" \
        -e "s#\${PEER5PEM}#$PP5#" \
        -e "s#\${CA5PEM}#$CP5#" \
        -e "s#\${ORDERER5PEM}#$OP5#" \
        ./ccp-template_2.json
}




# PEER4PEM=../network/fabric-ca/organizations/peerOrganizations/spv/peers/spv-peer/tls/cert.pem
# ORDERER4PEM=../network/fabric-ca/organizations/ordererOrganizations/spv/tls/cert.pem
# CA4PEM=../network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp/cacerts/localhost-10055.pem
PEER4PEM=../fabric-ca/spv/peers/spv-peer/tls/ca.crt
ORDERER4PEM=../fabric-ca/spv/orderers/spv-orderer/tls/ca.crt
CA4PEM=../network/fabric-ca/spv/fabric-ca-client/spv-ca/rcaadmin/msp/cacerts/localhost-10055.pem


# PEER5PEM=../network/fabric-ca/organizations/peerOrganizations/investor/peers/investor-peer/tls/cert.pem
# ORDERER5PEM=../network/fabric-ca/organizations/ordererOrganizations/investor/tls/cert.pem
# CA5PEM=../network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp/cacerts/localhost-11055.pem
PEER5PEM=../fabric-ca/investor/peers/investor-peer/tls/ca.crt
ORDERER5PEM=../fabric-ca/investor/orderers/investor-orderer/tls/ca.crt
CA5PEM=../network/fabric-ca/investor/fabric-ca-client/investor-ca/rcaadmin/msp/cacerts/localhost-11055.pem

ORGANIZATION=originator
echo "$(json_ccp $PEER4PEM $CA4PEM $ORDERER4PEM $PEER5PEM $CA5PEM $ORDERER5PEM $ORGANIZATION)" > ../fabric-ca/originator/connection-originator.json

ORGANIZATION=farmer
echo "$(json_ccp $PEER4PEM $CA4PEM $ORDERER4PEM $PEER5PEM $CA5PEM $ORDERER5PEM $ORGANIZATION)" > ../fabric-ca/farmer/connection-farmer.json

ORGANIZATION=ratingagency
echo "$(json_ccp $PEER4PEM $CA4PEM $ORDERER4PEM $PEER5PEM $CA5PEM $ORDERER5PEM $ORGANIZATION)" > ../fabric-ca/ratingagency/connection-ratingagency.json

ORGANIZATION=spv
echo "$(json_ccp $PEER4PEM $CA4PEM $ORDERER4PEM $PEER5PEM $CA5PEM $ORDERER5PEM $ORGANIZATION)" > ../fabric-ca/spv/connection-spv.json

ORGANIZATION=investor
echo "$(json_ccp $PEER4PEM $CA4PEM $ORDERER4PEM $PEER5PEM $CA5PEM $ORDERER5PEM $ORGANIZATION)" > ../fabric-ca/investor/connection-investor.json
