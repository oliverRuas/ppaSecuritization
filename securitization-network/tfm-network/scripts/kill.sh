#docker kill $(docker ps -a -q)
#docker rm $(docker ps -a -q)
cd ../network && docker-compose -f docker-compose-ca.yaml -f docker-compose-ca-start.yaml -f docker-compose-tlsca.yaml -f docker-compose-tlsca-start.yaml -f docker-compose-cli-couchdb.yaml down
docker rm $(docker ps -aq --filter 'name=cli')
docker rm $(docker ps -aq --filter 'name=peer')
docker rm $(docker ps -aq --filter 'name=couch')
docker rm $(docker ps -aq --filter 'name=orderer')
docker rm $(docker ps -aq --filter 'name=ca')
docker rm $(docker ps -aq --filter 'name=securitization')
docker rmi $(docker images -q --filter 'reference=*securitization*')
cd ../scripts
#./cleancerts.sh
sudo rm -r ../network/channel-artifacts/*
sudo rm -r ../network/fabric-ca/*
sudo rm -r ../fabric-ca/originator/peers/originator-peer/production
sudo rm -r ../fabric-ca/farmer/peers/farmer-peer/production
sudo rm -r ../fabric-ca/spv/peers/spv-peer/production
sudo rm -r ../fabric-ca/ratingagency/peers/ratingagency-peer/production
sudo rm -r ../fabric-ca/investor/peers/investor-peer/production
sudo rm -r ../fabric-ca
