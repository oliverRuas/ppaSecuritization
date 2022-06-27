docker kill $(docker ps -a -q)
docker rm $(docker ps -a -q)
export PATH=${HOME}/go/src/github.com/hyperledger/fabric-samples/bin:$PATH
cp -R ./network/* ../network/fabric-ca/
cd .. && cd network && docker-compose -f docker-compose-tlsca.yaml up -d
cd .. && cd network && docker-compose -f docker-compose-tlsca-start.yaml up -d
cd .. && cd scripts && ./enrollTLSCA.sh
./register-enroll-CAs.sh
./deployCAs.sh
./configCA.sh
cd .. && cd network && docker-compose -f docker-compose-ca.yaml up -d
cd .. && cd network && docker-compose -f docker-compose-ca-start.yaml up -d
sleep 2
cd .. && cd scripts && ./enrollCA.sh 
sleep 2 
./register-enroll-PeersOrderers.sh
sleep 2
./msp.sh
sleep 2
./artifacts.sh
sleep 2
cd .. && cd network && docker-compose -f docker-compose-cli-couchdb.yaml up -d
sleep 2
cd .. && cd scripts && ./channels.sh

