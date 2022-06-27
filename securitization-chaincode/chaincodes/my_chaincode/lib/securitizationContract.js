'use strict'

const {Contract, Context}=require('fabric-contract-api');
//const { Buffer } = require('safe-buffer');


class securitizationContext extends Context {
    constructor() {
        super();
    }
    //GetMSPID() returns MSP ID of the client digital certificate
    GetMSPID(){
        return this.clientIdentity.getMSPID();
    }
    //GetUserIdentity(value) returns the value of the attribute of the digital certificate 
    GetUserIdentity(value){
        return this.clientIdentity.getAttributeValue(value)
    }
    //GetTxTimestamp() returns server's time
    GetTxTimestamp(){
        return this.stub.getDateTimestamp();
    }
    //GetRole() returns a boolean value depending on the digital certificate role, i.e if client certificate
    //has a role of client, it returns true, otherwise false 
    GetRole(){
        return this.clientIdentity.assertAttributeValue('role', 'client');
    }
    //SetMSPID saves MSPID into ctx module
    // SetMSPID provides a value for MSP ID
    SetMSPID(mspid){
        this.mspid=mspid
    }
    //SetEventPayload(eventPayload) saves eventPayload into ctx module
    SetEventPayload(eventPayload){
        this.eventPayload=eventPayload
    }
    //SetEventName(eventName) saves eventName into ctx module
    SetEventName(eventName){
        this.eventName=eventName
    }
    //GetEventPayload submits event and returns it
    GetEventPayload(){
        return this.stub.setEvent(this.eventName,this.eventPayload)
    }
}


//Common classes do not concern about organization membership
class commonSecuritizationContract extends Contract {
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('common.securitization.com');
    }

    //We use our context shown above
    /**
     * Define a custom context for securitization
    */
    createContext() {
        return new securitizationContext();
    }

    async beforeTransaction(ctx) {
        // let getDateTimestamp=await ctx.GetTxTimestamp();
        // //console.log(`txTimeStamp: ${getDateTimestamp}`);
        // let getTxDateTimestamp=await ctx.GetTxDateTimestamp();
        // //console.log(`txDateTimeStamp: ${txDateTimeStamp}`);
        let isClient=await ctx.GetRole();
        //console.log(`isClient: ${isClient}`);
        //let role=await ctx.clientIdentity.getAttributeValue('role');
        //console.log(`role: ${role}`)
        //role=await ctx.clientIdentity.getAttributeValue('hf.Role');
        //console.log(`role: ${role}`)
        //role=await ctx.clientIdentity.getAttributeValue('hf.Affiliation');
        //console.log(`role: ${role}`)
 
        if (!isClient){
            throw new Error(`You are not allowed to perform this action`);
        }
        let par=await ctx.stub.getFunctionAndParameters();
        let func = par.fcn;
        let params= par.params;
        //console.log(func);
        //console.log(params);
        for (let i=0;i<params.length;i++){
            if (params[i]===''){
                throw new Error('There is at least one empty parameter');
            }
        }
    }
    // Here auxiliary functions

    // Our token will have 2 decimals, like fiat currencies
    async _checkDecimals(number){
        // In nodejs every atribute is a string
        // First check if it is a number
        // number.stringify()
        // if(typeof number !=='number'){
        //     throw new Error('Wrong notation');
        // }
        // Not necessary, we are working with 2decimal-numbers
        // Integer between -2^53-1 and 2^53-1
        // if (!Number.isSafeInteger(number)){
        //     throw new Error('Wrong number');
        // }
        // Check if it is a 2decimal-number
        const numberString=number.toString();
        let index;
        let count=0;
        for(let i=0;i<numberString.length;i++){
            if (numberString[i]==='.'){
                index=i;
                count=count+1;
            }
            if (numberString[i]===','){
                throw new Error('Wrong format. Try using dot instead of comma')
            }
        }
        if ((numberString.length-1-index)>2 || count>1){
            throw new Error('Wrong decimals')
        }
        // Check if it is strictly positive
        number=parseFloat(number);
        if (number<=0){
            throw new Error('Number must be strictly positive');
        }
        return true
    }

    // Funcionan
    // Transfer money
    async _transferMoney(ctx, userID,amount,keyFrom){
        const genericID=await ctx.stub.getTxID();

        const key1=await ctx.stub.createCompositeKey('securitizationCoin',[userID,genericID]);

        for (const key of keyFrom) {
            // console.log('deleteKey')
            // console.log(key)
            await ctx.stub.deleteState(key);
        }

        let typeID=':0'
        const utxo={
            ID: key1+typeID,
            GenericID: genericID,
            Owner: userID,
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Amount: amount,
            Factor: 100,
            CanBeUsed: true,
            TypeID: typeID
        };

        await ctx.stub.putState(key1,Buffer.from(JSON.stringify(utxo)));
        return utxo
    }

    async PoolMoney(ctx){
        const userID=await ctx.GetUserIdentity('cif');
        let iterator= ctx.stub.getStateByPartialCompositeKey('securitizationCoin',[userID]);
        let amount;
        let resultKeys=[];
        let counter=0;
        let value;
        for await (const res of iterator) {
            value = JSON.parse(res.value.toString());
            // //console.log(`value: ${value.Amount}`)
            amount=value.Amount;
            if (value.CanBeUsed && value.Owner===userID){
                resultKeys.push(value.ID);
                counter=counter+amount;
            }
            if (resultKeys.length===2){
                break
            }
        }
        if (resultKeys.length === 0 || resultKeys.length===1){
            throw new Error('There is nothing left to do');
        }
        let ret=await this._transferMoney(ctx,userID, counter, resultKeys);
        return ret
    }


    // If we know the User ID, then we can query the PPA asociated with that ID
    async QueryPPA(ctx,userID){
        // Prior verificatios deactivated in testing (because of test-network)
        // Who can query this data?
        const ppa=await this._mygetStateByPartialCompositeKey(ctx,'PPA',userID);
        if (ppa===true){
            throw new Error('PPA does not exist')
        }
        return ppa;
    }

    async _getAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				//console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						//console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						//console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}


    async QueryPPAHistory(ctx, userID,ppaID){
        const key=await ctx.stub.createCompositeKey('PPA',[userID,ppaID])
        let resultsIterator = await ctx.stub.getHistoryForKey(key);
		let results = await this._getAllResults(resultsIterator, true);
		return results;
    }

    // Igual esto tiene que ir en un canal donde esté el/los bancos.
    // Esta funcion la tengo que activar para "crear dinero" on chain

    // Minting money
    async Mint(ctx,amount){
        // Checking format
        await this._checkDecimals(amount);

        // Each UTXO will have a unique, free-collision key
        const genericID=await ctx.stub.getTxID();
        const userID= await ctx.GetUserIdentity('cif')

        const key=await ctx.stub.createCompositeKey('securitizationCoin',[userID,genericID]);

        let typeID;
        typeID=':0'
        //mirar si añadiendo ':0' sigue haciendo bien el query
        const securitizationCoin= {
            ID: key+ typeID,
            GenericID: genericID,
            TypeID: typeID,
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: userID,
            Amount: parseInt(parseFloat(amount)*100),
            Factor: 100,
            CanBeUsed: true
        };
        await ctx.stub.putState(securitizationCoin.ID,Buffer.from(JSON.stringify(securitizationCoin)));
        return securitizationCoin;
    }

    // This function is expected to return just one value associated with the partialKey of the user Identity Number
    async _mygetStateByPartialCompositeKey(ctx, name, userID){
        const iterator=await ctx.stub.getStateByPartialCompositeKey(name,[userID]);
        let counter=0;
        let results;

        for (const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
            }
        if (counter>1){
            throw new Error('Check this...');
        }else if (counter===0){
            return true;
        }
        return results;
    }

    // funciona
    async QueryMyCoins(ctx){
        const userID=await ctx.GetUserIdentity('cif');
        const iterator= ctx.stub.getStateByPartialCompositeKey('securitizationCoin',[userID]);
        let results = [];
        let valor;
        for await (const res of iterator) {
            valor= JSON.parse(res.value.toString());
            results.push(valor);
        }
        return results;
    }

    // funciona
    async QueryMyBond(ctx){
        const userID=await ctx.GetUserIdentity('cif');
        const iterator= ctx.stub.getStateByPartialCompositeKey('BondToken',[userID]);
        let results = [];
        let valor;
        for await (const res of iterator) {
            valor= JSON.parse(res.value.toString());
            results.push(valor);
        }
        return results;
    }
}



