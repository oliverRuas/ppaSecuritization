rm -r ./originator/applications/APPandUI/wallet
rm -r ./farmer/applications/APPandUI/wallet
rm -r ./spv/applications/APPandUI/wallet
rm -r ./ratingagency/applications/APPandUI/wallet
rm -r ./investor/applications/APPandUI/wallet

rm -r ./originator/applications/APPandUI/wallet
rm -r ./farmer/applications/APPandUI/wallet
rm -r ./spv/applications/APPandUI/wallet
rm -r ./ratingagency/applications/APPandUI/wallet
rm -r ./investor/applications/APPandUI/wallet


cd ../securitization-network/tfm-network/connection-profile
./generate.sh
sleep 3
cd .. && cd .. && cd ../securitization-application

./addToWallet.sh


node ./originator/applications/my_application/registerUser.js 'rcaadmin@originator' 'user@originator' '{"attrs": [{"name": "cif", "value": "12345678A"},{"name": "email", "value": "user_originator@gmail.com"},{"name": "role", "value": "client"}]}'
node ./farmer/applications/my_application/registerUser.js 'rcaadmin@farmer' 'user@farmer' '{"attrs": [{"name": "cif", "value": "12345678B"},{"name": "email", "value": "user_farmer@gmail.com"},{"name": "role", "value": "client"}]}'
node ./ratingagency/applications/my_application/registerUser.js 'rcaadmin@ratingagency' 'user@ratingagency' '{"attrs": [{"name": "cif", "value": "12345678C"},{"name": "email", "value": "user_ratingagency@gmail.com"},{"name": "role", "value": "client"}]}'
node ./spv/applications/my_application/registerUser.js 'rcaadmin@spv' 'user@spv' '{"attrs": [{"name": "cif", "value": "12345678D"},{"name": "email", "value": "user_spv@gmail.com"},{"name": "role", "value": "client"}]}'
node ./investor/applications/my_application/registerUser.js 'rcaadmin@investor' 'user@investor' '{"attrs": [{"name": "cif", "value": "12345678E"},{"name": "email", "value": "user_investor@gmail.com"},{"name": "role", "value": "client"}]}'
