function cleanCA(){
    CA_PATH=../network/fabric-ca/
    sudo rm -r $CA_PATH

}

function cleanOrgMSP() {
    org=$1

    MSP_PATH=../fabric-ca/$org/msp
    sudo rm -r $MSP_PATH/cacerts
    sudo rm -r $MSP_PATH/tlscacerts
}

function cleanLocalMSP() {
    org=$1
    name=$2
    type=$3

    LOCAL_MSP_PATH=../fabric-ca/$org/${type}/$name/msp
    TLS_FOLDER_PATH=../fabric-ca/$org/${type}/$name/tls

    sudo rm -r $LOCAL_MSP_PATH
    sudo rm -r $TLS_FOLDER_PATH
}

cleanCA


cleanOrgMSP originator
cleanOrgMSP farmer
cleanOrgMSP spv
cleanOrgMSP ratingagency
cleanOrgMSP investor

cleanLocalMSP originator admins originator-admin
cleanLocalMSP originator peers originator-peer
cleanLocalMSP originator orderers originator-orderer
cleanLocalMSP farmer admins farmer-admin
cleanLocalMSP farmer peers farmer-orderer
cleanLocalMSP farmer orderers farmer-orderer
cleanLocalMSP spv admins spv-admin
cleanLocalMSP spv peers spv-peer
cleanLocalMSP spv orderers spv-orderer
cleanLocalMSP ratingagency admins ratingagency-admin
cleanLocalMSP ratingagency peers ratingagency-peer
cleanLocalMSP ratingagency orderers ratingagency-orderer
cleanLocalMSP investor admins investor-admin
cleanLocalMSP investor peers investor-peer
cleanLocalMSP investor orderers investor-orderer