class ppaContract extends Contract {
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('ppa.securitization.com');
    }
    createContext() {
        return new securitizationContext();
    }
    async beforeTransaction(ctx) {
        let getDateTimestamp=await ctx.GetTxTimestamp();
        console.log('TxTimeStamp')
        console.log(getDateTimestamp)
        let getTxDate=await ctx.stub.getDateTimestamp();
        console.log(getTxDate)
        console.log(new Date(getTxDate))
        // console.log(getDateTimestamp.Timestamp.getSeconds())
        let userMSPID=await ctx.GetMSPID();
        if (userMSPID!=='originatorMSP' && userMSPID!=='farmerMSP'){
            throw new Error('You are not allowed to perform this action');
        }
        let isClient=await ctx.GetRole();

        if (!isClient){
            throw new Error(`You are not allowed to perform this action`);
        }
        await ctx.SetMSPID(userMSPID);
        let par=await ctx.stub.getFunctionAndParameters();
        let func = par.fcn;
        let params= par.params;

        for (let i=0;i<params.length;i++){
            if (params[i]===''){
                throw new Error('There is at least one empty parameter');
            }
        }
        const mspid=await ctx.mspid;
        switch(func){
            case 'PPAProposal':
                if (mspid!=='originatorMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'AcceptPPA':
                if (mspid!=='farmerMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'MintPPA':
                if (mspid!=='originatorMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'MaintenanceServiceRequest':
                if (mspid!=='farmerMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'EnergyConsumptionPerPPA':
                if (mspid!=='originatorMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'MonthlyBillPayout':
                if (mspid!=='farmerMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryMyPPA':
                if (mspid!=='farmerMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'RequestPPA':
                if (mspid!=='farmerMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryPPARequest':
                if (mspid!=='originatorMSP'){
                    throw new Error(`You are not allowed to perform this action`);
                }else{
                    return
                }
        }
    }

    // //afterTransaction will return the event of the transaction
    // async afterTransaction(ctx){
    // 	let event=await ctx.GetEventPayload();
    //     return event
    // }

    /**
     * 
     * @param {*} ctx 
     * @param {*} poolName is the name of the Pool, not its key.
     * @returns the true/false or error depending on whether Pool has been created or not. Error means Pool is not Unique.
     */
     async _isPoolCreated(ctx,poolName){
        const iterator= ctx.stub.getStateByPartialCompositeKey(poolName,[]);
        let results=[];
        for await (const res of iterator) {
            results.push(res.key);
        }
        if (results.length === 0){
            return false
        }else if (results.length===1){
            return true;
        }else{
            throw new Error(`State not unique`)
        }
    }
    /**
     *
     * @param {*} ctx
     * @param {*} userID is the an identifier inside client digital cert
     * @returns true/false depending on whether PPA has been already proposed or not.
     */
    // Auxiliary function to query if PPA contract for this userID has already been proposed
    async _isPPAProposed(ctx,userID){
        const iterator=ctx.stub.getStateByPartialCompositeKey('PPA',[userID]);
        let results=[];
        for await (const res of iterator){
            results.push(res.key)
        }
        if(results.length !== 0){
            return true
        }else{
            return false
        }
    }

    /**
     *
     * @param {*} ctx
     * @param {*} docTypeName
     * @returns the state associated with that partial key
     */
    // This auxiliary function will only work with those states expected to be unique (POOL, REALTIMEPARAMETERS, RATING...)
    async _getPoolStateByPartialCompositeKey(ctx, docTypeName){
        const iterator= ctx.stub.getStateByPartialCompositeKey(docTypeName,[]);
        let counter=0;
        let results;
        for await (const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
            }
        if (counter>1){
            throw new Error('This state-value pair is not unique');
        }else if (counter===0){
            return false;
        }
        return results;
    }


    /**
     *
     * @param {*} ctx
     * @param {*} docTypeName
     * @param {*} userID is an identifier inside client digital certificate
     * @returns
     */
    // Auxiliary function to retrieve a value associated with a partial key. It is expected that
    // this value is unique. One partial key may have multiple values associated to itself.
    async _mygetStateByPartialCompositeKey(ctx, docTypeName, userID){
        const iterator= ctx.stub.getStateByPartialCompositeKey(docTypeName,[userID]);
        let counter=0;
        let results;

        for await(const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
        }
        if (counter>1){
            throw new Error('This state-value pair is not unique');
        }else if (counter===0){
            return true;
        }
        return results;
    }

    /**
     * 
     * @param {*} ctx 
     * @param {*} ppaID is the ID of a PPA
     * @returns false if pool has not yet been created or [true/false,Owner] if pool has been created.
     */
    // This auxiliary function will allow us to determine to which identity are we going to pay the bills
    async _isPPAinPool(ctx,ppaID){
        let pool=await this._getPoolStateByPartialCompositeKey(ctx,'POOL');
        let res=[];
        if (!pool || pool.length === 0){
            res.push(false)
            return res
        }
        const containsppaID =await pool.ppaIDs.includes(ppaID);
        res.push(containsppaID);
        res.push(pool.OwnerID)
        return res
    }


    /**
     * 
     * @param {*} ctx 
     * @param {string} poolName is the name of the pool, which once sold to SPV, includes this value to allocate
     * cash tokens to principal and coupon
     * @returns float number allocated to coupon and which to principal
     */
    async _getCouponProportion(ctx,poolName){
        let iterator= ctx.stub.getStateByPartialCompositeKey(poolName,[]);
        let result;
        for await (const res of iterator) {
            result=JSON.parse(res.value.toString())
        }
        return result.CouponPortion
    }
    
    // TODO: add more non working days
    // This auxiliary function serves to compute the time between two dates, including if there are
    // non working days in between. It serves to pay bills, to maintenance service request and every function
    // which involves a fixed period of time to be executed.
    async _checkNonWorkingDays(currentDate,notificationDate){
        const nonWorkingDay1=new Date(2022,0,1)
        const nonWorkingDay2=new Date(2021,11,25);
        const nonWorkingDay3=new Date(2022,4,1)

        const nonWorkingDays=[nonWorkingDay1,nonWorkingDay2,nonWorkingDay3]

        const new_resultados=nonWorkingDays.filter(day=>day>=notificationDate && day<=currentDate)
        return new_resultados.length
    }

    // As a simplicity we will assume that each user will use just one token ID to pay the bill. If a
    // user has some IDs that putting together reach the desirable value, the user will
    // pool his tokens, otherwise he/she will not commit the tx

    /**
     *
     * @param {*} ctx
     * @param {*} tokenID
     * @param {*} amount
     * @param {*} receiverID
     */
    // Auxiliary function to transfer the money farmers pay.
    async _TransferMoney(ctx,tokenID, amount, toUserID,fromUserID){
        // No prior verifications needed, because they have been checked in main function, which is
        // MonthlyPayout
        const tokenBytes=await ctx.stub.getState(tokenID);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Error: no token associated with ID ${tokenID}`);
        }
        const token=JSON.parse(tokenBytes.toString());

        const balance=token.Amount-amount;


        const issuer=ctx.clientIdentity.getIDBytes();
        const genericID=await ctx.stub.getTxID();
        let typeID;
        const key1=await ctx.stub.createCompositeKey('securitizationCoin',[fromUserID,genericID]);
        const key2=await ctx.stub.createCompositeKey('securitizationCoin',[toUserID,genericID]);

        typeID=':1'
        const utxo1={
            ID: key1+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: token.Owner,
            Issuer: issuer,
            Amount: balance,
            Factor: 100,
            CanBeUsed: true
        };
        typeID=':0';
        const utxo2={
            ID: key2+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: toUserID,
            Issuer: issuer,
            Factor: 100,
            Amount: amount,
            CanBeUsed: true
        };

        let utxos=[];
        await ctx.stub.deleteState(token.ID);
        await ctx.stub.putState(utxo2.ID,Buffer.from(JSON.stringify(utxo2)));
        if (balance!==0){
            await ctx.stub.putState(utxo1.ID,Buffer.from(JSON.stringify(utxo1)));
            utxos=[utxo1,utxo2]
            return utxos
        }else{
            utxos=[utxo2]
            return utxos
        }
    }

    async _TransferMoneyToCouponAndPrincipal(ctx,tokenID, amount, couponPortion,toUserID,fromUserID){
        // No prior verifications needed, because they have been checked in main function, which is
        // MonthlyPayout
        const tokenBytes=await ctx.stub.getState(tokenID);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Error: no token associated with ID ${tokenID}`);
        }
        const token=JSON.parse(tokenBytes.toString());

        const balance=token.Amount-amount;
        //console.log('balance')
        //console.log(balance)


        const issuer=await ctx.clientIdentity.getIDBytes();
        const genericID=await ctx.stub.getTxID();
        let typeID;
        const key1=await ctx.stub.createCompositeKey('securitizationCoin',[toUserID,genericID]);
        const key2=await ctx.stub.createCompositeKey('securitizationCoin',[fromUserID,genericID]);

        typeID=':1'
        const utxo1={
            ID: key2+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: token.Owner,
            Issuer: issuer,
            Amount: balance,
            Factor: 100,
            CanBeUsed: true
        };
        // this utxo2 will be allocated to Coupon
        typeID=':0';
        const utxo2={
            ID: key1+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: toUserID,
            Issuer: issuer,
            Factor: 100,
            Amount: parseInt(couponPortion*amount),
            CanBeUsed: true
        };
        // this utxo3 will be allocated to principal
        typeID=':2';
        const utxo3={
            ID: key1+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: toUserID,
            Issuer: issuer,
            Factor: 100,
            Amount: amount-parseInt(couponPortion*amount),
            CanBeUsed: false
        };


        let utxos=[];
        await ctx.stub.deleteState(token.ID);
        await ctx.stub.putState(utxo2.ID,Buffer.from(JSON.stringify(utxo2)));
        await ctx.stub.putState(utxo3.ID,Buffer.from(JSON.stringify(utxo3)));
        if (balance!==0){
            await ctx.stub.putState(utxo1.ID,Buffer.from(JSON.stringify(utxo1)));
            utxos=[utxo1,utxo2,utxo3]
            return utxos
        }else{
            utxos=[utxo2,utxo3]
            return utxos
        }
    }




    // Irrigator client will submit a request in order to subscribe a PPA
    // More arguments should be included
    async RequestPPA(ctx,landID,crops){
        const userID= await ctx.GetUserIdentity('cif');
        const user=await ctx.clientIdentity.getIDBytes();
        let requestID=await ctx.stub.getTxID();
        let ID=await ctx.stub.createCompositeKey('PPARequest',[userID,requestID]);
        let PPARequestBytes=await ctx.stub.getState(ID);
        let PPARequest;
        if (!PPARequestBytes || PPARequestBytes.length === 0){
            PPARequest={
                ID: ID,
                UserID: userID,
                User: user,
                LandID: landID,
                Crops: crops,
            };
        }else{
            throw new Error(`State with ID ${ID} already exists`);
        }

        const valueBuffer = Buffer.from(JSON.stringify(PPARequest));

        await ctx.SetEventPayload(valueBuffer);
        await ctx.SetEventName('PPARequest');

        await ctx.stub.putState(PPARequest.ID,valueBuffer);
        return PPARequest
    }

    // Originator client queries PPARequests
    async QueryPPARequest(ctx){
        let iterator= ctx.stub.getStateByPartialCompositeKey("PPARequest",[])
        let results=[];
        for await (const res of iterator) {
            results.push(JSON.parse(res.value.toString()))
        }
        return results
    }


    // This function will contain the contractual terms of the PPA
    // This function will be executed by Originator, who will propose a PPA to a particular user, by means
    // of his/her digitalCertAsBytes.
    // This function will need a myriad of input arguments. Currently those arguments are commented
    async PPAProposal(ctx,PPARequestClientCert,PPARequestGenericID){
        // Prior verifications
        const ownerID=await ctx.GetUserIdentity('cif');

        let PPARequestKey=await ctx.stub.createCompositeKey('PPARequest',[PPARequestClientCert, PPARequestGenericID]);
        let PPARequestAsBytes=await ctx.stub.getState(PPARequestKey);
        if(!PPARequestAsBytes || PPARequestAsBytes.length === 0){
            throw new Error(`PPARequest with ID ${PPARequestKey} does not exist`);
        }
        let PPARequest=JSON.parse(PPARequestAsBytes.toString());
        if (ownerID===PPARequest.UserID){
            throw new Error(`Check owner and customer identities`);
        }
        let customerID=PPARequest.UserID;
        
        // PPA ID will be a "sum" of multiple keys, one of them is a free-collision key, the txID
        // This is not necessary, because each user will be subscribed to just one PPA
        const genericID=await ctx.stub.getTxID();

        // Create this composite Key
        const ppaID=await ctx.stub.createCompositeKey('PPA',[customerID,genericID]);

        // We also verify if a farmer/irrigator has already been offered a PPA
        const ppaHasBeenProposed= await this._isPPAProposed(ctx,ppaID);
        if (ppaHasBeenProposed){
            throw new Error(`Error: PPA for user ${customerID} has already been offered`);
        }

        // TODO
        // We define parameters of the PPA, just in case these parameters are common parameters.
        const date=await ctx.stub.getDateTimestamp();
        const day=1;
        const month=10;
        const year= 2032

        const ordinaryTerminationDate=new Date(year,month-1,day).setHours(0,0,0,0);
        const firstExtension=Date(year,month-2,day);

        const customer=PPARequest.User;
        // const customerID='';
        const customerEmail=await ctx.GetUserIdentity('email');
        // Owner is the ecert whose identity has proposed this PPA
        // const owner= ctx.clientIdentity.getID();
        const system= '';
        const land= '';
        const landID= '';
        const lastingPeriod= '';
        // const ordinaryTerminationDate= '';
        const advancedTerminated= '';
        const startDate= '';
        const extendedAgreement= '';
        const initialExtensions= '';
        // const firstExtension= '';
        const secondExtension= '';
        const extensionTimePriorToOrdinaryTerminationDate= '';
        const isExtensionMandatory= '';
        const additionalExtensions= '';
        const additionalExtensionTimePriorToLastAdditionalExtension= '';
        const additionalExtensionContractPrice= '';
        const isAdditionalExtension= '';
        const purchaseOption= '';
        const contractPrice= '';
        const paymentsFrequency= 12;
        const unitPrice= '';
        const minimumMonthlyFee= 100;
        // const firstMonthlyPayment= '';
        // const succesiveMonthlyPayments= '';
        const dismantlingSystemIncluded= '';
        const settlementBillingBussinesDays= '';
        const dueAmountsDays= '';
        const isInterestTriggered= '';
        const sellToThirdParties= '';
        const amountPayableToCustomer= '';
        const settlementAmountPayableDays= '';
        const amountPayableType= '';
        const highestEnergyDemandConexion= '';
        const grantFinancialAidBeneficiary= '';
        const netAmountSubsidy= '';
        const reductionContractPriceFees= '';
        const grantCollectionTime= '';
        const customerGoodFaith= '';
        const systemLandMaintenance= '';
        const maintenanceHistory= '';
        const powerSupplyInterruption= '';
        const powerSupplyInterruptionAdvancedTime= '';
        const anomalyCircumstance= '';
        const isCustomerAuthorized= '';
        const additionalPowerSupplyInterruption= '';
        const powerSupplyInterruptionCause= '';
        const extraordinaryExpenses= '';
        const isMaintenanceNecessary= '';
        const legalObligationSystemLand= '';
        const measurementEquipementResponsibility= '';
        const annualAccountsTime= '';
        const annualAccounts= '';
        const informationChangedTime= '';
        const highSpeedInternetConection= '';
        const lastModificationOn= new Date(date);
        const lastModificationUserID= '';
        const isSigned= false;
        const energyConsumption= [];
        const facturacionMensual= [];
        const lastEnergyConsumption='';
        const lastFacturacionMensual='';

        // Defining attributes of the object PPA
        // commented because of Unit Tests
        const PPA={
            docType: 'PPA',
            ppaID: ppaID,
            Customer: customer,
            CustomerID: customerID,
            CustomerEmail: customerEmail,
            OwnerID: ownerID,
            Owner: await ctx.clientIdentity.getIDBytes(),
            System: system,
            Land: land,
            LandID: landID,
            LastingPeriod: lastingPeriod,
            OrdinaryTerminationDate: ordinaryTerminationDate,
            AdvancedTerminated: advancedTerminated,
            StartDate: startDate,
            EnergyConsumption: energyConsumption,
            ExtendedAgreement: extendedAgreement,
            InitialExtensions: initialExtensions,
            FirstExtension: firstExtension,
            SecondExtension: secondExtension,
            BillDate: '',
            ExtensionTimePriorToOrdinaryTerminationDate: extensionTimePriorToOrdinaryTerminationDate,
            IsExtensionMandatory: isExtensionMandatory,
            AdditionalExtensions: additionalExtensions,
            AdditionalExtensionTimePriorToLastAdditionalExtension: additionalExtensionTimePriorToLastAdditionalExtension,
            AdditionalExtensionContractPrice: additionalExtensionContractPrice,
            IsAdditionalExtension: isAdditionalExtension,
            PurchaseOption: purchaseOption,
            ContractPrice: contractPrice,
            PaymentsFrequency: paymentsFrequency,
            FacturacionMensual: facturacionMensual,
            LastFacturacionMensual: lastFacturacionMensual,
            LastEnergyConsumption: lastEnergyConsumption,
            EnergyConsumption: energyConsumption,
            UnitPrice: unitPrice,
            MinimumMonthlyFee: minimumMonthlyFee,
            DismantlingSystemIncluded: dismantlingSystemIncluded,
            SettlementBillingBussinesDays: settlementBillingBussinesDays,
            DueAmountsDays: dueAmountsDays,
            IsInterestTriggered: isInterestTriggered,
            SellToThirdParties: sellToThirdParties,
            AmountPayableToCustomer: {
                myMethod: () => {
                    if (!PPA.SellToThirdParties){
                        return 0
                    }
                    return 100
                }
            },
            SettlementAmountPayableDays: settlementAmountPayableDays,
            AmountPayableType: amountPayableType,
            HighestEnergyDemandConexion: highestEnergyDemandConexion,
            GrantFinancialAidBeneficiary: grantFinancialAidBeneficiary,
            NetAmountSubsidy: netAmountSubsidy,
            ReductionContractPriceFees: reductionContractPriceFees,
            GrantCollectionTime: grantCollectionTime,
            CustomerGoodFaith: customerGoodFaith,
            SystemLandMaintenance: systemLandMaintenance,
            MaintenanceHistory: maintenanceHistory,
            PowerSupplyInterruption: powerSupplyInterruption,
            PowerSupplyInterruptionAdvancedTime: powerSupplyInterruptionAdvancedTime,
            AnomalyCircumstance: anomalyCircumstance,
            IsCustomerAuthorized: isCustomerAuthorized,
            AdditionalPowerSupplyInterruption: additionalPowerSupplyInterruption,
            PowerSupplyInterruptionCause: powerSupplyInterruptionCause,
            ExtraordinaryExpenses: extraordinaryExpenses,
            IsMaintenanceNecessary: isMaintenanceNecessary,
            LegalObligationSystemLand: legalObligationSystemLand,
            MeasurementEquipementResponsibility: measurementEquipementResponsibility,
            AnnualAccountsTime: annualAccountsTime,
            AnnualAccounts: annualAccounts,
            InformationChangedTime: informationChangedTime,
            HighSpeedInternetConection: highSpeedInternetConection,
            LastModificationOn: lastModificationOn,
            LastModificationUserID: lastModificationUserID,
            IsSigned: isSigned,
            IsServiceMaintenanceOn: false,
            IsLastBillPaid: false,
        };

        const valueBuffer = Buffer.from(JSON.stringify(PPA));

        // set event must be inside after transaction
        await ctx.SetEventPayload(valueBuffer);
        await ctx.SetEventName('PPAproposed');

        // await ctx.stub.putState('ppa',valueBuffer);
        await ctx.stub.putState(ppaID,valueBuffer);
        await ctx.stub.deleteState(PPARequestKey)
        return PPA
    }



    async QueryMyPPA(ctx){
        const userID= await ctx.GetUserIdentity('cif');
        let ppa=await this._mygetStateByPartialCompositeKey(ctx, 'PPA', userID)
        return ppa
    }


    // Farmer/Irrigator will execute this function and by doing that, he/she accepts/signs the PPA
    // proposal
    async AcceptPPA(ctx,ppaID){
        // we retrieve the value associated with this partial key
        const userID= await ctx.GetUserIdentity('cif');
        const new_ppaID=await ctx.stub.createCompositeKey('PPA',[userID,ppaID])
        const ppaBytes=await ctx.stub.getState(new_ppaID);
        if(!ppaBytes || ppaBytes.length === 0){
            throw new Error(`Error PPA with ID ${new_ppaID} does not exist`);
        }
        const ppa=JSON.parse(ppaBytes.toString());
        // ppa returns true if no PPA Contract for that userID has been issued.
        // ppa returns error if something is wrong with PPA Contract
        // Otherwise, ppa returns ppa value for that partial key

        if (ppa.CustomerID!==userID){
            throw new Error(`You are not allowed to perform this action`);
        }

        // Check if attribute IsSigned is true
        if (ppa.IsSigned){
            throw new Error(`Your PPA has been already signed`);
        }

        // Otherwise, change the IsSigned state.
        ppa.IsSigned=true;
        // ppa.Customer=await ctx.clientIdentity.getID();
        let date=await ctx.stub.getDateTimestamp();

        // Attach current date
        ppa.LastModificationOn=new Date(date);

        const valueBuffer = Buffer.from(JSON.stringify(ppa));


        await ctx.SetEventPayload(valueBuffer);
        await ctx.SetEventName('PPAaccepted')
        await ctx.stub.putState(ppa.ppaID,valueBuffer);
        return ppa
    }

    // If a farmer signs a PPAproposal, originator will receive its event and according to it, will issue a POOL token that
    // will record every ppaID. The owner of this Token will receive the payments farmers will do.
    // This will be the pool of PPAs
    async MintPPA(ctx,customerID,ppaID,poolName){
        const genericID=await ctx.stub.getTxID();
        const new_ppaID=await ctx.stub.createCompositeKey('PPA',[customerID,ppaID])
        const ppaBytes=await ctx.stub.getState(new_ppaID);

        if (!ppaBytes || ppaBytes.length === 0){
            throw new Error(`Error: no State related to key ${new_ppaID}`);
        }
        const ppa=JSON.parse(ppaBytes.toString());
        const userID= await ctx.GetUserIdentity('cif');
        if (userID!==ppa.OwnerID){
        	throw new Error(`Field ownerID does not match your user identity of the ecert`);
        }
        if (!ppa.IsSigned){
            throw new Error('This PPA has not been signed');
        }
        if (ppa.IsIssued){
            throw new Error(`This PPA is already inside the POOL`);
        }

        console.log('hasta aqui bien')

        // Include PPA Key inside Pool of assets
        let pool;
        let hasBeenCreated=await this._isPoolCreated(ctx, poolName);
        let date=await ctx.stub.getDateTimestamp();

        if (!hasBeenCreated){
            console.log('inside if')
            pool={
                poolID: '',
                ppaIDs: [],
                OwnerID: '',
                Name: poolName,
                LastModificationOn: new Date(date),
                CouponPortion: 1,
            }
            pool.OwnerID=ppa.OwnerID;
            pool.ppaIDs.push(ppa.ppaID);
            pool.poolID=await ctx.stub.createCompositeKey('POOL',[genericID]);
            //console.log(pool);
            await ctx.stub.putState(pool.poolID,Buffer.from(JSON.stringify(pool)));
        }else{
            console.log('inside else')
            pool=await this._getPoolStateByPartialCompositeKey(ctx,'POOL');
            //console.log(pool)
            pool.OwnerID=ppa.OwnerID;
            pool.ppaIDs.push(ppa.ppaID);
            ppa.LastModificationOn=new Date(date);
            await ctx.stub.deleteState(pool.poolID);
            pool.poolID=await ctx.stub.createCompositeKey('POOL',[genericID]);
            await ctx.stub.putState(pool.poolID,Buffer.from(JSON.stringify(pool)));
        }
        let valueBuffer=Buffer.from(JSON.stringify(pool));
        await ctx.SetEventPayload(valueBuffer);
        await ctx.SetEventName('PPAtokenMinted');
        return pool
    }


    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ---------------------------------------TODO-----------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------

    /**
     *
     * @param {Context} ctx
     * @param {string} argtype is the default types of maintenance services originator is
     *  able to provide
     */
    // Farmer will execute this function in order to request one of the default maintenance services
    // offered by Originator. She/He will record the date request was made, so originator must be listening
    // to events of this type if no overexpenses are considered
    async MaintenanceServiceRequest(ctx, ppaID, serviceMaintenanceType){
        //TODO
        const maintenanceType=[
            {
                name: 'service1',
            },
            {
                name: 'service2',
            },
            {
                name: 'service3',
            },
        ];

        const userID=await ctx.GetUserIdentity('cif');
        const new_ppaID=await ctx.stub.createCompositeKey('PPA',[userID,ppaID])
        const ppaBytes=await ctx.stub.getState(new_ppaID);
        if (!ppaBytes || ppaBytes.length === 0){
            throw new Error(`PPA with ID ${new_ppaID} does not exist`);
        }
        const ppa=JSON.parse(ppaBytes.toString());
        // check ID of eCert and ID of PPA customer
        if (userID!==ppa.CustomerID){
            throw new Error(`Customer ID and User ID do not match`);
        }

        // We check if it has been signed
        if (!ppa.IsSigned){
            throw new Error('This PPA has not been signed');
        }

        if (ppa.IsInDefault){
            throw new Error(`You are not allowed to perform this action`)
        }
        let date= await ctx.stub.getDateTimestamp();
        const solution=maintenanceType.find( service => service.name === serviceMaintenanceType ) ;
        // Prior input parameters verifications
        if (solution===undefined) {
            throw new Error(`The ${serviceMaintenanceType} service is not available`);

        } else {
            ppa.MaintenanceServiceRequest=solution.name;
            ppa.LastMaintenanceServiceOn=new Date(date);
            ppa.ServiceRequestDate=new Date(date);
        }

        ppa.LastModificationOn=new Date(date);
        ppa.IsServiceMaintenanceOn=true;
        ppa.LastModificationUserID=userID;
        const valueBuffer = Buffer.from(JSON.stringify(ppa));
        await ctx.stub.putState(ppa.ppaID,valueBuffer);
        await ctx.SetEventName('MaintenanceRequired');
        await ctx.SetEventPayload(valueBuffer);
        return ppa
    }



    // for simplicity we are not considering a symbiosys between oracles and blockchain
    // networks (in this version), so we will introduce that real time parameters as a function
    // which will be called beforeTransaction (or not). That parameters state will include current
    // electricity price, current payment proportion between principal and coupon...
    // async WriteCommonRealTimeParameters(ctx,currentElectricityPrice, paymentProportionAllocated,date){
    //     // At the moment no identity verifications
    //     // Who can commit this function????

    //     // We are going to assign an easy-to-query key
    //     const key='RealTimeParameters';
    //     // Check if this doc already exists
    //     const oldvalueBytes=await ctx.stub.getState(key);
    //     let value;
    //     if (!oldvalueBytes || oldvalueBytes.length === 0) {
    //         value={
    //             ID: key,
    //             ElectricityPrice: currentElectricityPrice,
    //             ProportionAllocated: paymentProportionAllocated,
    //             LastModificationOn: new Date(date)
    //         };
    //         const valueBuffer = Buffer.from(JSON.stringify(value));
    //         await ctx.stub.putState(key, valueBuffer);
    //     }
    //     value= JSON.parse(oldvalueBytes.toString());
    //     value.key=key;
    //     value.ElectricityPrice=currentElectricityPrice;
    //     value.ProportionAllocated=paymentProportionAllocated;
    //     value.LastModificationOn= new Date(date);
    //     const valueBuffer= Buffer.from(JSON.stringify(value));
    //     await ctx.stub.putState(key,valueBuffer);
    // }

    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------


    // Originator will execute this function monthly to update the PPA with data about energy
    // consumption
    async EnergyConsumptionPerPPA(ctx,customerID,ppaID,energyConsumption){
        //TODO: Check decimals of energyConsumption
        let ownerID=await ctx.GetUserIdentity('cif');
        // get PPA state
        const new_ppaID=await ctx.stub.createCompositeKey('PPA',[customerID,ppaID])
        const ppaBytes=await ctx.stub.getState(new_ppaID);
        if(!ppaBytes || ppaBytes.length === 0){
            throw new Error(`State with ID ${new_ppaID} does not exist`)
        }
        let ppa=JSON.parse(ppaBytes.toString());
        // check if owner of the PPA (originator) matches the client who executes this function
        if (ownerID!==ppa.OwnerID){
            throw new Error(`You are not allowed to perform this action`);
        }
        if (!ppa.IsSigned){
            throw new Error('This PPA has not been signed');
        }

        const energy=parseFloat(energyConsumption);
        // update the date
        let date=await ctx.stub.getDateTimestamp();
        ppa.LastModificationOn=new Date(date);


        // these data will be reset once a year (once its size is equal to 12)
        if (ppa.EnergyConsumption.length===ppa.PaymentsFrequency){
            ppa.EnergyConsumption=[];
        }

        if (!ppa.IsLastBillPaid){
            ppa.IsInDefault=true;
        }else{
            ppa.IsInDefault=false;
        }
        // append data
        ppa.EnergyConsumption.push(energy);
        ppa.LastEnergyConsumption=energy;
        ppa.LastModificationUserID=ownerID;
        ppa.BillDate=ppa.LastModificationOn;
        ppa.IsLastBillPaid=false;
        ppa.IsInDefault=false
        const ppaBuffer= Buffer.from(JSON.stringify(ppa));
        await ctx.stub.putState(ppa.ppaID,ppaBuffer);
        await ctx.SetEventName('BillDelivered')
        await ctx.SetEventPayload(ppaBuffer);
        return ppa
    }


    // Once originator has issued a bill, farmer/irrigator must pay for the consumed energy in a
    // certain period of time, otherwise farmer will be considered a defaulter
    async MonthlyBillPayout(ctx, ppaID,tokenID, typeID){
        // TODO: data from oracle

        // get the state of the token
        const userID= await ctx.GetUserIdentity('cif');
        const new_ppaID=await ctx.stub.createCompositeKey('PPA',[userID,ppaID])
        const compositeKey=await ctx.stub.createCompositeKey('securitizationCoin',[userID,tokenID]);
        const tokenBytes=await ctx.stub.getState(compositeKey+typeID);
        if (!tokenBytes || tokenBytes.length === 0){
            throw new Error(`Error token with ID ${compositeKey} does not exist`);
        }
        const token=JSON.parse(tokenBytes.toString());

        if (!token.CanBeUsed){
            throw new Error(`Error, token with ID ${tokenID} is allocated to other services. Try to use another key or cancel whatever your token is allocated to`);
        }

        // Now we retrieve the PPA associated with userDNI
        const valueBytes=await ctx.stub.getState(new_ppaID);

        if (!valueBytes || valueBytes.length === 0){
            throw new Error(`PPA with ID ${ppaID} does not exist`);
        }

        let value= JSON.parse(valueBytes.toString());
        // Check if customer and user who send transaction proposal match
        // Not compulsory, we have already checked this with the ppa proposal
        if (value.CustomerID!==userID){
            throw new Error(`You are not allowed to perform this action`);
        }
        if (!value.IsSigned){
            throw new Error(`PPA with ID ${ppaID} has not been signed`);
        }

        let date=await ctx.stub.getDateTimestamp();
        // Check if there are non working days between these dates
        const currentDate=new Date(date);
        const billDate=new Date(value.BillDate);

        const numberNonworkingDays=await this._checkNonWorkingDays(currentDate,billDate);

        const diff_days=(currentDate.getTime() - billDate.getTime())/(1000*3600*24);
        // TODO: not sure about this. If user wish to pay, should we accept later payments? better than nothing...

        // check if current day is inside boudary dates
        const limitDate=value.LimitDate+numberNonworkingDays;
        if (diff_days>limitDate){
            throw new Error(`Try to pay before time limit`);
        }

        // These functions should be included in the PPA object
        // Define functions to determine the price to pay for
        const myFunctions={
            firstMonthlyPayment:  (par_UnitPrice,par_EnergyConsumption, par_MinimumMonthlyFee) => {
                const values=[par_UnitPrice*par_EnergyConsumption,par_MinimumMonthlyFee]
                // const values=[PPA.UnitPrice*PPA.LastEnergyConsumption,PPA.MinimumMonthlyFee];
                const resultado=Math.max(...values);
                return resultado
            },
            succesiveMonthlyPayments: (par_LastEnergyConsumption,par_UnitPrice,par_MinimumMonthlyFee,par_EnergyConsumption,par_FacturacionMensual) => {
                let total=par_FacturacionMensual.reduce(function(a, b){ return a + b; });
                const values=[par_LastEnergyConsumption*par_UnitPrice,Math.abs(par_MinimumMonthlyFee*par_EnergyConsumption.length-total)];
                const resultado=Math.max(...values);
                return resultado
            },
        };

        if (value.IsLastBillPaid){
            throw new Error(`You have already paid this bill`);
        }

        // depending on which period we stay, i.e depending on which size energyconsumption has, which
        // is our History per year
        let bill;

        if (value.EnergyConsumption.length===1){
            bill=myFunctions.firstMonthlyPayment(value.UnitPrice,value.LastEnergyConsumption,value.MinimumMonthlyFee);
        }else{
            // }else if (value.EnergyConsumption.length!==0){
            bill=myFunctions.succesiveMonthlyPayments(value.LastEnergyConsumption,value.UnitPrice,value.MinimumMonthlyFee,value.EnergyConsumption,value.FacturacionMensual);
        }

        let new_bill=bill.toFixed(2);
        // Now it is clear how much has the farmer to pay for, it is time to pay (send his/her tokens)
        const myMoney=token.Amount;
        const balance=myMoney-parseInt(new_bill*100);
        if (balance<0){
            throw new Error(`Please add more coins to your wallet, or pool them. Bill amounts to ${new_bill}`);
        }

        value.FacturacionMensual.push(new_bill);
        value.LastFacturacionMensual=new_bill;
        value.LastModificationOn=currentDate;
        value.LastModificationUserID=userID;
        value.IsLastBillPaid=true;

        // retrieve PPA Pool state in order to allocate tokens to pool owner or to ppa Owner if ppa
        // is not inside pool


        let [isInside, owner]=await this._isPPAinPool(ctx,value.ppaID);
        if (!owner || !isInside){
            // bill paid to PPA Owner
            owner=value.OwnerID
        }
        let ret
        let couponPortion=await this._getCouponProportion(ctx,'POOL');

        // Igual asi es mejor 
        // if(isInside){

        // }else{

        // }

        // el caso de que no este dentro de la Pool no existiria usando este statement
        if (couponPortion===1){
            ret=await this._TransferMoney(ctx,token.ID,new_bill,owner,userID)
        }else{
            // else we must allocate p*Bill tokens to Coupon Payments which will be CanBeUsed=true Tokens
            // and 1-p tokens to Principal payment which will be CanBeUsed=false Tokens
            ret=await this._TransferMoneyToCouponAndPrincipal(ctx,token.ID,new_bill,couponPortion,owner,userID)
        }
        // let CouponPortion=await this._isCouponPortion
        // if()
        // TODO
        // tranfer to tokens' owner
        // let ret=await this._TransferMoney(ctx,token.ID,new_bill,owner,userID)
        await ctx.stub.putState(value.ppaID,Buffer.from(JSON.stringify(value)))
        return ret
    }




    // // TODO: Who can execute this function??
    // /**
    //  *
    //  * @param {*} ctx
    //  * @param {*} userID
    //  * @param {*} date
    //  */
    // // Each period, originator will check how are performing the PPAs he has offered. This will update
    // // if some irrigator is a defaulter or not.
    // async MonthlyPerformance(ctx, ppaID,date){
    //     const ppaBytes=await ctx.stub.getState(ppaID);

    //     if (!ppaBytes || ppaBytes.length === 0){
    //         throw new Error(`This PPA ID ${ppaID} does not exist`);
    //     }
    //     let ppa=JSON.parse(ppaBytes.toString())
    //     // Now we check its performance and update PPA according to elapsed time between current date
    //     // and payment date or other dates
    //     const currentlyDate=new Date(DATE)
    //     // Were bills paid on time?

    //     // Check difference between dates


    //     // TODO: the rest of verifications


    //     // ppa.LastModificationOn=date;
    //     // ppa.LastModificationUserID=userID;

    //     const ppaBuffer= Buffer.from(JSON.stringify(ppa));
    //     await ctx.stub.putState(ppa.ppaID,ppaBuffer)
    // }

    // TODO:
    // change userID -> ppaID
}





// This is another contract which defines a new bussiness: the acquisition of PPA Tokens,
// valuation of the pool on-chain and  transference of the bonds
class bondIssuanceContract extends Contract {
    constructor() {
        super('bonds.securitization.com')
    }

    createContext() {
        return new securitizationContext();
    }

    // This function is expected to return just one value associated with the partialKey of the user Identity Number
    async _mygetStateByPartialCompositeKey(ctx, name, userID){
        const iterator= ctx.stub.getStateByPartialCompositeKey(name,[userID]);
        let counter=0;
        let results;

        for await (const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
            }
        if (counter>1){
            throw new Error('This state-value pair is not unique');
        }else if (counter===0){
            return true;
        }
        return results;
    }


     async _isPoolCreated(ctx,poolName){
        const iterator=ctx.stub.getStateByPartialCompositeKey(poolName,[]);
        let results=[];
        for await (const res of iterator) {
            // push key instead of value json
            results.push(res.key);
        }
        if (results.length === 0){
            return false
        }else if (results.length===1){
            return true;
        }else{
            throw new Error(`State not unique`)
        }
    }

    // This auxiliary function will only work with those states expected to be unique (POOL, REALTIMEPARAMETERS, RATING...)
    async _getPoolStateByPartialCompositeKey(ctx, docTypeName){
        const iterator= ctx.stub.getStateByPartialCompositeKey(docTypeName,[]);
        let counter=0;
        let results;
        let isCreated;
        let res=[]
        for await (const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
        }
        if (counter===1){
            isCreated=true
            res.push(isCreated);
            res.push(results)
            return res;
        }else if (counter===0){
            isCreated=false;
            res.push(isCreated);
            return res;
        }else{
            throw new Error('This state-value pair is not unique');
        }
    }


    // Prior verifications included in beforeTransaction logic
    async beforeTransaction(ctx) {
        let userMSPID=ctx.GetMSPID();
        if (userMSPID!=='originatorMSP' && userMSPID!=='spvMSP' && userMSPID!=='ratingagencyMSP'){
            throw new Error(`Your organization ${userMSPID} is not allowed to perform this action`);
        }
        let isClient=await ctx.GetRole();
        if (!isClient){
            throw new Error(`You are not allowed to perform this action`);
        }
        await ctx.SetMSPID(userMSPID);
        let par=await ctx.stub.getFunctionAndParameters();
        let func = par.fcn;
        let params=par.params;
        for (let i=0;i<params.length;i++){
            if (params[i]===''){
                throw new Error('There is at least one empty parameter');
            }
        }
        switch(func){
            case 'BuyRequest':
                if (ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'SellRequest':
                if (ctx.mspid!=='originatorMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'SignRequestOriginator':
                if (ctx.mspid!=='originatorMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'SignRequestSPV':
                if (ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'Rating':
                if (ctx.mspid!=='ratingagencyMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'IssueBond':
                if (ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryPool':
                if (ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'QuerySellRequest':
                if (ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryBuyRequest':
                if (ctx.mspid!=='originatorMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryFullRequest':
                if (ctx.mspid!=='originatorMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
        }
    }

    // async afterTransaction(ctx){
    //     let event=await ctx.GetEventPayload();
    //     return event
    // }


    async QueryPool(ctx,poolName){
        let pool=await this._getPoolStateByPartialCompositeKey(ctx,poolName);
        if (!pool[0] && pool.length===1){
            throw new Error(`There is no Pool linked to name ${poolName}`)
        }
        return pool[1]
    }


    // SPV will want to buy the pool of assets that originator owns, but firstly she/he needs
    // to submit a request to buy it.
    async BuyRequest(ctx,amount,price, poolName,poolID){
        const userID=await ctx.GetUserIdentity('cif');

        const genericID=await ctx.stub.getTxID();
        const requestID=await ctx.stub.createCompositeKey('BuyRequest',[userID,genericID]);

        let poolCompositeKey=await ctx.stub.createCompositeKey(poolName,[poolID]);
        let poolAsBytes=await ctx.stub.getState(poolCompositeKey)
        if(!poolAsBytes|| poolAsBytes.length === 0){
            throw new Error('Error');
        }
        let pool=JSON.parse(poolAsBytes.toString());
        let value={
            ID: requestID,
            Owner: userID,
            Receiver: '',
            Amount: parseInt(amount),
            Price: parseInt(parseFloat(price)*100),
            IsSigned: false,
            Factor:100,
            PoolID: pool.poolID
        };

        const valueBuffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(requestID,valueBuffer);
        await ctx.SetEventName('BuyRequestIssued');
        await ctx.SetEventPayload(valueBuffer);
        return value
    }

    async QueryBuyRequest(ctx){
        let iterator= ctx.stub.getStateByPartialCompositeKey('BuyRequest',[])

        let results=[]
        for await (const res of iterator){
            results.push(JSON.parse(res.value.toString()))
        }
        return results

    }


    // Originator submits a sell request to SPV
    async SellRequest(ctx, price,poolName, poolID){
        const userID=await ctx.GetUserIdentity('cif');

        const genericID=await ctx.stub.getTxID();
        const requestID=await ctx.stub.createCompositeKey('SellRequest',[userID,genericID]);

        let poolCompositeKey=await ctx.stub.createCompositeKey(poolName,[poolID]);
        let poolAsBytes=await ctx.stub.getState(poolCompositeKey)
        if(!poolAsBytes|| poolAsBytes.length === 0){
            throw new Error('Error');
        }


        let value={
            ID: requestID,
            Owner: userID,
            Receiver: '',
            Price: parseInt(parseFloat(price)*100),
            Factor: 100,
            IsSigned: false,
            BackedBy: poolCompositeKey
        };
        const valueBuffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(requestID,valueBuffer);
        await ctx.SetEventName('SellRequestIssued');
        await ctx.SetEventPayload(valueBuffer);
        return value
    }

    async QuerySellRequest(ctx){
        let iterator= ctx.stub.getStateByPartialCompositeKey('SellRequest',[])
        
        let results=[]
        for await (const res of iterator){
            results.push(JSON.parse(res.value.toString()))
        }
        return results
    }

    // cash token owner must sign first
    // SPV accepts request. Check if she/he has enough funds
    async SignRequestSPV(ctx,tokenID,typeID, buyRequestID,sellRequestID,sellRequestPrice,poolName,sellRequestBackedBy,sellRequestOwner){
        const userID=await ctx.GetUserIdentity('cif');

        const buyRequestKey= await ctx.stub.createCompositeKey('BuyRequest',[userID,buyRequestID])
        const buyRequestBytes=await ctx.stub.getState(buyRequestKey);
        if (!buyRequestBytes || buyRequestBytes.length === 0) {
            throw new Error(`Buy request linked to ID ${buyRequestID} does not exist`)
        }
        const buyRequest=JSON.parse(buyRequestBytes.toString());
        // Check if this request has been already signed
        if (buyRequest.IsSigned){
            throw new Error(`Request has been already signed. Not allowed to perform this action`);
        }

        // As cash owner will signs the request, we must be sure that he is the owner of that amount
        // and maybe we should block his/her funds
        // I dont think this could be necessary because in the DvP we will execute both actions, and
        // if one of them does not succeed, noone will succeed.
        // In order to not create false requests we are going to freeze tokens

        const token_ID=await ctx.stub.createCompositeKey('securitizationCoin',[userID,tokenID]);
        const tokenBytes=await ctx.stub.getState(token_ID+typeID);
        if (!tokenBytes || tokenBytes.length === 0){
            throw new Error(`Error, Token with ID ${tokenID+typeID} does not exist`);
        }
        const myFunds=JSON.parse(tokenBytes.toString());

        if (!myFunds.CanBeUsed){
            throw new Error(`Your token has been already used`)
        }

        // Check our funds
        if (buyRequest.Price>myFunds.Amount){
            throw new Error(`Your token has not enough funds. Try to pool your token or ask for mint`);
        }

        // If we have enough funds, then we can sign the request
        buyRequest.IsSigned=true;

        // Get sell request
        const sellRequestKey=await ctx.stub.createCompositeKey('SellRequest',[sellRequestOwner,sellRequestID])
        const sellRequestBytes=await ctx.stub.getState(sellRequestKey);
        if (!sellRequestBytes || sellRequestBytes.length === 0) {
            throw new Error(`Sell Request does not exist or have been removed`)
        }
        const sellRequestBackedByKey=await ctx.stub.createCompositeKey(poolName,[sellRequestBackedBy])
        let sellRequest=JSON.parse(sellRequestBytes.toString());
        if ( sellRequest.Price!==parseInt(parseFloat(sellRequestPrice)*100) || sellRequest.BackedBy!==sellRequestBackedByKey || sellRequest.Owner!==sellRequestOwner){
            throw new Error(`Sell Request has been modified`)
        }

        buyRequest.Receiver=sellRequestOwner;

        let txid=await ctx.stub.getTxID();
        let requestCompositeKey=await ctx.stub.createCompositeKey('Request',[txid]);

        const n_value={
            ID:requestCompositeKey,
            buyRequest: buyRequest,
            sellRequest: sellRequest,
            TokenID: token_ID+typeID
        }
        const valueBuffer= Buffer.from(JSON.stringify(n_value));
        await ctx.stub.putState(requestCompositeKey,valueBuffer);
        await ctx.stub.deleteState(sellRequest.ID);
        await ctx.stub.deleteState(buyRequest.ID);
        await ctx.SetEventName('SignSellRequest');
        await ctx.SetEventPayload(valueBuffer);
        return requestCompositeKey
    }

    async QueryFullRequest(ctx){
        let iterator= ctx.stub.getStateByPartialCompositeKey('Request',[])
        
        let results=[]
        for await (const res of iterator){
            results.push(JSON.parse(res.value.toString()))
        }
        return results

    }

    async _dvp(ctx,tokenID,securityID, tokensToTransfer){
        const tokenBytes=await ctx.stub.getState(tokenID);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Error, Token state according to key ${tokenID} does not exist`);
        }
        const token=JSON.parse(tokenBytes.toString());

        const securityBytes=await ctx.stub.getState(securityID);
        if (!securityBytes || securityBytes.length === 0) {
            throw new Error(`Error, Pool state according to key ${securityID} does not exist`);
        }
        const security=JSON.parse(securityBytes.toString());

        if(!token.CanBeUsed){
            throw new Error(`Token has been already used`)
        }
        
        const genericID=await ctx.stub.getTxID();

        const key1=await ctx.stub.createCompositeKey('securitizationCoin',[token.Owner,genericID]);
        const key2=await ctx.stub.createCompositeKey('securitizationCoin',[security.OwnerID,genericID]);
        const securityKey1=await ctx.stub.createCompositeKey('POOL',[genericID]);


        const balanceTokens=token.Amount-tokensToTransfer;

        let utxo1;
        let utxo2;
        let typeID;

        typeID=':1';
        utxo1={
            ID: key1+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: token.Owner,
            Issuer: token.Issuer,
            Amount: balanceTokens,
            Factor: 100,
            CanBeUsed: true
        };
        typeID=':0';
        utxo2={
            ID: key2+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: security.OwnerID,
            Issuer: token.Issuer,
            Amount: tokensToTransfer,
            CanBeUsed: true
        };

        security.poolID=securityKey1;
        security.OwnerID=token.Owner;

        await ctx.stub.deleteState(tokenID);
        await ctx.stub.deleteState(securityID);

        await ctx.stub.putState(utxo2.ID,Buffer.from(JSON.stringify(utxo2)));
        await ctx.stub.putState(security.poolID,Buffer.from(JSON.stringify(security)));
        if (balanceTokens!=0){
            await ctx.stub.putState(utxo1.ID,Buffer.from(JSON.stringify(utxo1)));
        }
    }


    // securities owner must sign afterwards
    // originator accepts request: enough securities
    async SignRequestOriginator(ctx,poolName, poolID,fullRequestID,buyRequestIdentity,buyRequestAmount,buyRequestPrice){
        const userID= await ctx.GetUserIdentity('cif');
        const requestKey=await ctx.stub.createCompositeKey('Request',[fullRequestID])
        const valueBytes=await ctx.stub.getState(requestKey);
        if(!valueBytes || valueBytes.length === 0){
            throw new Error(`Request State does not exist`)
        }
        const value=JSON.parse(valueBytes.toString());

        // Originator in order to sign this request must provide an own PPA pool
        const tokenID= await ctx.stub.createCompositeKey(poolName,[poolID]);
        const poolBytes=await ctx.stub.getState(tokenID);
        if (!poolBytes || poolBytes.length === 0) {
            throw new Error(`Error, Pool State does not exist according to the key provided`);
        }

        if (userID!==value.buyRequest.Receiver){
            throw new Error('You are not allowed to perform this action')
        }
        const pool=JSON.parse(poolBytes.toString());
        if (pool.OwnerID!==userID){
            throw new Error(`User ID ${userID} does not match Pool Owner`)
        }
        if (pool.ppaIDs.length!==value.buyRequest.Amount){
            throw new Error(`Size of Pool and size of Buy Request do not match`);
        }

        value.sellRequest.IsSigned=true;
        if (parseInt(parseFloat(buyRequestPrice)*100)!==value.buyRequest.Price || parseInt(buyRequestAmount)!==value.buyRequest.Amount || buyRequestIdentity!==value.buyRequest.Owner){
            throw new Error('Some args of Full Request have been modified')
        }
        // DvP is triggered
        await this._dvp(ctx,value.TokenID,pool.poolID,value.buyRequest.Price);
        await ctx.stub.deleteState(fullRequestID);
    }


    // Once SPV has acquired the Pool of PPAs, rating agency will assess PPA assets in order to
    // issue securities backed by the Pool.
    async Rating(ctx,poolName,poolID,rating){
        const userID= await ctx.GetUserIdentity('cif');
        const poolKey=await ctx.stub.createCompositeKey(poolName,[poolID])
        const poolBytes=await ctx.stub.getState(poolKey);
        if (!poolBytes || poolBytes.length === 0){
            throw new Error(`Pool does not exist, not possible to attach a rating`)
        }
        const key=await ctx.stub.createCompositeKey('Rating',[poolID]);
        const value={
            ID: key,
            AssetsID: poolID,
            PoolName:poolName,
            Owner: userID,
            RatingArgs: rating
        }
        const valueBuffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(key, valueBuffer);
        return value
    }

    async QueryRating(ctx,poolID){
        const ratingKey=await ctx.stub.createCompositeKey('Rating',[poolID])
        const ratingBytes= await ctx.stub.getState(ratingKey)
        if(!ratingBytes || ratingBytes.length === 0){
            throw new Error(`Rating with ID ${poolID} does not exist`)
        }
        const value=JSON.parse(ratingBytes.toString())
        return value
    }


    //check if spv owns every ppa
    async IssueBond(ctx,ratingID,p){
        const userID= await ctx.GetUserIdentity('cif');
        // We retrieve data from rating
        const ratingCompositeKey=await ctx.stub.createCompositeKey('Rating',[ratingID]);
        const ratingBytes= await ctx.stub.getState(ratingCompositeKey);
        if (!ratingBytes || ratingBytes.length === 0){
            throw new Error(`Rating still not delivered`);
        }
        const rating=JSON.parse(ratingBytes.toString());
        const poolID=rating.AssetsID;
        const poolName=rating.PoolName;
        const poolCompositeKey=await ctx.stub.createCompositeKey(poolName,[poolID])
        const poolBytes=await ctx.stub.getState(poolCompositeKey);
        console.log(poolCompositeKey)
        if (!poolBytes || poolBytes.length === 0){
            throw new Error(`Error, Pool State does not match Pool ID provided`);
        }
        const pool=JSON.parse(poolBytes.toString());
        if (pool.OwnerID!==userID){
            throw new Error(`User ID ${userID} does not own Pool`);
        }

        
        // Rating State will provide some attributes bons must have.
        const genericID=await ctx.stub.getTxID();
        const key=await ctx.stub.createCompositeKey('BondToken',[userID,genericID]);

        const new_pool={
            ppaIDs: pool.ppaIDs,
            OwnerID: pool.OwnerID,
            ID: pool.Name+genericID,
            Name: pool.Name,
            CouponPortion:p
        };

        const typeID=':0';
        const bondID=key+typeID;

        let ThisDate=await ctx.stub.getDateTimestamp();
        let thisDate=new Date(ThisDate);
        // TODO: every time there is an attribute Issuer, should it be
        // ctx.clientIdentity.getID() or ctx.clientIdentity.getIDBytes();
        // lets suppose we issue a bond with maturity up to fifteen years (the same as the PPA Contract), coupon rate fixed of 2% and paid twice a year from bond issuance date.
        // Coupon can be retrieved the days after couponDates[totalCoupons-remainingPayments]

        let couponRate=0.0423;
        let faceValue=1000;
        let remainingPayments=30;
        let couponsReceived=0;
        let totalCoupons=30
        let couponDates=new Array(totalCoupons);
        let maturityDate;

        let initYear=thisDate.getFullYear();
        let initMonth=thisDate.getMonth();

        let newInitYear,newInitMonth,newInitDate;

        if(initMonth<11){
            newInitMonth=initMonth+1
            newInitDate=1
            newInitYear=initYear
            maturityDate=new Date(initYear+15,newInitMonth,newInitDate);
        }else{
            newInitMonth=0
            newInitDate=1
            newInitYear=initYear+1
            maturityDate=new Date(initYear+16,newInitMonth,newInitDate);
        }
        
        let nextYear=newInitYear
        let nextMonth=newInitMonth;
        let nextDate=newInitDate;
        let monthDiff;

        for (let l=0; l<totalCoupons;l++){
            if(newInitMonth+6<12){
                if(l%2===0){
                    nextMonth+=6
                }else{
                    nextYear=nextYear+1
                    nextMonth=newInitMonth
                }    
            }else{
                monthDiff=nextMonth+6-11;
                if(l%2===0){
                    nextYear=nextYear+1
                    nextMonth=monthDiff
                }else{
                    nextMonth=newInitMonth
                }    
            }
            couponDates[l]=new Date(nextYear,nextMonth,nextDate);
        }


        let monthlyPayout=couponRate*faceValue;
        console.log(couponDates)
        const bondToken={
            ID: bondID,
            GenericID: genericID,
            TypeID: typeID,
            Rating: rating.RatingArgs,
            CouponRate: couponRate,
            MaturityDate: maturityDate,
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: userID,
            Pool: rating.AssetsID,
            AmountPaid: "",
            FaceValue: faceValue,
            MonthlyPayout: monthlyPayout.toFixed(2),
            CouponDates: couponDates,
            CouponsReceived: couponsReceived,
            RemainingPayments: remainingPayments,
            Amount: 1000,
            CanBeUsed: true,
            NotBefore: couponDates[0] 
        };
        let valueBuffer=Buffer.from(JSON.stringify(bondToken));
        await ctx.stub.putState(bondID, valueBuffer);
        await ctx.stub.deleteState(poolCompositeKey)
        await ctx.stub.putState(new_pool.ID,Buffer.from(JSON.stringify(new_pool)))
        await ctx.SetEventName('BondsIssuance');
        await ctx.SetEventPayload(valueBuffer);
        return bondToken
    }
}







class servicingContract extends Contract {
    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('servicing.securitization.com');
    }

    createContext() {
        return new securitizationContext();
    }

    // TODO: change which orgs can execute this contract
    async beforeTransaction(ctx) {
        let userMSPID=ctx.GetMSPID();
        // if (userMSPID!=='investorMSP' && userMSPID!=='spvMSP' ){
        //     throw new Error(`Your organization ${userMSPID} is not allowed to perform this action`);
        // }
        let isClient=await ctx.GetRole();
        //console.log(`isClient: ${isClient}`);
        if (!isClient){
            throw new Error(`You are not allowed to perform this action`);
        }
        await ctx.SetMSPID(userMSPID);
        let par=ctx.stub.getFunctionAndParameters();
        let func = par.fcn;
        let params=par.params;
        for (let i=0;i<params.length;i++){
            if (params[i]===''){
                throw new Error('There is at least one empty parameter that should not be');
            }
        }

        switch(func){
            case 'AskOrder':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'AskMarketOrder':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'BidOrder':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'BidMarketOrder':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'PoolBond':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'TransferCoupons':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }
            case 'QueryOrderBook':
                if (ctx.mspid!=='investorMSP' && ctx.mspid!=='spvMSP'){
                    throw new Error(`Your organization ${ctx.mspid} is not allowed to perform this action`);
                }else{
                    return
                }


        }
    }

    // async afterTransaction(ctx){
    //     let event=await ctx.GetEventPayload();
    //     return event
    // }


    // This function is expected to return just one value associated with the partialKey of the user Identity Number
    async _mygetStateByPartialCompositeKey(ctx, name, userID){
        const iterator= ctx.stub.getStateByPartialCompositeKey(name,[userID]);
        let counter=0;
        let results;

        for await (const res of iterator) {
            results=JSON.parse(res.value.toString())
            counter=counter+1;
            }
        if (counter>1){
            throw new Error('Partial Key Uniqueness not provided. Something went wrong');
        }else if (counter===0){
            return true;
        }
        return results;
    }


    async _transferBond(ctx, userID,amount,keyFrom){
        const genericID=await ctx.stub.getTxID();

        const key1=await ctx.stub.createCompositeKey('BondToken',[userID,genericID]);

        //Verificacions on Coupons received should be a must
        let bondTokenAsBytes=await ctx.stub.getState(keyFrom[0]);
        // Already included within main function, i.e. PoolBond
        if (!bondTokenAsBytes || bondTokenAsBytes.length === 0){
            throw new Error('Error')
        }
        let oldBondToken=JSON.parse(bondTokenAsBytes.toString());

        for (const key of keyFrom) {
            await ctx.stub.deleteState(key);
        }

        let typeID=':0'
        const bondToken={
            ID: key1+typeID,
            GenericID: genericID,
            Rating: oldBondToken.Rating,
            CouponRate: oldBondToken.CouponRate,
            MaturityDate: oldBondToken.MaturityDate,
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: userID,
            Pool: oldBondToken.Pool,
            AmountPaid: "",
            FaceValue: oldBondToken.FaceValue,
            MonthlyPayout: oldBondToken.MonthlyPayout,
            RemainingPayments: oldBondToken.RemainingPayments,
            CouponDates: oldBondToken.CouponDates,
            CouponsReceived: oldBondToken.CouponsReceived,
            Amount: amount,
            TypeID: typeID,
            CanBeUsed: true,
            NotBefore:oldBondToken.NotBefore,
        };

        const bondTokenBuffer=Buffer.from(JSON.stringify(bondToken));
        await ctx.stub.putState(key1,bondTokenBuffer);
        return bondToken
    }


    async PoolBond(ctx){
        const userID= await ctx.GetUserIdentity('cif')
        const iterator= ctx.stub.getStateByPartialCompositeKey('BondToken',[userID]);
        let amount;
        let resultKeys=[];
        let counter=0;
        let value;
        //console.log('before for await')
        for await (const res of iterator) {
            value = JSON.parse(res.value.toString());
            amount=value.Amount;
            if (value.CanBeUsed){
                resultKeys.push(value.ID);
                counter=counter+amount;
            }
            if (resultKeys.length===2){
                break
            }
        }
        //console.log('after for await')
        if (resultKeys.length === 0 || resultKeys.length===1){
            throw new Error('There is nothing left to do');
            // return
        }
        let ret=await this._transferBond(ctx,userID, counter, resultKeys)
        return ret
    }


    // Our token will have 2 decimals, like fiat currencies
    async _checkDecimals(number){
        // In nodejs every atribute is passed as a string
        // First check if it is a number
        // number.stringify()
        // if(typeof number !=='number'){
        //     throw new Error('Wrong notation');
        // }
        // Not necessary, we are working with 2decimal-numbers
        // Integer between -2^53-1 and 2^53-1
        // if (!Number.isSafeInteger(number)){
        //     throw new Error('Wrong number');
        // }
        // Check if it is a 2decimal-number
        const numberString=number.toString();
        let index;
        let count=0;
        for(let i=0;i<numberString.length;i++){
            if (numberString[i]==='.'){
                index=i;
                count=count+1;
            }
            if (numberString[i]===','){
                throw new Error('Wrong format. Try using dot instead of comma')
            }
        }
        //console.log(`numero de puntos ${count}`);
        if ((numberString.length-1-index)>2 || count>1){
            throw new Error('Wrong decimals')
        }
        // Check if it is strictly positive
        number=parseFloat(number);
        if (number<=0){
            throw new Error('Number must be strictly positive');
        }

        return true
    }

    // Bid order will be executed by someone able to buy assets (bonds)

    // Auxiliary function to allocate certain amount of money every time a bid order is submitted
    async _splitMoney(ctx,tokenID, amount){
        const userID= await ctx.GetUserIdentity('cif');
        const tokenBytes=await ctx.stub.getState(tokenID);
        if (!tokenBytes || tokenBytes.length === 0) {
            throw new Error(`Error, Token state according to key ${tokenID} does not exist`);
        }
        const token=JSON.parse(tokenBytes.toString());

        if (token.CanBeUsed===false){
            throw new Error(`This token ID ${tokenID} has already been used. Try another Token ID`)
        }

        if (token.Amount<amount){
            throw new Error('Error, token State has not enough funds');
        }

        const balance=token.Amount-amount;

        const genericID=await ctx.stub.getTxID();
        const key1=await ctx.stub.createCompositeKey('securitizationCoin',[userID,genericID])
        const key2=await ctx.stub.createCompositeKey('securitizationCoin',[userID,genericID])

        let typeID;
        typeID=':1'
        const utxo1={
            ID: key1+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: token.Owner,
            Issuer: token.Issuer,
            Amount: balance,
            CanBeUsed: true
        };
        typeID=':0';
        const utxo2={
            ID: key2+typeID,
            GenericID: genericID,
            TypeID: typeID,
            Owner: token.Owner,
            Issuer: token.Issuer,
            Amount: amount,
            CanBeUsed: false
        };

        await ctx.stub.deleteState(token.ID);
        await ctx.stub.putState(utxo2.ID,Buffer.from(JSON.stringify(utxo2)));
        if (balance>0){
            await ctx.stub.putState(utxo1.ID,Buffer.from(JSON.stringify(utxo1)));
        }
        return utxo2.ID
    }

    // Auxiliary function to allocate certain amount of bonds every time an ask order is submitted
    async _splitBonds(ctx, bondID, amount){
        const userID= await ctx.GetUserIdentity('cif');
        const bondBytes=await ctx.stub.getState(bondID);
        if (!bondBytes || bondBytes.length === 0){
            throw new Error(`Error, Bond State according to key ${bondID} does not exist`);
        }
        const bond=await JSON.parse(bondBytes.toString());

        if (!bond.CanBeUsed){
            throw new Error(`This Bond State with ID ${bondID} has already been used in a prior order`);
        }
        if (amount>bond.Amount){
            throw new Error(`This Bond State has not enough bonds to transfer`);
        }

        const balance=bond.Amount-amount;

        const genericID=ctx.stub.getTxID();
        const key1=await ctx.stub.createCompositeKey('BondToken',[bond.Owner,genericID]);
        let typeID;
        typeID=':0'
        bondID=key1+typeID;

        const bond1={
            ID: bondID,
            GenericID: genericID,
            TypeID: typeID,
            Rating: bond.Rating,
            CouponRate: bond.CouponRate,
            MaturityDate: bond.MaturityDate,
            Issuer: bond.Issuer,
            Owner: bond.Owner,
            Pool: bond.Pool,
            AmountPaid: bond.AmountPaid,
            FaceValue: bond.FaceValue,
            MonthlyPayout: bond.MonthlyPayout,
            RemainingPayments: bond.RemainingPayments,
            CouponDates: bond.CouponDates,
            CouponsReceived: bond.CouponsReceived,
            Amount: amount,
            CanBeUsed: false,
            NotBefore: bond.NotBefore,
        };

        if(balance!==0){
            const key2=await ctx.stub.createCompositeKey('BondToken',[userID,genericID])
            typeID=':1';
            bondID=key2+typeID;
            const bond2={
                ID: bondID,
                GenericID: genericID,
                TypeID: typeID,
                Rating: bond.Rating,
                CouponRate: bond.CouponRate,
                MaturityDate: bond.MaturityDate,
                Issuer: bond.Issuer,
                Owner: userID,
                Pool: bond.Pool,
                AmountPaid: bond.AmountPaid,
                FaceValue: bond.OriginalValue,
                MonthlyPayout: bond.MonthlyPayout,
                RemainingPayments: bond.RemainingPayments,
                CouponDates: bond.CouponDates,
                CouponsReceived: bond.CouponsReceived,    
                Amount: balance,
                CanBeUsed: true,                
                NotBefore: bond.NotBefore,
            };
            await ctx.stub.deleteState(bond.ID);
            await ctx.stub.putState(bond1.ID,Buffer.from(JSON.stringify(bond1)));
            await ctx.stub.putState(bond2.ID,Buffer.from(JSON.stringify(bond2)));
        }else{
            await ctx.stub.deleteState(bond.ID);
            await ctx.stub.putState(bond1.ID,Buffer.from(JSON.stringify(bond1)));
        }
        return bond1.ID
    }

    // Auxiliary function to sort bid orders according to price, if they are limit or market orders and time they were
    // submitted
    async _sortingBidOrders(ctx, orderArray){
        console.log('inside _sortingBidOrders')
        // await orderArray.sort((a,b) => (a.MarketPrice && !a.FullMatch && !b.FullMatch && b.MarketPrice && a.Time<b.Time) ? 1 : (a.MarketPrice && !a.FullMatch && !b.FullMatch && b.MarketPrice && a.Time>b.Time)? -1: 0);
        // await orderArray.sort((b,a) => (a.Price > b.Price) ? 1 : ((b.Price > a.Price) ? -1 : (a.Time<b.Time) ? 1 : -1));
        // await orderArray.sort((a,b) => (!a.FullMatch && b.FullMatch) ? -1 :(!b.FullMatch && a.FullMatch ? -1 : 1));
        // return orderArray
        // await orderArray.sort((a,b) => (a.MarketPrice && b.MarketPrice && a.Time<b.Time) ? 1 : (a.MarketPrice && b.MarketPrice && a.Time>b.Time)? -1: 0);
        // await orderArray.sort((b,a) => (a.Price > b.Price) ? 1 : ((b.Price > a.Price) ? -1 : (b.Time>a.Time) ? 1 : -1));
        await orderArray.sort((b,a) => (a.Price > b.Price) ? -1 : ((b.Price > a.Price) ? 1 : (b.Time>a.Time) ? -1 : 1));

        // await orderArray.sort((a,b) => (!a.FullMatch && b.FullMatch) ? -1 :(!b.FullMatch && a.FullMatch ? -1 : 1));
        return orderArray.reverse()

    }

    // Auxiliary function to sort ask orders according to price, if they are limit or market orders and time they were
    // submitted
    async  _sortingAskOrders(ctx, orderArray){
        console.log('inside _sortingAskOrders')
        // await orderArray.sort((a,b) => (a.MarketPrice && !a.FullMatch && !b.FullMatch && b.MarketPrice && a.Time<b.Time) ? 1 : (a.MarketPrice && !a.FullMatch && !b.FullMatch && b.MarketPrice && a.Time>b.Time)? -1: 0);
        // await orderArray.sort((b,a) => (a.Price > b.Price) ? -1 : ((b.Price > a.Price) ? 1 : (b.Time>a.Time) ? 1 : -1));
        // await orderArray.sort((a,b) => (!a.FullMatch && b.FullMatch) ? -1 :(!b.FullMatch && a.FullMatch ? -1 : 1));
        // return orderArray
        // await orderArray.sort((a,b) => (a.MarketPrice && b.MarketPrice && a.Time<b.Time) ? 1 : (a.MarketPrice && b.MarketPrice && a.Time>b.Time)? -1: 0);
        await orderArray.sort((b,a) => (a.Price > b.Price) ? -1 : ((b.Price > a.Price) ? 1 : (b.Time>a.Time) ? 1 : -1));
        // await orderArray.sort((a,b) => (!a.FullMatch && b.FullMatch) ? -1 :(!b.FullMatch && a.FullMatch ? -1 : 1));
        return orderArray

    }

    // We must add last market price attribute to order book in order to establish e fair price if there are no asks 
    // or bids in the order book
    // 

    // Transference triggered due to an Ask Order
    async _transferCashTokens(ctx,bidInputs,askInput,orderBook){
        // let userID=await ctx.clientIdentity.getIDBytes();

        let bondTokenBytes=await ctx.stub.getState(askInput.TokenID);
        if(!bondTokenBytes || bondTokenBytes.length === 0){
            throw new Error('Bond Token does not exist')
        }
        
        let bondToken=JSON.parse(bondTokenBytes.toString());
        
        let usedKeys=[];
        let usedOwners=[];
        let usedAmounts=[];
        let notUsedTokensAmounts=[];
        let cashTokensToTransfer=[];
        let bondTokensToTransfer=[];
        let total=0;
        let bondsToTransfer=[];
        let amount=0;
        let token;
        let lastOwner;

        let transactionID=await ctx.stub.getTxID();
        
        let outputBondToken={
            ID: '',
            GenericID: transactionID,
            TypeID: ':0',
            Rating: bondToken.Rating,
            CouponRate: bondToken.CouponRate,
            MaturityDate: bondToken.MaturityDate,
            Issuer: bondToken.Issuer,
            Owner: bondToken.Owner,
            Pool: bondToken.Pool,
            AmountPaid: bondToken.AmountPaid,
            FaceValue: bondToken.FaceValue,
            MonthlyPayout: bondToken.MonthlyPayout,
            CouponDates: bondToken.CouponDates,
            CouponsReceived: bondToken.CouponsReceived,
            RemainingPayments: bondToken.RemainingPayments,
            Amount: bondToken.Amount,
            CanBeUsed: true, 
            NotBefore: bondToken.NotBefore
        }
    
        let asks=orderBook[1];
        let bids=orderBook[0];

        // console.log('step 5')
        console.log('--------------bidInputs-----------------')
        console.log(bidInputs)
        console.log('----------------------------------------')
        console.log('--------------askInput-----------------')
        console.log(askInput)
        console.log('----------------------------------------')
        let usedKey
        let lastBid
        let lastQuantity
        let lastRestingQuantity
        let lastQuantityMatch
        let partialMatched=[]

        let referencePrice;
        if (askInput.Price===''){
            referencePrice=bidInputs[0].Price;
        }else{
            referencePrice=bidInputs[0].Price
        }

        for (let i=0; i<bidInputs.length;i++){
            if(referencePrice>bidInputs[i].Price){
                referencePrice=bidInputs[i].Price;
            }
            let balance=0;
            console.log('inside first for loop')
            console.log(bidInputs[i]);
            let cashTokenID=bidInputs[i].TokenID;
            // console.log(cashTokenID)
            let quantityToTransfer=bidInputs[i].QuantityMatch;
            console.log(quantityToTransfer);
            if(usedKeys.indexOf(cashTokenID)!==-1){
                // console.log('step 5.1')
                throw new Error('Repeated cash token ID')
            }

            balance=bidInputs[i].Quantity-bidInputs[i].QuantityMatch
            if (balance===0){
                total+=quantityToTransfer*bidInputs[i].Price
            }else{
                total+=quantityToTransfer*bidInputs[i].Price 
            }
            //TODO
            //check errors
            
            let valueBytes=await ctx.stub.getState(cashTokenID);
            if (!valueBytes || valueBytes.length === 0){
                throw new Error(`state ${cashTokenID} does not exist`);
            }
            //TODO
            //check errors
             
            token=JSON.parse(valueBytes.toString());

            let cashTokenOwner=token.Owner;

            // console.log('cashtokenowner')
            // console.log(cashTokenOwner)
            // console.log('cashtoken amount')
            // console.log(quantityToTransfer*bidInputs[i].Price)
            // let tokensToTransfer=quantityToTransfer*bidInputs[i].Price
            // console.log('indice')
            // console.log(usedOwners.indexOf(cashTokenOwner))
            // console.log('token Owner')
            // console.log(cashTokenOwner)

            if (usedOwners.indexOf(cashTokenOwner)===-1){
                console.log('dentro del primer if')
                usedOwners.push(cashTokenOwner)
                // console.log(usedOwners)
                usedAmounts.push(quantityToTransfer);
                // console.log(usedAmounts)
                notUsedTokensAmounts.push(token.Amount);
                // cashTokensToTransfer.push(quantityToTransfer*askInput.Price);
                bondTokensToTransfer.push(quantityToTransfer);
                // console.log(`quantityToTransfer: ${quantityToTransfer}`)
                // bondsToTransfer.append(qu)
            }else{
                console.log('dentro del primer else')
                // console.log('usedOwners')
                // console.log(usedOwners)
                usedAmounts[usedOwners.indexOf(cashTokenOwner)]+=quantityToTransfer;
                notUsedTokensAmounts[usedOwners.indexOf(cashTokenOwner)]+=token.Amount;
                // cashTokensToTransfer[usedOwners.indexOf(cashTokenOwner)]+=quantityToTransfer*askInput.Price;
                bondTokensToTransfer[usedOwners.indexOf(cashTokenOwner)]+=quantityToTransfer;
            }

            amount+=bidInputs[i].Quantity*bidInputs[i].Price;

            let index;
            bids=orderBook[0];
            asks=orderBook[1];

            console.log('FullMatch')
            console.log(bidInputs[i].FullMatch)
            console.log('PartialMatch')
            console.log(bidInputs[i].PartialMatch)
            let thisTokenID=token.ID
            if (bidInputs[i].FullMatch){
                console.log('step 5.2')
                await ctx.stub.deleteState(token.ID)
                let myBid=await bids.filter(item=> item.ID!==bidInputs[i].ID);
                orderBook=[myBid,asks,[referencePrice]]
            }else{
                console.log('step 5.3')
                let myBid=await bids.filter(item=> item.ID===bidInputs[i].ID);
                // console.log(myBid)
                // index = bids.indexOf(myBid[0]);
                // console.log('Index')
                // console.log(index)
                lastOwner=token.Owner
                lastBid= myBid[0]
                lastQuantity=lastBid.Quantity-lastBid.QuantityMatch
                lastQuantityMatch=0
                lastRestingQuantity=lastBid.Quantity-lastBid.QuantityMatch
                partialMatched.push(lastBid)
                // New token ID

                // myBid[0].TokenID=token.ID;
                // myBid[0].RestingQuantity=myAsk[0].RestingQuantity-orders.QuantityMatch;
                usedKey=token.ID
                await ctx.stub.deleteState(token.ID);
                orderBook=[bids,asks,[referencePrice]]
                // console.log(`orderBook: ${orderBook}`)
            }
            // console.log('despues comprobar fullmatch')
            usedKeys.push(thisTokenID);
            // usedOwners.push(cashTokenOwner);

        }
        console.log('fuera del for')

        // console.log('usedOwners.length');
        // console.log(usedOwners.length);
        let bondAcumulator=0
        let outputBondTokenID
        for (let j=0;j<usedOwners.length;j++){
            // console.log(`creamos estados tipo bond tokens`)

            //TODO
            // check coupons received
            outputBondTokenID=await ctx.stub.createCompositeKey('BondToken',[usedOwners[j],outputBondToken.GenericID]);
            outputBondToken.ID=outputBondTokenID+':0'
            outputBondToken.Amount=usedAmounts[j];
            console.log(outputBondToken.Amount);
            outputBondToken.Owner=usedOwners[j];
            bondAcumulator+=outputBondToken.Amount;
            console.log('Bono')
            console.log(outputBondToken)
            let outputBondTokenBuffer= Buffer.from(JSON.stringify(outputBondToken))
            await ctx.stub.putState(outputBondToken.ID,outputBondTokenBuffer)
        }

        bids=orderBook[0];
        asks=orderBook[1];

        let submitterID=await ctx.GetUserIdentity('cif');

        console.log('fuera de los bonos')

        // console.log('creamos los estados de cash tokens');
        let thisID=await ctx.stub.createCompositeKey('securitizationCoin',[submitterID,transactionID])
        let securitizationCoin1={
            ID: thisID+':0',
            GenericID: transactionID,
            TypeID: ':0',
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: submitterID,
            Amount: total,
            Factor: 100,
            CanBeUsed: true
        }
        let valueBuffer1=Buffer.from(JSON.stringify(securitizationCoin1))
        let restingQuantity=amount-total;
        console.log('resting quantity')
        console.log(restingQuantity)
        // console.log('step 7')
        // console.log(lastOwner)
        if(restingQuantity!==0){
            console.log('step 8')
            thisID=await ctx.stub.createCompositeKey('securitizationCoin',[lastOwner,transactionID]);
            let securitizationCoin2={
                ID: thisID+':1',
                GenericID: transactionID,
                TypeID: ':1',
                Issuer: await ctx.clientIdentity.getIDBytes(),
                Owner: lastOwner,
                Amount: restingQuantity,
                Factor: 100,
                CanBeUsed: true
            }
            console.log('securitizationCoin2')
            console.log(securitizationCoin2)
            console.log('securitizationCoin1')
            console.log(securitizationCoin1)
            lastBid.TokenID=securitizationCoin2.ID;
            lastBid.QuantityMatch=lastQuantityMatch;
            lastBid.RestingQuantity=lastRestingQuantity;
            lastBid.Quantity=lastQuantity;
            lastBid.PartialMatch=false;
            console.log('---------LastBid----------')
            console.log(lastBid)
            let thisBid=await bids.filter(item=> item.ID===lastBid.ID)
            let indice=bids.indexOf(thisBid[0])
            bids[indice]=lastBid;
            orderBook=[bids,asks,[referencePrice]]
            let valueBuffer2=Buffer.from(JSON.stringify(securitizationCoin2));
            await ctx.stub.putState(securitizationCoin2.ID, valueBuffer2);
            await ctx.stub.putState(securitizationCoin1.ID,valueBuffer1);
        }else{
            orderBook=[bids,asks,[referencePrice]]

            // create just one state
            console.log('securitizationCoin1')
            console.log(securitizationCoin1)
            await ctx.stub.putState(securitizationCoin1.ID, valueBuffer1)
        }
        bids=orderBook[0];
        asks=orderBook[1];
        if ((askInput.Quantity-askInput.QuantityMatch)!==0 && !askInput.MarketPrice){
            thisID=await ctx.stub.createCompositeKey('BondToken',[submitterID,outputBondToken.GenericID])
            outputBondToken.ID=thisID+':1';
            outputBondToken.Amount=bondToken.Amount-bondAcumulator;
            outputBondToken.Owner=submitterID;
            let outputBondTokenBuffer= Buffer.from(JSON.stringify(outputBondToken))
            await ctx.stub.putState(outputBondToken.ID,outputBondTokenBuffer)
            let thisAsk=await asks.filter(item => item.ID===askInput.ID);
            let index=asks.indexOf(thisAsk[0]);
            thisAsk[0].Quantity=thisAsk[0].Quantity-thisAsk[0].QuantityMatch;
            thisAsk[0].QuantityMatch=0;
            thisAsk[0].RestingQuantity=thisAsk[0].Quantity;
            thisAsk[0].TokenID=outputBondToken.ID;
            thisAsk[0].PartialMatch=false;       
            asks[index]=thisAsk[0];
            orderBook=[bids,asks,[referencePrice]]
            await ctx.stub.deleteState(bondToken.ID)
        }else if ((askInput.Quantity-askInput.QuantityMatch)===0 && !askInput.MarketPrice){
            let thisAsk=await asks.filter(item => item.ID!==askInput.ID)
            orderBook=[bids,thisAsk,[referencePrice]]
        }else{
            orderBook=[bids,asks,[referencePrice]]
        }


        // asks=await this._sortingAskOrders(ctx,orderBook[1]);
        // bids=await this._sortingBidOrders(ctx,orderBook[0]);

        // orderBook=[bids,asks,[referencePrice]]

        // console.log(orderBook)
        // let orderBuffer=Buffer.from(JSON.stringify(orderBook));
        // await ctx.stub.putState('OrderBook',orderBuffer);
        return orderBook
    }

    async TransferCoupons(ctx, bondTokenID,TypeID, spvID){
        let userID=await ctx.GetUserIdentity('cif');
        let bondTokenKey=await ctx.stub.createCompositeKey('BondToken',[userID,bondTokenID]);
        let key=bondTokenKey+TypeID;
        let bondTokenBytes=await ctx.stub.getState(key);
        if (!bondTokenBytes || bondTokenBytes.length === 0){
            throw new Error('There is no state associated to that key');
        }
        let bondToken=JSON.parse(bondTokenBytes.toString());
        let thisDate=await ctx.stub.getDateTimestamp();
        let argThisDate=new Date(thisDate)
        let compareDate=new Date(bondToken.NotBefore)

        if (argThisDate.getTime()<compareDate.getTime()){
            throw new Error('Error, you cannot still withdraw any coupons')
        }
        if (!bondToken.CanBeUsed){
            throw new Error(`Bond token cannot be used`)
        }
        let bondsAmount=bondToken.Amount;

        //These are attributes within bondToken state
        let resultKeys=[];
        let total=0
        let amount;
        let lastCashAmount;
        let cashDifference;
        let new_value

        let myCoupons=parseInt((bondToken.Amount*bondToken.MonthlyPayout)*100);
        let iterator= ctx.stub.getStateByPartialCompositeKey("securitizationCoin",[spvID]);

        for await (const res of iterator) {
            new_value = JSON.parse(res.value.toString());
            amount=new_value.Amount;
            if (new_value.CanBeUsed && new_value.Owner===spvID){
                resultKeys.push(new_value.ID);
                total+=amount
                if (total<myCoupons){
                    await ctx.stub.deleteState(res.key);
                    continue
                }else{
                    lastCashAmount=new_value.Amount;
                    cashDifference=total-myCoupons;
                    break
                }
            }else{
                continue
            }

        }

        if(total<myCoupons){
            throw new Error('There are not enough funds');
        }

        let genericID=await ctx.stub.getTxID();
        let typeID=':1';
        let keyToBurn=new_value.ID;
        let referenceValue=new_value;
        if (cashDifference!==0){
            //create 
            typeID=':1'
            new_value.Amount=cashDifference;
            new_value.ID=await ctx.stub.createCompositeKey('securitizationCoin',[new_value.Owner,genericID,typeID])
            new_value.TypeID=typeID;
            new_value.GenericID=genericID;
            let valueBuffer=Buffer.from(JSON.stringify(new_value));
            await ctx.stub.putState(new_value.ID,valueBuffer)
            typeID=':0'
            referenceValue.Amount=total;
            referenceValue.ID=await ctx.stub.createCompositeKey('securitizationCoin',[bondToken.Owner,genericID,typeID])
            referenceValue.TypeID=typeID;
            referenceValue.GenericID=genericID;
            let referenceValueBuffer=Buffer.from(JSON.stringify(referenceValue));
            await ctx.stub.putState(referenceValue.ID,referenceValueBuffer);
            await ctx.stub.deleteState(keyToBurn)
        }else{
            new_value.Amount=total;
            new_value.TypeID=':0';
            new_value.GenericID=genericID;
            new_value.Owner=await ctx.clientIdentity.getIDBytes();
            new_value.ID=await ctx.stub.createCompositeKey('securitizationCoin',[new_value.Owner,genericID,new_value.TypeID])
            
        }
        typeID=':0'
        let newBondToken=bondToken;
        newBondToken.GenericID=genericID;
        newBondToken.ID=await ctx.stub.createCompositeKey('BondToken',[bondToken.Owner,genericID,typeID])
        newBondToken.CouponsReceived=bondToken.CouponsReceived+1;
        newBondToken.RemainingPayments=bondToken.RemainingPayments-1;

        newBondToken.NotBefore=bondToken.CouponDates[newBondToken.CouponsReceived]
        
        let newBondTokenBuffer= Buffer.from(JSON.stringify(newBondToken));
        await ctx.stub.putState(newBondToken.ID, newBondTokenBuffer);
        await ctx.stub.deleteState(bondTokenID);
        return newBondToken
    }


    //Transference triggered due to a Bid Order
    async _transferBondTokens(ctx,askInputs,bidInput, orderBook){
        // console
        // console.log('Inside _transferBondTokens')

        console.log('-----------------askInputs-------------------')
        console.log(askInputs)
        console.log('---------------------------------------------')
        console.log('-----------------bidInput-------------------')
        console.log(bidInput)
        console.log('---------------------------------------------')
        // I retrieve cash token
        let securitizationCoinBytes=await ctx.stub.getState(bidInput.TokenID);
        console.log('1')
        if(!securitizationCoinBytes || securitizationCoinBytes.length === 0){
            throw new Error(`There is no state associated to key ${bidInput.TokenID}`);
        }
        let securitizationCoin=JSON.parse(securitizationCoinBytes.toString());
        console.log(securitizationCoin)
        console.log('2')
        // let myFunds=securitizationCoin.Amount;
        // console.log(`myFunds: ${myFunds}`)
        //translate into nodejs utxo sample code 
        let userID=await ctx.GetUserIdentity('cif');
        let usedKeys=[];
        let usedKey, lastOwner;
        let usedOwners=[];
        let usedAmounts=[];
        let notUsedTokensAmounts=[];
        let cashTokensToTransfer=[];
        let total=0;
        let bondsToTransfer=[];
        let amount=0;
        let token;
        // let coupons;
        // check all bonds are equal (same coupons)
        let transactionID=await ctx.stub.getTxID();
        console.log('3')

        let outputSecuritizationCoin={
            ID: '',
            GenericID: transactionID,
            TypeID: ':0',
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: '',
            Amount: '',
            Factor: 100,
            CanBeUsed: true
        }
        let asks=orderBook[1];
        let bids=orderBook[0];

        let lastAsk;
        let lastAskQuantity;
        let lastAskQuantityMatch;
        let lastAskRestingQuantity
        let partialMatched=[]

        let referencePrice;
        if(bidInput.Price===''){
            referencePrice=askInputs[0].Price;
        }else{  
            referencePrice=askInputs[0].Price
        }
        console.log('4')
        let valueBytes;
        for (let i=0; i<askInputs.length;i++){
            if (referencePrice<askInputs[i].Price){
                referencePrice=askInputs[i].Price;
            }
            // console.log('inside first loop')
            // console.log(askInputs[i])
            // console.log('iteracion numero')
            // console.log(i)
            let balance=0;
            let bondID=askInputs[i].TokenID;
            // console.log(bondID)
            let quantityToTransfer=askInputs[i].QuantityMatch;
            // console.log(quantityToTransfer)
            if(usedKeys.indexOf(bondID)!==-1){
                throw new Error(`Bond state with key ${bondID} cannot be spent twice`)
            }
            // let utxoInputCompositeKey=await ctx.stub.createCompositeKey('securitizationCoin', [userID, utxoInputKeys[i]]);
            //TODO
            //check errors
            console.log('bondID')
            console.log(bondID)
            valueBytes=await ctx.stub.getState(bondID);
            if (!valueBytes || valueBytes.length === 0){
                throw new Error(`No Bond State`)
            }
            //TODO
            //check errors
            balance=askInputs[i].Quantity-askInputs[i].QuantityMatch
            if (balance===0){
                total+=quantityToTransfer
            }else{
                total+=askInputs[i].Quantity 
            }
            console.log('balance')
            console.log(balance)

            token=JSON.parse(valueBytes.toString());
            console.log('token')
            console.log(token)
            let bondOwner=token.Owner;
            // console.log('bondOwner');
            // console.log(bondOwner);
            // console.log('indice')
            // console.log(usedOwners.indexOf(bondOwner));
            if (usedOwners.indexOf(bondOwner)===-1){
                // console.log('dentro del primer if')
                usedOwners.push(bondOwner);
                // console.log(usedOwners)
                usedAmounts.push(quantityToTransfer*askInputs[i].Price);
                notUsedTokensAmounts.push(token.Amount);
                cashTokensToTransfer.push(quantityToTransfer*askInputs[i].Price);
                //console.log(`quantityToTransfer: ${quantityToTransfer}`)
                // bondsToTransfer.append(qu)
            }else{
                // console.log('dentro del primer else')
                // console.log('usedOwners')
                // console.log(usedOwners)
                usedAmounts[usedOwners.indexOf(bondOwner)]+=quantityToTransfer*askInputs[i].Price;
                notUsedTokensAmounts[usedOwners.indexOf(bondOwner)]+=token.Amount;
                cashTokensToTransfer[usedOwners.indexOf(bondOwner)]+=quantityToTransfer*askInputs[i].Price;
            }


            amount+=quantityToTransfer;
            // total+=token.Amount;
            // //revisar
            // if(token.Amount<quantityToTransfer){
            //     throw new Error('Error')
            // }
            bids=orderBook[0];
            asks=orderBook[1];
            let thisTokenID=token.ID
            if (askInputs[i].FullMatch){
                await ctx.stub.deleteState(token.ID)
                let myAsk=await asks.filter(item=> item.ID!==askInputs[i].ID);
                orderBook=[bids,myAsk,[referencePrice]]
                //console.log(`orderBook: ${orderBook}`)
            }else{
                let myAsk=await asks.filter(item=> item.ID===askInputs[i].ID);

                // index = asks.indexOf(myAsk[0]);
                lastOwner=token.Owner
                // console.log('lastOwner')
                // console.log(lastOwner)
                lastAsk=myAsk[0];
                lastAskQuantity=lastAsk.Quantity-lastAsk.QuantityMatch;
                lastAskQuantityMatch=0;
                lastAskRestingQuantity=lastAsk.Quantity-lastAsk.QuantityMatch;
                partialMatched.push(lastAsk)
                // New token ID
 
                // myBid[0].TokenID=token.ID;
                // myBid[0].RestingQuantity=myAsk[0].RestingQuantity-orders.QuantityMatch;
                usedKey=token.ID
                await ctx.stub.deleteState(token.ID);
                orderBook=[bids,asks,[referencePrice]]

                // myAsk[0].TokenID=token.ID;
                // myAsk[0].RestingQuantity=myAsk[0].RestingQuantity-orders.QuantityMatch;
                // await ctx.stub.deleteState(token.ID);
                //console.log(`orderBook: ${orderBook}`)
            }
            console.log('thisTokenID')
            console.log(thisTokenID)
            usedKeys.push(thisTokenID);
        }
        console.log('5')

        let cashAcumulator=0
        for (let j=0;j<usedOwners.length;j++){
            // console.log('creamos estados tipo cash tokens')
            //console.log(`creamos estados tipo cash tokens`)

            //TODO
            // check coupons received
            let outputSecuritizationCoinID=await ctx.stub.createCompositeKey('securitizationCoin',[usedOwners[j],outputSecuritizationCoin.GenericID]);
            outputSecuritizationCoin.ID=outputSecuritizationCoinID+':0'
            outputSecuritizationCoin.Amount=usedAmounts[j];
        
            outputSecuritizationCoin.Owner=usedOwners[j];
            
            console.log(outputSecuritizationCoin.Amount)
        
            let outputSecuritizationCoinBuffer= Buffer.from(JSON.stringify(outputSecuritizationCoin))
            await ctx.stub.putState(outputSecuritizationCoin.ID,outputSecuritizationCoinBuffer)
            cashAcumulator+=outputSecuritizationCoin.Amount;
        }

        console.log('6')

        // console.log('creamos estados bond Tokens')

        bids=orderBook[0];
        asks=orderBook[1];
        // let invokerCert=await ctx.clientIdentity.getID();
        let thiskey=await ctx.stub.createCompositeKey('BondToken',[userID,transactionID])
        let bondToken1={
            ID: thiskey+':0',
            GenericID: transactionID,
            TypeID: ':0',
            Rating: token.Rating,
            CouponRate: token.CouponRate,
            MaturityDate: token.MaturityDate,
            Issuer: await ctx.clientIdentity.getIDBytes(),
            Owner: userID,
            Pool: token.Pool,
            AmountPaid: token.AmountPaid,
            FaceValue: token.FaceValue,
            MonthlyPayout: token.MonthlyPayout,
            RemainingPayments: token.RemainingPayments,
            CouponDates: token.CouponDates,
            NotBefore: token.NotBefore,
            CouponsReceived: token.CouponsReceived,
            Amount: amount,
            CanBeUsed: true
        }
        console.log('7')
        let valueBuffer1=Buffer.from(JSON.stringify(bondToken1))
        let restingQuantity=total-amount;
        // console.log('resting quantity')
        // console.log(restingQuantity);
        // console.log('step 7')

        if(restingQuantity!==0){
            // console.log('step 8')
            //console.log(`dentro del tercer if`)
            thiskey=await ctx.stub.createCompositeKey('BondToken',[lastOwner,transactionID])
            let bondToken2={
                ID: thiskey+':1',
                GenericID: transactionID,
                TypeID: ':1',
                Rating: token.Rating,
                CouponRate: token.CouponRate,
                MaturityDate: token.MaturityDate,
                Issuer: await ctx.clientIdentity.getIDBytes(),
                Owner: lastOwner,
                Pool: token.Pool,
                AmountPaid: token.AmountPaid,
                FaceValue: token.FaceValue,
                MonthlyPayout: token.MonthlyPayout,
                RemainingPayments: token.RemainingPayments,
                Amount: restingQuantity,
                CanBeUsed: true,
                CouponDates: token.CouponDates,
                NotBefore: token.NotBefore,
                CouponsReceived: token.CouponsReceived,
            }
            console.log('bondToken2');
            console.log(bondToken2)
            console.log('bondToken1')
            console.log(bondToken1)

            lastAsk.TokenID=bondToken2.ID;
            lastAsk.QuantityMatch=lastAskQuantityMatch;
            lastAsk.RestingQuantity=lastAskRestingQuantity;
            lastAsk.Quantity=lastAskQuantity;
            lastAsk.PartialMatch=false;
            let thisAsk=await asks.filter(item=> item.ID===lastAsk.ID)
            let indice=asks.indexOf(thisAsk[0])
            asks[indice]=lastAsk;
            orderBook=[bids,asks,[referencePrice]]

            let valueBuffer2=Buffer.from(JSON.stringify(bondToken2));
            await ctx.stub.putState(bondToken2.ID, valueBuffer2);
            await ctx.stub.putState(bondToken1.ID,valueBuffer1);
        }else{
            orderBook=[bids,asks,[referencePrice]]

            console.log('bondToken1')
            console.log(bondToken1)
            //console.log(`dentro del tercer else`)
            // create just one state
            await ctx.stub.putState(bondToken1.ID, valueBuffer1)
        }
        console.log('8')
        bids=orderBook[0];
        asks=orderBook[1];

        if ((bidInput.Quantity-bidInput.QuantityMatch)!==0 && !bidInput.MarketPrice){
            thiskey=await ctx.stub.createCompositeKey('securitizationCoin',[userID,outputSecuritizationCoin.GenericID])
            outputSecuritizationCoin.ID=thiskey+':1';
            outputSecuritizationCoin.Amount=securitizationCoin.Amount-cashAcumulator;
            outputSecuritizationCoin.Owner=userID;
            let outputSecuritizationCoinBuffer= Buffer.from(JSON.stringify(outputSecuritizationCoin))
            await ctx.stub.putState(outputSecuritizationCoin.ID,outputSecuritizationCoinBuffer)
            let thisBid=await bids.filter(item => item.ID===bidInput.ID);
            let index=bids.indexOf(thisBid[0]);
            thisBid[0].Quantity=thisBid[0].Quantity-thisBid[0].QuantityMatch;
            thisBid[0].QuantityMatch=0;
            thisBid[0].TokenID=outputSecuritizationCoin.ID;       
            thisBid[0].PartialMatch=false;
            thisBid[0].RestingQuantity=thisBid[0].Quantity
            bids[index]=thisBid[0];
            orderBook=[bids,asks,[referencePrice]]
            await ctx.stub.deleteState(token.ID)
        }else if ((bidInput.Quantity-bidInput.QuantityMatch)===0 && !bidInput.MarketPrice){
            let thisBid=await bids.filter(item => item.ID!==bidInput.ID)
            orderBook=[thisBid,asks,[referencePrice]]
        }else{
            orderBook=[bids,asks,[referencePrice]]
        }
        console.log('10')
        // asks=await this._sortingAskOrders(ctx,orderBook[1]);
        // bids=await this._sortingBidOrders(ctx,orderBook[0]);
        // orderBook=[bids,asks,orderBook[2]]

        let orderBuffer=Buffer.from(JSON.stringify(orderBook));
        await ctx.stub.putState('OrderBook',orderBuffer);
        return orderBook
    }

    // Bid order will be executed by someone whose desire is buying bonds.
    async BidOrder(ctx, amount, price,tokenID,identificativo){
        console.log('paso 1')
        // first we check the format of price
        await this._checkDecimals(price);
        price=parseFloat(price);
        price=parseInt(price*100);

        const userID= await ctx.GetUserIdentity('cif');
        

        // retrieve order book if it exists
        const bookOrderBytes=await ctx.stub.getState('OrderBook');
        let bookOrder;
        if (!bookOrderBytes || bookOrderBytes.length === 0){
            bookOrder=[[],[],[]];
        }else{
            bookOrder=JSON.parse(bookOrderBytes.toString());
        }

        // retrieve token we are going to use to pay for
        let myKey=await ctx.stub.createCompositeKey('securitizationCoin',[userID,tokenID]);
        myKey=myKey+identificativo;
        const tokenBytes=await ctx.stub.getState(myKey);

        console.log('paso 2')
        // prior verifications are also inside auxiliary function
        if (!tokenBytes || tokenBytes.length === 0){
            throw new Error(`Error, Token State according to key ${tokenID} does not exist`);
        }
        const token= JSON.parse(tokenBytes.toString());
        if (!token.CanBeUsed){
            throw new Error(`This Token State with ID ${tokenID} has already been used. Try another Token ID`);
        }
        const genericID=await ctx.stub.getTxID();
        const orderID=await ctx.stub.createCompositeKey('BidOrder',[genericID]);

        // compute how many tokens we will withdraw from our Token State
        const total=amount*price;

        let date=await ctx.stub.getDateTimestamp();
        let currentOrder={
            ID: orderID,
            Quantity: parseInt(amount),
            Price: price,
            TokenID: token.ID,
            FullMatch: false,
            MarketPrice: false,
            PartialMatch: false,
            QuantityMatch: 0,
            RestingQuantity: parseInt(amount),
            Name: 'Bid',
            Time: new Date(date).getTime()
        }

        let asks=bookOrder[1];
        let bids=bookOrder[0];
        //console.log(asks)
        console.log('paso 3')
        // If there  is no asks it means we cannot match our bid order
        if ( asks.length===0){
            console.log('paso 3.1')
            let newID=await this._splitMoney(ctx,token.ID,total);
            const order={
                ID: orderID,
                Quantity: parseInt(amount),
                Price: price,
                TokenID: newID,
                Name: 'Bid',
                FullMatch: false,
                MarketPrice: false,
                PartialMatch: false,
                QuantityMatch: 0,
                RestingQuantity: parseInt(amount),
                Time: new Date(date).getTime()
            };
            bookOrder[0].push(order);

            const book=await this._sortingBidOrders(ctx,bookOrder[0]);
            bookOrder=[book,bookOrder[1],bookOrder[2]];
            await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)));
            return bookOrder
        }

        console.log('paso 4')

        let bidReference=currentOrder;

        let bondKeyAcumulator=[];
        let tokenAcumulator=[];
        let counter=bidReference.Quantity;
        let balance=0;
        let totalTokens=0;
        let tokensCounter=token.Amount;
        let balanceTokens=0;
        let myTokens=0
        console.log('paso 5')
        // console.log(bidReference.Price)
        // check if there is matching
        for await (const ask of asks) {
            console.log('controlando el break')
            console.log(ask.Price);
            if (ask.Price<=bidReference.Price && !ask.FullMatch && myTokens<bidReference.Quantity ){
                console.log('paso 5.1')
                counter=counter-ask.Quantity;
                balance=ask.Quantity+counter;
                tokensCounter=tokensCounter-(ask.Quantity*ask.Price);
                balanceTokens=(ask.Quantity*ask.Price)+tokensCounter;
                // FULL MATCH means that our submitted order with that size has been completed
                if (counter>=0){
                    console.log('paso 5.1.2.1')
                    // FULL MATCH
                    ask.QuantityMatch=ask.Quantity;
                    ask.FullMatch=true;
                    ask.PartialMatch=false;
                    tokenAcumulator.push(ask);
                    bondKeyAcumulator.push(ask.TokenID);
                    totalTokens=totalTokens+(ask.Price*ask.QuantityMatch);
                    myTokens+=ask.Quantity
                }else{ 
                    console.log('paso 5.1.2.2')
                    // PARTIAL MATCH means that our submitted order with that size has been completed partially
                    // PARTIAL MATCH
                    ask.FullMatch=false;
                    ask.PartialMatch=true;
                    ask.QuantityMatch=balance;
                    bondKeyAcumulator.push(ask.TokenID);
                    tokenAcumulator.push(ask);
                    totalTokens=totalTokens+(ask.Price*ask.QuantityMatch);
                    myTokens+=balance
                    // And finally break, because we read following a prestablished order
                }
            }else{
                continue
            }
        }
        console.log('paso 6')
        bookOrder=[bookOrder[0],asks,bookOrder[2]]
        // now we upload our order and the matching state
        console.log(myTokens)
        console.log(bidReference.Quantity)
        let newID
        if (myTokens===bidReference.Quantity){
            console.log('paso 7.1')
            // Full Match
            // currentOrder.ID=orderID
            currentOrder.TokenID=token.ID;
            currentOrder.FullMatch=true;
            currentOrder.PartialMatch= false;
            currentOrder.QuantityMatch=currentOrder.Quantity;
            // currentOrder.MatchID=bidReference.MatchID;
        }else if(myTokens<bidReference.Quantity && myTokens!==0){
            console.log('paso 7.2')
           // Partial Match
            // currentOrder.ID=orderID
            currentOrder.TokenID=token.ID;
            currentOrder.FullMatch=false;
            currentOrder.PartialMatch= true;
            currentOrder.QuantityMatch=myTokens;
            console.log('final')
            // currentOrder.Quantity=counter;
            // currentOrder.MatchID=bidReference.MatchID;
        }else{
            console.log('paso 7.3')
            // No match
            // currentOrder.ID=orderID
            newID=await this._splitMoney(ctx,token.ID,total);
            currentOrder.TokenID=newID;
            currentOrder.FullMatch=false;
            currentOrder.PartialMatch=false;
        }
        bookOrder[0].push(currentOrder);
        //console.log(bookOrder);


        console.log('paso 8')
        //console.log(bookOrder)
        // Finally we submit order book and matching state
        console.log('match')
        console.log(tokenAcumulator)
        console.log(currentOrder)
        if (bondKeyAcumulator.length>0){
            //console.log('paso 8.1')
            const orderMatch={
                Orders: tokenAcumulator,
                Order: currentOrder,
            }
            // let orderBuffer=Buffer.from(JSON.stringify(orderMatch));
            // await ctx.stub.putState('OrderMatch'+genericID, orderBuffer);
            // transference triggered
            // cash tokens goes from bid uploader to bond owners and bonds
            // goes to bid order uploader

            // let ITransferCashTokenID=currentOrder.TokenID;
            bookOrder=await this._transferBondTokens(ctx,orderMatch.Orders,orderMatch.Order,bookOrder)
            //console.log(orderMatch)
            //console.log(orderMatch.Orders)
            //console.log(orderMatch.Order)
        }else{
            const bookBid=await this._sortingBidOrders(ctx,bookOrder[0]);
            const bookAsk=await this._sortingAskOrders(ctx,bookOrder[1])
            bookOrder=[bookBid,bookAsk,bookOrder[2]];
        }
        await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)));
        await ctx.SetEventName('OrderBook');
        await ctx.SetEventPayload(Buffer.from(JSON.stringify(bookOrder)));

        console.log('paso 9')
        return bookOrder

    }

    // We must add last market price attribute to order book in order to establish e fair price if there are no asks 
    // or bids in the order book
    // AskOrder  will be executed by someone able to sell assets at a limit price
    async AskOrder(ctx,amount,price,bondID,identificativo){
        // console.log('paso 1')
        await this._checkDecimals(price);
        // const userID=await ctx.GetUserIdentity('cif');
        const userID=await ctx.GetUserIdentity('cif')
        amount=parseInt(amount);
        price=parseFloat(price);
        price=parseInt(price*100);
        let myKey=await ctx.stub.createCompositeKey('BondToken',[userID,bondID]);
        console.log('myKey')
        console.log(myKey)
        myKey=myKey+identificativo
        console.log('myKey')
        console.log(myKey)
        const bondBytes=await ctx.stub.getState(myKey);

        // These prior verifications are also inside auxiliary function
        if (!bondBytes || bondBytes.length === 0){
            throw new Error(`Error, Bond State with ID ${bondID} does not exist`);
        }
        const bond=JSON.parse(bondBytes.toString());
        if (!bond.CanBeUsed){
            throw new Error(`This Bond State with ID ${bondID} has already been used. Try another Bond ID`);
        }
        // console.log(bond.Amount)
        // console.log(amount)
        if (bond.Amount<amount){
            throw new Error(`Bond Token amount not enough.`);
        }
        const bookOrderBytes=await ctx.stub.getState('OrderBook');
        let bookOrder;
        if (!bookOrderBytes || bookOrderBytes.length === 0){
            bookOrder=[[],[],[]];
        }else{
            bookOrder=JSON.parse(bookOrderBytes.toString());
        }

        let date=await ctx.stub.getDateTimestamp();
        // console.log('paso 2')
        const genericID=await ctx.stub.getTxID();
        const orderID=await ctx.stub.createCompositeKey('AskOrder',[genericID]);
        let currentOrder={
            ID: orderID,
            Quantity: parseInt(amount),
            Price: price,
            TokenID: bond.ID,
            FullMatch: false,
            MarketPrice: false,
            PartialMatch: false,
            QuantityMatch: 0,
            RestingQuantity: parseInt(amount),
            Name: 'Ask',
            Time: new Date(date).getTime()
        };

        let asks=bookOrder[1];
        let bids=bookOrder[0];

        // console.log('paso 3')
        // If there is no bids it means we cannot match our ask order so we just submit it
        if (bids.length===0){
            // console.log('paso 3.1')
            let newID=await this._splitBonds(ctx,bond.ID,amount);
            //console.log(newID)
            const order={
                ID: orderID,
                Quantity: parseInt(amount),
                Price: price,
                TokenID: newID,
                FullMatch: false,
                MarketPrice: false,
                PartialMatch: false,
                QuantityMatch: 0,
                RestingQuantity: parseInt(amount),
                Name: 'Ask',
                Time: new Date(date).getTime()
            };
            //console.log(order);
            bookOrder[1].push(order);

            let book=await this._sortingAskOrders(ctx,bookOrder[1]);
            //console.log(book)
            bookOrder=[bookOrder[0],book,bookOrder[2]];
            await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)));
            // //console.log(ret)
            return bookOrder
        }

        // console.log('paso 4')
        const askReference=currentOrder;
        let tokenKeyAcumulator=[];
        let tokenAcumulator=[];
        let tokenQuantitiesAcumulator=[];
        let counter=askReference.Quantity;
        let totalTokens=0;
        let balance=0;
        let myTokens=0;
        // Check if our order can be matched
        for await (const bid of bids) {
            if (bid.Price>=askReference.Price && !bid.FullMatch && myTokens<askReference.Quantity){
                // console.log('paso 4.1')
                counter=counter-bid.Quantity;
                balance=bid.Quantity+counter;
                if (counter>=0 ){
                    // console.log('paso 4.1.1')
                    bid.FullMatch=true;
                    bid.PartialMatch=false;
                    bid.QuantityMatch=bid.Quantity;
                    tokenKeyAcumulator.push(bid.ID);
                    tokenAcumulator.push(bid);
                    tokenQuantitiesAcumulator.push(bid.Quantity);
                    totalTokens=totalTokens+(bid.Price*bid.QuantityMatch);
                    myTokens+=bid.Quantity
                } else{
                    // console.log('paso 4.1.2')
                    bid.FullMatch=false;
                    bid.PartialMatch=true;
                    bid.QuantityMatch=balance;
                    // bid.Quantity=bid.Quantity-balance;
                    tokenKeyAcumulator.push(bid.ID);
                    tokenAcumulator.push(bid);
                    tokenQuantitiesAcumulator.push(counter+bid.Quantity);
                    totalTokens=totalTokens+(bid.Price*bid.QuantityMatch);
                    myTokens+=balance
                }
            }else{
                // console.log('paso 4.2')
                continue
            }
        }
        bookOrder=[bids,bookOrder[1],bookOrder[2]]

        let newID
        // console.log('paso 5')
        // console.log(myTokens)
        // console.log(askReference.Quantity)

        // According to what matching situation we are, differents orders will be submitted
        if (myTokens===askReference.Quantity){
            // console.log('paso 5.1')
            // Full Match
            currentOrder.TokenID=bond.ID;
            currentOrder.FullMatch=true;
            currentOrder.PartialMatch= false;
            currentOrder.QuantityMatch=currentOrder.Quantity;
        }else if(myTokens<askReference.Quantity && myTokens!==0 ){
            // Partial Match
            // console.log('paso 5.2')
            currentOrder.TokenID=bond.ID;
            currentOrder.FullMatch=false;
            currentOrder.PartialMatch= true;
            currentOrder.QuantityMatch=myTokens;
        }else{
            // No match
            newID=await this._splitBonds(ctx,bond.ID,amount);
            // console.log('paso 5.3')
            currentOrder.TokenID=newID;
            currentOrder.FullMatch=false;
            currentOrder.PartialMatch= false;
        }
        bookOrder[1].push(currentOrder);
        // console.log('funciona ok')

        //No necesariamente tiene que estar ordenado

        // // Sort order book according to prior rules
        // let bookAsk=await this._sortingAskOrders(ctx,bookOrder[1]);
        // let bookBid=await this._sortingBidOrders(ctx,bookOrder[0]);
        // bookOrder=[bookBid,bookAsk];
        // console.log('paso 6')

        if (tokenKeyAcumulator.length>0){
            console.log('Hay match')
            const orderMatch={
                Orders: tokenAcumulator,
                Order: currentOrder,
            }            
            bookOrder=await this._transferCashTokens(ctx,orderMatch.Orders,orderMatch.Order,bookOrder)
        }else{
            asks=await this._sortingAskOrders(ctx,bookOrder[1]);
            bids=await this._sortingBidOrders(ctx,bookOrder[0])
            bookOrder=[bids,asks,bookOrder[2]]
        }
        await ctx.SetEventName('OrderBook');
        await ctx.SetEventPayload(Buffer.from(JSON.stringify(bookOrder)));
        await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)));
        // console.log('paso 7')
        // console.log(bookOrder)
        return bookOrder
    }

    // We must add last market price attribute to order book in order to establish e fair price if there are no asks 
    // or bids in the order book
    // AskMarketOrder will be executed by someone whose desire is selling bonds at market price.
    async AskMarketOrder(ctx,amount,bondID,identificativo){
        amount=parseInt(amount);
        if (amount<=0){
            throw new Error(`Amount argument must be positive`);
        }
        const userID= await ctx.GetUserIdentity('cif');

        let myKey=await ctx.stub.createCompositeKey('BondToken',[userID,bondID]);
        myKey=myKey+identificativo
        const bondBytes=await ctx.stub.getState(myKey);
        if (!bondBytes || bondBytes.length === 0){
            throw new Error(`Error, Bond State with key ${bondID} does not exist`);
        }

        // These prior verifications are also inside auxiliary function.
        const bond=JSON.parse(bondBytes.toString());
        if (!bond.CanBeUsed){
            throw new Error(`This Bond State with ID ${bondID} has already been used. Try another bond ID`);
        }
        if (bond.Amount<amount){
            throw new Error(`Your token has not enough funds`);
        }
        // retrieve order book if it exists
        const bookOrderBytes=await ctx.stub.getState('OrderBook');
        let bookOrder;
        if (!bookOrderBytes || bookOrderBytes.length === 0){
            throw new Error(`Order Book still not submitted`)
        }else{
            bookOrder=JSON.parse(bookOrderBytes.toString());
        }

        const genericID=await ctx.stub.getTxID();

        let date=await ctx.stub.getDateTimestamp();

        const orderID=await ctx.stub.createCompositeKey('AskOrder',[genericID]);
        let currentOrder={
            ID: orderID,
            Quantity: amount,
            Price: '',
            MarketPrice: true,
            TokenID: bond.ID,
            FullMatch: false,
            PartialMatch: false,
            QuantityMatch: 0,
            RestingQuantity: amount,
            Name: 'Ask',
            Time: new Date(date).getTime()
        };

        let asks=bookOrder[1];
        let bids=bookOrder[0];
        
        // If there is no bids it means we cannot match our ask order

        if (bids.length===0){
            // For sake of simplicity if there are no asks you cannot submit
            // a market order
            throw new Error(`There are no bids submitted.`)
        }

        const askReference=currentOrder;
        let tokenKeyAcumulator=[];
        let tokenAcumulator=[];
        let tokenQuantitiesAcumulator=[];
        let counter=askReference.Quantity;
        let totalTokens=0;
        let balance=0;
        // Check if there is matching
        let myTokens=0
        for await (const bid of bids) {
            if (!bid.FullMatch && myTokens<askReference.Quantity){
                // console.log('paso 4.1')
                counter=counter-bid.Quantity;
                balance=bid.Quantity+counter;
                if (counter>=0 ){
                    // console.log('paso 4.1.1')
                    bid.FullMatch=true;
                    bid.PartialMatch=false;
                    bid.QuantityMatch=bid.Quantity;
                    tokenKeyAcumulator.push(bid.ID);
                    tokenAcumulator.push(bid);
                    tokenQuantitiesAcumulator.push(bid.Quantity);
                    totalTokens=totalTokens+(bid.Price*bid.QuantityMatch);
                    myTokens+=bid.Quantity
                } else{
                    // console.log('paso 4.1.2')
                    bid.FullMatch=false;
                    bid.PartialMatch=true;
                    bid.QuantityMatch=balance;
                    // bid.Quantity=bid.Quantity-balance;
                    tokenKeyAcumulator.push(bid.ID);
                    tokenAcumulator.push(bid);
                    tokenQuantitiesAcumulator.push(counter+bid.Quantity);
                    totalTokens=totalTokens+(bid.Price*bid.QuantityMatch);
                    myTokens+=balance
                }
            }else{
                // console.log('paso 4.2')
                continue
            }
        }
        
        bookOrder=[bids,bookOrder[1],bookOrder[2]]

        currentOrder.TokenID=bond.ID;
        currentOrder.FullMatch=true;
        currentOrder.PartialMatch= false;
        currentOrder.QuantityMatch=myTokens;

        // This kind of order is not included in order book.
        // bookOrder[1].push(currentOrder);
        console.log('tokenAcumulator')
        console.log(tokenAcumulator)
        console.log('curentOrder')
        console.log(currentOrder)

        if (tokenKeyAcumulator.length>0){

            const orderMatch={
                Orders: tokenAcumulator,
                Order: currentOrder,
            }
            
            bookOrder=await this._transferCashTokens(ctx,orderMatch.Orders,orderMatch.Order,bookOrder)
        }
        await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)))
        await ctx.SetEventName('OrderBook');
        await ctx.SetEventPayload(Buffer.from(JSON.stringify(bookOrder)));


        return bookOrder
    }

    // We must add last market price attribute to order book in order to establish e fair price if there are no asks 
    // or bids in the order book
    // BidMarketOrder will be executed by someone whose desire is buying bonds at market price.
    async BidMarketOrder(ctx, amount,tokenID,identificativo){
        amount=parseInt(amount);
        if (amount<=0){
            throw new Error(`Amount argument must be positive`);
        }
        const userID= await ctx.GetUserIdentity('cif');

        // These prior verifications are also inside auxiliary function
        let myKey=await ctx.stub.createCompositeKey('securitizationCoin',[userID,tokenID]);
        myKey=myKey+identificativo;
        const tokenBytes=await ctx.stub.getState(myKey);
        if (!tokenBytes || tokenBytes.length === 0){
            throw new Error(`Error, Token State with ID ${tokenID} does not exist`);
        }
        const token= JSON.parse(tokenBytes.toString());
        if (!token.CanBeUsed){
            throw new Error(`This Token State with ID ${tokenID} has already been used. Try another token ID`);
        }
        

        const bookOrderBytes=await ctx.stub.getState('OrderBook');
        let bookOrder;
        if (!bookOrderBytes || bookOrderBytes.length === 0){
            throw new Error(`There are no asks submitted.`)
            // bookOrder=[[],[]];
        }else{
            bookOrder=JSON.parse(bookOrderBytes.toString());
        }

        let date=await ctx.stub.getDateTimestamp();

        const genericID=await ctx.stub.getTxID();
        const orderID=await ctx.stub.createCompositeKey('BidOrder',[genericID]);
        let currentOrder={
            ID: orderID,
            Quantity: amount,
            Price: '',
            MarketPrice: true,
            TokenID: token.ID,
            FullMatch: false,
            PartialMatch: false,
            QuantityMatch: 0,
            RestingQuantity: amount,
            Name: 'Bid',
            Time: new Date(date).getTime()
        }

        let asks=bookOrder[1];
        let bids=bookOrder[0];
        // If there  is no asks it means we cannot match our bid order, so it has no sense to commit a bid order
        // at market price
        if ( asks.length===0){
            // For sake of simplicity if there are no asks you cannot submit
            // a market order
            throw new Error(`There are no asks submitted.`)
        }

        const bidReference=currentOrder;

        let bondKeyAcumulator=[];
        let tokenAcumulator=[];
        let counter=bidReference.Quantity;
        let balance=0;
        let totalTokens=0;
        let tokensCounter=token.Amount;
        let balanceTokens=0;
        let myTokens=0

        // console.log('---------------CurrentOrder----------------------')
        // console.log(bidReference)
        // console.log('---------------------------------------------')
        for await (const ask of asks) {
            // console.log('ask')
            // console.log(ask.Quantity)
            // console.log(myTokens)
            if (!ask.FullMatch && myTokens<bidReference.Quantity ){
                // console.log('paso 5.1')
                // console.log(myTokens)
                counter=counter-ask.Quantity;
                balance=ask.Quantity+counter;
                // tokensCounter=tokensCounter-(ask.Quantity*ask.Price);
                // balanceTokens=(ask.Quantity*ask.Price)+tokensCounter;
                // FULL MATCH means that our submitted order with that size has been completed
                if (counter>=0){
                    // console.log('paso 5.1.2.1')
                    // FULL MATCH
                    ask.QuantityMatch=ask.Quantity;
                    ask.FullMatch=true;
                    ask.PartialMatch=false;
                    tokenAcumulator.push(ask);
                    // bondKeyAcumulator.push(ask.TokenID);
                    // totalTokens=totalTokens+(ask.Price*ask.QuantityMatch);
                    myTokens+=ask.Quantity
                }else{ 
                    // console.log('paso 5.1.2.2')
                    // PARTIAL MATCH means that our submitted order with that size has been completed partially
                    // PARTIAL MATCH
                    ask.FullMatch=false;
                    ask.PartialMatch=true;
                    ask.QuantityMatch=balance;
                    // bondKeyAcumulator.push(ask.TokenID);
                    tokenAcumulator.push(ask);
                    // totalTokens=totalTokens+(ask.Price*ask.QuantityMatch);
                    myTokens+=balance
                }
                // console.log(myTokens)
            }else{
                continue
            }
        }

        bookOrder=[bookOrder[0],asks,bookOrder[2]]
        
        // Full Match
        currentOrder.TokenID=token.ID;
        currentOrder.FullMatch=true;
        currentOrder.PartialMatch= false;
        currentOrder.QuantityMatch=myTokens;


        console.log('---------------------tokenAcumulator---------------------')
        console.log(tokenAcumulator)
        console.log('---------------------------------------------------------')
        console.log('---------------CurrentOrder----------------------')
        console.log(bidReference)
        console.log('---------------------------------------------')
        if (tokenAcumulator.length>0){
            const orderMatch={
                Orders: tokenAcumulator,
                Order: currentOrder,
            }
            bookOrder=await this._transferBondTokens(ctx,orderMatch.Orders,orderMatch.Order,bookOrder)
        }

        await ctx.stub.putState('OrderBook', Buffer.from(JSON.stringify(bookOrder)));
        
        await ctx.SetEventName('OrderBook');
        await ctx.SetEventPayload(Buffer.from(JSON.stringify(bookOrder)));

        console.log('---------------------BIDS------------------------')
        console.log(bookOrder[0])
        console.log('-------------------------------------------------')
        console.log('---------------------ASKS------------------------')
        console.log(bookOrder[1])
        console.log('-------------------------------------------------')
        console.log('---------------------Marketprice-----------------')
        console.log(bookOrder[2])
        console.log('-------------------------------------------------')

        return bookOrder
    }

    async QueryOrderBook(ctx){
        const bookOrderBytes=await ctx.stub.getState('OrderBook');
        if (!bookOrderBytes || bookOrderBytes.length === 0){
            throw new Error(`Order Book does not exist`);
        }
        const bookOrder=JSON.parse(bookOrderBytes.toString());
        return bookOrder
    }



    // // We must change this function
    // // Order book implementation URL http://web.archive.org/web/20110205154238/http://howtohft.blogspot.com/2011/02/how-to-build-fast-limit-order-book.html

}



// module.exports.originationContract=originationContract;
module.exports.securitizationContext=securitizationContext;
module.exports.servicingContract=servicingContract;
module.exports.ppaContract=ppaContract;
module.exports.commonSecuritizationContract=commonSecuritizationContract;
module.exports.bondIssuanceContract=bondIssuanceContract;
