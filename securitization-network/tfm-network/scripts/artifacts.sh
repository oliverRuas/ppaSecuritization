export FABRIC_CFG_PATH=$(cd ../ && pwd)
mkdir $FABRIC_CFG_PATH/network/channel-artifacts/
# Este channelID es system-channel
configtxgen -profile FiveOrgsOrdererGenesis -channelID system-channel -outputBlock ../network/channel-artifacts/genesis.block
configtxgen -profile FiveOrgsChannel -outputCreateChannelTx ../network/channel-artifacts/channel.tx -channelID securitization

configtxgen -outputAnchorPeersUpdate ../network/channel-artifacts/originatorMSPanchors.tx -profile FiveOrgsChannel -asOrg originatorMSP -channelID securitization

configtxgen -outputAnchorPeersUpdate ../network/channel-artifacts/farmerMSPanchors.tx -profile FiveOrgsChannel -asOrg farmerMSP -channelID securitization

configtxgen -outputAnchorPeersUpdate ../network/channel-artifacts/ratingagencyMSPanchors.tx -profile FiveOrgsChannel -asOrg ratingagencyMSP -channelID securitization

configtxgen -outputAnchorPeersUpdate ../network/channel-artifacts/spvMSPanchors.tx -profile FiveOrgsChannel -asOrg spvMSP -channelID securitization

configtxgen -outputAnchorPeersUpdate ../network/channel-artifacts/investorMSPanchors.tx -profile FiveOrgsChannel -asOrg investorMSP -channelID securitization