export FABRIC_CFG_PATH=$(cd ../ && pwd)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/originator/admins/originator-admin/msp)

export CORE_PEER_LOCALMSPID=originatorMSP
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/originator/orderers/originator-orderer/tls/ca.crt)

# Create the application channel
peer channel create -o localhost:7050 -c securitization -f ../network/channel-artifacts/channel.tx --outputBlock ../network/channel-artifacts/securitization.genesis.block --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.originator.securitization.com


sleep 2

# Let the peers join the channel
#originator-peer
export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_LOCALMSPID=originatorMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd ../ && echo $PWD/fabric-ca/originator/peers/originator-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/originator/admins/originator-admin/msp)
peer channel join -b ../network/channel-artifacts/securitization.genesis.block 
sleep 2

#farmer-peer
export CORE_PEER_ADDRESS=localhost:8051
export CORE_PEER_LOCALMSPID=farmerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd ../ && echo $PWD/fabric-ca/farmer/peers/farmer-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/farmer/admins/farmer-admin/msp)
peer channel join -b ../network/channel-artifacts/securitization.genesis.block 
sleep 2

#ratingagency-peer
export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_LOCALMSPID=ratingagencyMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd ../ && echo $PWD/fabric-ca/ratingagency/peers/ratingagency-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/ratingagency/admins/ratingagency-admin/msp)
peer channel join -b ../network/channel-artifacts/securitization.genesis.block

sleep 2

#spv-peer
export CORE_PEER_ADDRESS=localhost:10051
export CORE_PEER_LOCALMSPID=spvMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd ../ && echo $PWD/fabric-ca/spv/peers/spv-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/spv/admins/spv-admin/msp)
peer channel join -b ../network/channel-artifacts/securitization.genesis.block

sleep 2

#investor-peer
export CORE_PEER_ADDRESS=localhost:11051
export CORE_PEER_LOCALMSPID=investorMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=$(cd ../ && echo $PWD/fabric-ca/investor/peers/investor-peer/tls/ca.crt)
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/investor/admins/investor-admin/msp)
peer channel join -b ../network/channel-artifacts/securitization.genesis.block

sleep 2


# Set the anchor peers in the network. This let the peers communicate each other

#Originator


export CORE_PEER_ADDRESS=localhost:7051
export CORE_PEER_LOCALMSPID=originatorMSP
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/originator/admins/originator-admin/msp)
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/originator/orderers/originator-orderer/tls/ca.crt)

peer channel update -c securitization -f ../network/channel-artifacts/originatorMSPanchors.tx -o localhost:7050 --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.originator.securitization.com

sleep 2

#farmer


export CORE_PEER_ADDRESS=localhost:8051
export CORE_PEER_LOCALMSPID=farmerMSP
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/farmer/admins/farmer-admin/msp)
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/farmer/orderers/farmer-orderer/tls/ca.crt)

peer channel update -c securitization -f ../network/channel-artifacts/farmerMSPanchors.tx -o localhost:8050 --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.farmer.securitization.com


sleep 2


#ratingagency


export CORE_PEER_ADDRESS=localhost:9051
export CORE_PEER_LOCALMSPID=ratingagencyMSP
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/ratingagency/admins/ratingagency-admin/msp)
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/ratingagency/orderers/ratingagency-orderer/tls/ca.crt)

peer channel update -c securitization -f ../network/channel-artifacts/ratingagencyMSPanchors.tx -o localhost:9050 --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.ratingagency.securitization.com

sleep 2




#spv


export CORE_PEER_ADDRESS=localhost:10051
export CORE_PEER_LOCALMSPID=spvMSP
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/spv/admins/spv-admin/msp)
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/spv/orderers/spv-orderer/tls/ca.crt)

peer channel update -c securitization -f ../network/channel-artifacts/spvMSPanchors.tx -o localhost:10050 --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.spv.securitization.com

sleep 2

#investor


export CORE_PEER_ADDRESS=localhost:11051
export CORE_PEER_LOCALMSPID=investorMSP
export CORE_PEER_MSPCONFIGPATH=$(cd ../ && echo $PWD/fabric-ca/investor/admins/investor-admin/msp)
export ORDERER_CA=$(cd ../ && echo $PWD/fabric-ca/investor/orderers/investor-orderer/tls/ca.crt)

peer channel update -c securitization -f ../network/channel-artifacts/investorMSPanchors.tx -o localhost:11050 --tls true --cafile $ORDERER_CA --ordererTLSHostnameOverride orderer.investor.securitization.com




