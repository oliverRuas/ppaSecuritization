rm -r ./originator/applications/APPandUI/wallet
rm -r ./farmer/applications/APPandUI/wallet
rm -r ./spv/applications/APPandUI/wallet
rm -r ./ratingagency/applications/APPandUI/wallet
rm -r ./investor/applications/APPandUI/wallet


rm -r ./originator/applications/my_application/wallet
rm -r ./farmer/applications/my_application/wallet
rm -r ./spv/applications/my_application/wallet
rm -r ./ratingagency/applications/my_application/wallet
rm -r ./investor/applications/my_application/wallet

cd ../securitization-network/tfm-network/connection-profile
./generate.sh
sleep 3
cd ../fabric-ca
USER=user3
mkdir -p ./originator/users/$USER@originator
mkdir -p ./farmer/users/$USER@farmer
mkdir -p ./spv/users/$USER@spv
mkdir -p ./ratingagency/users/$USER@ratingagency
mkdir -p ./investor/users/$USER@investor
cd .. && cd .. && cd .. && cd securitization-application

# Add Certificate Authorities' admin to wallet
./addToWallet.sh

sleep 3

node ./originator/applications/devapp/registerandenrollUser.js 'rcaadmin@originator' $USER '{"attrs": [{"name": "cif", "value": "12345678A"},{"name": "email", "value": "user_originator@gmail.com"},{"name": "role", "value": "client"}]}'
node ./farmer/applications/devapp/registerandenrollUser.js 'rcaadmin@farmer' $USER '{"attrs": [{"name": "cif", "value": "12345678B"},{"name": "email", "value": "user_farmer@gmail.com"},{"name": "role", "value": "client"}]}'
node ./ratingagency/applications/devapp/registerandenrollUser.js 'rcaadmin@ratingagency' $USER '{"attrs": [{"name": "cif", "value": "12345678C"},{"name": "email", "value": "user_ratingagency@gmail.com"},{"name": "role", "value": "client"}]}'
node ./spv/applications/devapp/registerandenrollUser.js 'rcaadmin@spv' $USER '{"attrs": [{"name": "cif", "value": "12345678D"},{"name": "email", "value": "user_spv@gmail.com"},{"name": "role", "value": "client"}]}'
node ./investor/applications/devapp/registerandenrollUser.js 'rcaadmin@investor' $USER '{"attrs": [{"name": "cif", "value": "12345678E"},{"name": "email", "value": "user_investor@gmail.com"},{"name": "role", "value": "client"}]}'
