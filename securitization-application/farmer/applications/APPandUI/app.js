/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # App.js load application server:
 */
'use strict';
const express = require('express')
const app = express()
app.set('view engine', 'ejs')

const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');

app.use(express.static('public'))

const { Wallets } = require('fabric-network');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cache = require('memory-cache');
const AcceptPPA = require('./services/acceptPPA.js');
// const CreateOrderService = require( "./services/createOrder.js" );
const QuerySecuritizationCoins=require('./services/querySecuritizationCoins.js');
// const QueryBonds= require('./services/queryBonds.js');
// const QueryBookOrder=require('./services/queryOrderBook.js');
const QueryPPAHistory=require('./services/queryPPAHistory.js')
const MonthlyBill=require('./services/monthlyBillPayout.js');
const PoolAssets= require('./services/pool.js');
const EnrollUser = require('./services/enrollUser.js');
// const CreateMarketOrder=require('./services/createMarketOrder.js')
const RequestPPA=require('./services/requestPPA.js')
const MaintenanceServiceRequest=require('./services/maintenanceServiceRequest.js')
const acceptPPASvcInstance = new AcceptPPA();
// const createOrderSvcInstance = new CreateOrderService();
const queryCoinsSvcInstance=new QuerySecuritizationCoins();
// const queryBondsSvcInstance=new QueryBonds();
// const queryBookOrderSvcInstance=new QueryBookOrder();
const monthlyBillSvcInstance=new MonthlyBill();
const queryPPAHistorySvcInstance=new QueryPPAHistory();
const poolAssetsSvcInstance=new PoolAssets();
const enrollUserSvcInstance=new EnrollUser();
// const createMarketOrderSvcInstance=new CreateMarketOrder();
const requestPPASvcInstance=new RequestPPA();
const maintenanceServiceRequestSvcInstance=new MaintenanceServiceRequest();


// const queryHistorySvcInstance = new QueryHistoryService();

app.get('/', function (req, res) {
   res.render('index');
})

app.post('/acceptPPA', async (req, res, next) => {
  console.log(req.body)
  var user = req.body.acceptUserID;
  var ppaID = req.body.ppaID;
  try {
    if(!user || user.lenth<1) {
      return res.status(500).json("User is missing");
    }else if (!ppaID) {
      return res.status(500).json("Missing required fields");
    } else {
      console.log('funciona');
      const result = await acceptPPASvcInstance.acceptPPA(user,ppaID);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})
app.post('/poolAssets', async (req, res, next) => {
  var user = req.body.userID;
  var assetType= req.body.assetType;
  try {
    if(!user || user.lenth<1) {
      return res.status(500).json("User is missing");
    }else if (!assetType) {
      return res.status(500).json("Missing required fields");
    } else {
      // console.log('funciona');
      const result = await poolAssetsSvcInstance.poolAssets(user,assetType);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.get('/queryPPAHistory', async (req, res, next) => {
  var userName=req.query.user;
  let key = req.query.key;
  let userDNI=req.query.userDNI
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!key || !userDNI){
      return res.status(500).json("Missing required fields");
    }else {
      const result = await queryPPAHistorySvcInstance.queryPPAHistory(userName,userDNI, key);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }

})
app.get('/querySecuritizationCoins', async (req, res, next) => {
  var userName = req.query.user;
  console.log(userName);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      const result = await queryCoinsSvcInstance.querySecuritizationCoins(userName);
      // console.log(`type of : ${typeof result}`);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.post('/monthlyBill', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var ppaID=req.body.ppaID
  var id = req.body.id;
  var typeID=req.body.typeID;
  try {
    console.log('funciona');
    if(!userName || userName.lenth<1) {
      console.log('if 1')
      return res.status(500).json("User is missing");
    } else if (!ppaID || !id || !typeID) {
      return res.status(500).json("Missing required fields");
    } else {
      console.log('else')
      const result = await monthlyBillSvcInstance.monthlyBill(userName,ppaID,id,typeID);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.post('/requestPPA', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var landID = req.body.landID;
  var crops = req.body.crops;
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!landID || !crops ) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await requestPPASvcInstance.requestPPA(userName,landID,crops);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.post('/maintenanceServiceRequest', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var ppaID = req.body.ppaID;
  var service = req.body.service;
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!ppaID || !service ) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await maintenanceServiceRequestSvcInstance.maintenanceServiceRequest(userName,ppaID,service);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.post('/enrollUser', async (req, res, next) => {
  console.log(req.body);
  var user = req.body.user;
  var userIdentity = req.body.userIdentity;
  var secret = req.body.userSecret;
  var userCIF=req.body.userCIF;
  var userEmail= req.body.userEmail
  try {
    if(!user || user.lenth<1|| !userIdentity || userIdentity.length<1) {
      return res.status(500).json("User or identity label is missing");
    } else if (!secret || !userCIF || !userEmail) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await enrollUserSvcInstance.enrollUser(user,userIdentity,secret,userCIF,userEmail);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})






var port = process.env.PORT || 30000;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})
