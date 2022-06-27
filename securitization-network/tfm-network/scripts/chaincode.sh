export FABRIC_CFG_PATH=$(cd .. && pwd)
export PATH=${HOME}/go/src/github.com/hyperledger/fabric-samples/bin:$PATH
export CC_NAME=securitizationcode
export CC_VERSION=v1.0
export CC_SEQUENCE=1
export CHANNEL_NAME=securitization
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_LOCALMSPID=originatorMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd .. && echo $PWD/fabric-ca/originator/peers/originator-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd .. && echo $PWD/fabric-ca/originator/admins/originator-admin/msp)
export ORDERER_CA=$(cd .. && echo $PWD/fabric-ca/originator/orderers/originator-orderer/tls/ca.crt)
export ORDERER_ADDRESS=localhost:7050

# Cambiar este PATH
export CHAINCODE_PATH=$(cd .. && cd .. && cd .. && echo $PWD/securitization-chaincode/chaincodes/my_chaincode)
peer lifecycle chaincode package ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --path $CHAINCODE_PATH --lang node --label $CC_NAME$CC_VERSION
sleep 2
peer lifecycle chaincode install ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --peerAddresses $CORE_PEER_ADDRESS --tls $CORE_PEER_TLS_ENABLED --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE

# cambiar ID del package
export CC_PACKAGE_ID=securitizationcodev1.0:6d248d833e279716402e7f853639d3fb434073e41e022ef70f476f2705f034b8
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"
peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls true --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "OUTOF(3, 'originatorMSP.peer','farmerMSP.peer','spvMSP.peer','aggregatorMSP.peer','underwritterMSP.peer')"



export CORE_PEER_ADDRESS=localhost:8051
export CORE_PEER_LOCALMSPID=farmerMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd .. && echo $PWD/fabric-ca/farmer/peers/farmer-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd .. && echo $PWD/fabric-ca/farmer/admins/farmer-admin/msp)
export ORDERER_CA=$(cd .. && echo $PWD/fabric-ca/farmer/orderers/farmer-orderer/tls/ca.crt)
export ORDERER_ADDRESS=localhost:8050
peer lifecycle chaincode install ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --peerAddresses $CORE_PEER_ADDRESS --tls $CORE_PEER_TLS_ENABLED --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
sleep 2
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"
peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls true --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"
sleep 5
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "OUTOF(3, 'originatorMSP.peer','farmerMSP.peer','spvMSP.peer','aggregatorMSP.peer','underwritterMSP.peer')"


export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_LOCALMSPID=ratingagencyMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd .. && echo $PWD/fabric-ca/ratingagency/peers/ratingagency-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd .. && echo $PWD/fabric-ca/ratingagency/admins/ratingagency-admin/msp)
export ORDERER_CA=$(cd .. && echo $PWD/fabric-ca/ratingagency/orderers/ratingagency-orderer/tls/ca.crt)
export ORDERER_ADDRESS=localhost:9050
peer lifecycle chaincode install ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --peerAddresses $CORE_PEER_ADDRESS --tls $CORE_PEER_TLS_ENABLED --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
sleep 2
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"
peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls true --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"




export CORE_PEER_ADDRESS=localhost:10051
export CORE_PEER_LOCALMSPID=spvMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd .. && echo $PWD/fabric-ca/spv/peers/spv-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd .. && echo $PWD/fabric-ca/spv/admins/spv-admin/msp)
export ORDERER_CA=$(cd .. && echo $PWD/fabric-ca/spv/orderers/spv-orderer/tls/ca.crt)
export ORDERER_ADDRESS=localhost:10050
peer lifecycle chaincode install ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --peerAddresses $CORE_PEER_ADDRESS --tls $CORE_PEER_TLS_ENABLED --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
sleep 2
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"
peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls true --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"

# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "OUTOF(3, 'originatorMSP.peer','farmerMSP.peer','spvMSP.peer','aggregatorMSP.peer','underwritterMSP.peer')"

sleep 5


export CORE_PEER_ADDRESS=localhost:11051
export CORE_PEER_LOCALMSPID=investorMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd .. && echo $PWD/fabric-ca/investor/peers/investor-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd .. && echo $PWD/fabric-ca/investor/admins/investor-admin/msp)
export ORDERER_CA=$(cd .. && echo $PWD/fabric-ca/investor/orderers/investor-orderer/tls/ca.crt)
export ORDERER_ADDRESS=localhost:11050
peer lifecycle chaincode install ../network/channel-artifacts/$CC_NAME$CC_VERSION.tar.gz --peerAddresses $CORE_PEER_ADDRESS --tls $CORE_PEER_TLS_ENABLED --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
sleep 2
# peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"
peer lifecycle chaincode approveformyorg -o $ORDERER_ADDRESS --tls true --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --package-id $CC_PACKAGE_ID --sequence $CC_SEQUENCE --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --peerAddresses $CORE_PEER_ADDRESS --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"

sleep 5

# peer lifecycle chaincode commit -o $ORDERER_ADDRESS --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --tls --cafile $ORDERER_CA --peerAddresses $CORE_PEER_ADDRESS --peerAddresses localhost:7051 --peerAddresses localhost:8051 --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --tlsRootCertFiles $(cd .. && echo $PWD/fabric-ca/originator/peers/originator-peer/tls/ca.crt) --tlsRootCertFiles $(cd .. && echo $PWD/fabric-ca/farmer/peers/farmer-peer/tls/ca.crt) --collections-config ../chaincode/collections.json --signature-policy "AND(OUTOF(2,'originatorMSP.peer','farmerMSP.peer','spvMSP.peer'), 'investorMSP.peer')"

peer lifecycle chaincode commit -o $ORDERER_ADDRESS --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION --sequence $CC_SEQUENCE --tls true --cafile $ORDERER_CA --peerAddresses $CORE_PEER_ADDRESS --peerAddresses localhost:7051 --peerAddresses localhost:8051 --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE --tlsRootCertFiles $(cd .. && echo $PWD/fabric-ca/originator/peers/originator-peer/tls/ca.crt) --tlsRootCertFiles $(cd .. && echo $PWD/fabric-ca/farmer/peers/farmer-peer/tls/ca.crt) --signature-policy "OutOf(3,'originatorMSP.peer','farmerMSP.peer','ratingagencyMSP.peer','spvMSP.peer', 'investorMSP.peer')"



