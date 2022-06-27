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
// const AcceptPPA = require('./services/acceptPPA.js');
const CreateOrderService = require( "./services/createOrder.js" );
const QuerySecuritizationCoins=require('./services/querySecuritizationCoins.js');
const QueryBonds= require('./services/queryBonds.js');
const QueryBookOrder=require('./services/queryBookOrder.js');
const CreateMarketOrderService = require( "./services/createMarketOrder.js" );
const QueryPPAHistory=require('./services/queryPPAHistory.js')
// const MonthlyBill=require('./services/monthlyBillPayout.js');
const PoolAssets= require('./services/pool.js');
const EnrollUser = require('./services/enrollUser.js');
const TransferCoupons=require('./services/transferCoupons.js')

// const acceptPPASvcInstance = new AcceptPPA();
const createOrderSvcInstance = new CreateOrderService();
const queryCoinsSvcInstance=new QuerySecuritizationCoins();
const queryBondsSvcInstance=new QueryBonds();
const queryBookOrderSvcInstance=new QueryBookOrder();
// const monthlyBillSvcInstance=new MonthlyBill();
const queryPPAHistorySvcInstance=new QueryPPAHistory();
const poolAssetsSvcInstance=new PoolAssets();
const enrollUserSvcInstance=new EnrollUser();
const transferCouponsSvcInstance=new TransferCoupons();
const createMarketOrderSvcInstance=new CreateMarketOrderService();

// const queryHistorySvcInstance = new QueryHistoryService();

app.get('/', function (req, res) {
   res.render('index');
})

// app.post('/acceptPPA', async (req, res, next) => {
//   var user = req.body.userID;
//   var uDNI = req.body.userDNI;
//   try {
//     if(!user || user.lenth<1) {
//       return res.status(500).json("User is missing");
//     }else if (!uDNI) {
//       return res.status(500).json("Missing required fields");
//     } else {
//       console.log('funciona');
//       const result = await acceptPPASvcInstance.acceptPPA(user,uDNI);
//       return res.status(200).json(result);
//     }
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// })
app.post('/poolAssets', async (req, res, next) => {
  var user = req.body.userID;
  // var uDNI = req.body.userDNI;
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

app.post('/createMarketOrder', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var orderType = req.body.orderType;
  var orderAmount=req.body.orderAmount;
  var id = req.body.id;
  var typeID=req.body.typeID;
  console.log(`username: ${userName}`);
  console.log(`orderType: ${orderType}`);
  console.log(`orderAmount: ${orderAmount}`);
  console.log(`id: ${id}`);
  console.log(`typeID: ${typeID}`);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!orderAmount || !orderType || !id || !typeID) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await createMarketOrderSvcInstance.createMarketOrder(userName,orderType,orderAmount,id,typeID);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.get('/queryBonds', async (req, res, next) => {
  var userName = req.query.user;
  console.log(userName);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      const result = await queryBondsSvcInstance.queryBonds(userName);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.get('/queryBookOrder', async (req, res, next) => {
  var userName = req.query.user;
  console.log(userName);
  try {
    if(!userName || userName.length<1) {
      return res.status(500).json("User is missing");
    } else {
      const result = await queryBookOrderSvcInstance.queryBookOrder(userName);
      // console.log(result)
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

app.post('/transferCoupons', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var bondToken = req.body.bondTokenID;
  var typeID=req.body.typeID;
  var spvID = req.body.spvID;
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!bondToken || !typeID || !spvID) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await transferCouponsSvcInstance.transferCoupons(userName,bondToken,typeID,spvID);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})


app.post('/createOrder', async (req, res, next) => {
  console.log(req.body);
  var userName = req.body.user;
  var orderType = req.body.orderType;
  var orderAmount=req.body.orderAmount;
  var orderPrice = req.body.orderPrice;
  var id = req.body.id;
  var typeID=req.body.typeID;
  console.log(`username: ${userName}`);
  console.log(`orderType: ${orderType}`);
  console.log(`orderPrice: ${orderPrice}`);
  console.log(`orderAmount: ${orderAmount}`);
  console.log(`id: ${id}`);
  console.log(`typeID: ${typeID}`);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else if (!orderAmount || !orderPrice || !orderType || !id || !typeID) {
      return res.status(500).json("Missing required fields");
    } else {
      const result = await createOrderSvcInstance.createOrder(userName,orderType,orderAmount,orderPrice,id,typeID);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// app.post('/monthlyBill', async (req, res, next) => {
//   console.log(req.body);
//   var userName = req.body.user;
//   var userDNI = req.body.userDNI;
//   var id = req.body.id;
//   var typeID=req.body.typeID;
//   try {
//     if(!userName || userName.lenth<1) {
//       return res.status(500).json("User is missing");
//     } else if (!userDNI || !id || !typeID) {
//       return res.status(500).json("Missing required fields");
//     } else {
//       const result = await monthlyBillSvcInstance.monthlyBill(userName,userDNI,id,typeID);
//       return res.status(200).json(result);
//     }
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// })


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






var port = process.env.PORT || 60000;
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})
