/**
** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
** farma ledger supply chain network
**  Author: Brian Wu
** JS for manufacturer web appication
**/
$(document).ready(function(){
    //make sure change to your own machine ip or dmain url
    var urlBase = "http://localhost:60000";
     var tabs =["enrollUser","poolAssets", "queryPPAHistory", "createOrder", "createMarketOrder","queryBonds","querySecuritizationCoins","queryBookOrder","transferCoupons"];
     $("#queryResult").hide();
   $("#enrollUserLink").click(function(){
     showTab("enrollUser");
   });
   $("#querySecuritizationCoinsLink").click(function(){
       showTab("querySecuritizationCoins");
   });
   $("#queryBondsLink").click(function(){
    showTab("queryBonds");
   });
   $("#queryBookOrderLink").click(function(){
    showTab("queryBookOrder");
   });
   $("#queryPPAHistoryLink").click(function(){
       showTab("queryPPAHistory");
   });
   $("#createOrderLink").click(function(){
    showTab("createOrder");
  });
  $("#createMarketOrderLink").click(function(){
    showTab("createMarketOrder");
  });
  $("#poolAssetsLink").click(function(){
    showTab("poolAssets");
  });
  $("#transferCouponsLink").click(function(){
    showTab("transferCoupons");
  });
 $("#enrollUser").click(function(){
  var addUserUrl = urlBase+"/enrollUser";
  var user = $('#enrollmentUser').val();
  var userIdentity= $('#enrollmentIdentity').val();
  var userSecret= $('#enrollmentSecret').val();
  var userCIF= $('#enrollmentUserCIF').val();
  var userEmail= $('#enrollmentUserEmail').val();
  $.ajax({
    type: 'POST',
    url: addUserUrl,
    data: { 
      user: user,
      userIdentity: userIdentity,
      userSecret: userSecret,
      userCIF: userCIF,
      userEmail: userEmail,  
    },
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("User - "+ user.toString()+ " was successfully enrolled and added to wallet and is ready to intreact with the fabric network");
      }
      showTab("enrollUser");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});


 $("#poolAssets").click(function(){
  var acceptUrl = urlBase+"/poolAssets";
  var poolUserID= $('#poolUser').val();
  // var poolUserDNI=$('#poolUserDNI').val();
  var poolAssetType=$('#poolAssetType').val();
  $.ajax({
    type: 'POST',
    url: acceptUrl,
    data: {
      userID: poolUserID,
      assetType: poolAssetType
    },
    dataType: 'text',
    success: function(data, status, jqXHR){
     //  console.log(data)
      if(status==='success'){
        alert("2 Tokens of your wallet have been successfully pooled ");
      }
      showTab("poolAssets");
    },
    error: function(xhr, textStatus, error){
     console.log(xhr.statusText);
     console.log(textStatus);
     console.log(error);
     alert("Error: "+ xhr.responseText);
    }
  });
});

$("#queryBonds").click(function(){
  reset();
  var queryUrl = urlBase+"/queryBonds";
  var userName = $('#bondUser').val();
  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { user: userName },
    success: function(data, status, jqXHR){
      if(!data) {
        $("#queryResultEmpty").show();
        $("#queryResult").hide();
      } else {
        console.log(`data: ${data}`)
        $("#queryBondResult").show();
        $("#queryBondResultEmpty").hide();
        // let record = data.toString();
        var tbody = $("#tableBondbody");
        tbody.empty();
        for (var i = 0; i < data.length; i++) {
          var row = data[i];
          var tr = '<tr>';
          tr = tr+'<th scope="col">'+ row.GenericID + '</th>';
          tr = tr+ '<td>'+ row.TypeID+ '</td>';
          tr = tr+ '<td>'+ row.Amount+ '</td>';
          tr = tr+ '<td>'+ row.CanBeUsed + '</td>';
          tr = tr+ '</tr>';
          tbody.append(tr);
          }
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});
$("#querySecuritizationCoins").click(function(){
  reset();
  var queryUrl = urlBase+"/querySecuritizationCoins";
  var userName = $('#coinUser').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { user: userName },
    success: function(data, status, jqXHR){
      if(!data) {
        $("#queryCoinResultEmpty").show();
        $("#queryCoinResult").hide();
      } else {
        // console.log(`data: ${data}`);
        $("#queryCoinResult").show();
        $("#queryCoinResultEmpty").hide();
        // let record = JSON.stringify(data);
        var tbody = $("#tableCoinbody");
        tbody.empty();
        for (let i = 0; i < data.length; i++) {
          var row = data[i];
          var tr = '<tr>';
          tr = tr+'<th scope="col">'+ row.GenericID + '</th>';
          tr = tr+ '<td>'+ row.TypeID+ '</td>';
          tr = tr+ '<td>'+ row.Amount+ '</td>';
          tr = tr+ '<td>'+ row.CanBeUsed + '</td>';
          tr = tr+ '</tr>';
          tbody.append(tr);
          }
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});

$("#transferCoupons").click(function(){
  var transferCouponsUrl = urlBase+"/transferCoupons";
  var formData = {
    user: $('#userTransferCoupons').val(),
    bondTokenID: $('#bondTransferTokenID').val(),
    typeID: $('#bondTransfertypeID').val(),
    spvID: $('#spvID').val(),
  }
  $.ajax({
    type: 'POST',
    url: transferCouponsUrl,
    data: formData,
    dataType:'text',
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully record order in order book");
     }
      showTab("transferCoupons");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});


$("#queryBookOrder").click(function(){
  reset();
  var queryUrl = urlBase+"/queryBookOrder";
  var userName = $('#bookUser').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { user: userName },
    success: function(data, status, jqXHR){
      if(!data) {
        $("#queryBookResultEmpty").show();
        $("#queryBookResult").hide();
      } else {
        $("#queryBookResult").show();
        $("#queryBookResultEmpty").hide();
        var tAskbody = $("#tableAskbody");
        tAskbody.empty();
        var vector=data[0];
        for (var i = 0; i < vector.length; i++) {
          var row = vector[i];
          if (!row.FullMatch){
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row.Quantity + '</th>';
            tr = tr+ '<td>'+ row.Price+ '</td>';
            tr = tr+ '<td>'+ row.Time + '</td>';
            tr = tr+ '<td>'+ row.Name + '</td>';
            // tr = tr+ '<td>'+ row.ownerName + '</td>';
            // tr = tr+ '<td>'+ row.previousOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.currentOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.createDateTime + '</td>';
            // tr = tr+ '<td>'+ row.lastUpdated + '</td>';
            tr = tr+ '</tr>';
            tAskbody.append(tr);            
          }
          }
        var tBidbody = $("#tableBidbody");
        tBidbody.empty();
        var vector=data[1];
        for (var i = 0; i < vector.length; i++) {
          var row = vector[i];
          if (!row.FullMatch ){
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row.Quantity + '</th>';
            tr = tr+ '<td>'+ row.Price+ '</td>';
            tr = tr+ '<td>'+ row.Time + '</td>';
            tr = tr+ '<td>'+ row.Name + '</td>';
            // tr = tr+ '<td>'+ row.ownerName + '</td>';
            // tr = tr+ '<td>'+ row.previousOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.currentOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.createDateTime + '</td>';
            // tr = tr+ '<td>'+ row.lastUpdated + '</td>';
            tr = tr+ '</tr>';
            tBidbody.append(tr);
          }
          }
          var tMarketPricebody = $("#tableMarketPricebody");
          tMarketPricebody.empty();
          var vector=data[2];
          for (var i = 0; i < vector.length; i++) {
            var row = vector[i];
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row + '</th>';
            tr = tr+ '</tr>';
            tMarketPricebody.append(tr);
            }

      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});


$("#createMarketOrder").click(function(){
  var createOrderUrl = urlBase+"/createMarketOrder";
  var formData = {
    user: $('#userMarketID').val(),
    orderType: $('#orderMarketType').val(),
    orderAmount: $('#argMarketAmount').val(),
    id: $('#argMarketID').val(),
    typeID: $('#argMarketTypeID').val(),
  }
  $.ajax({
    type: 'POST',
    url: createOrderUrl,
    data: formData,
    dataType:'text',
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully record order in order book");
     }
      showTab("createMarketOrder");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});

$("#queryPPAHistory").click(function(){
  reset();
  var queryUrl = urlBase+"/queryPPAHistory";
  var userName = $('#ppaHistoryUser').val();
  var userDNI= $('#ppaHistoryUserDNI').val();
  var searchKey = $('#ppaHistoryID').val();
  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { user: userName, userDNI: userDNI, key: searchKey },
    success: function(data, status, jqXHR){
      if(!data || data.length==0) {
        $("#queryPPAHistoryResultEmpty").show();
        $("#queryPPAHistoryResult").hide();
      } else {
        console.log(`data: ${data}`);
        $("#queryPPAHistoryResult").show();
        $("#queryPPAHistoryResultEmpty").hide();
        var tbody = $("#ppaHistoryTableTbody");
        tbody.empty();
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row.Timestamp + '</th>';
            tr = tr+ '<td>'+ row.Value.CustomerEmail + '</td>';
            // tr = tr+ '<td>'+ row.equipmentNumber + '</td>';
            // tr = tr+ '<td>'+ row.equipmentName + '</td>';
            // tr = tr+ '<td>'+ row.ownerName + '</td>';
            // tr = tr+ '<td>'+ row.previousOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.currentOwnerType + '</td>';
            // tr = tr+ '<td>'+ row.createDateTime + '</td>';
            // tr = tr+ '<td>'+ row.lastUpdated + '</td>';
            tr = tr+ '</tr>';
            tbody.append(tr);
        }
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});
$("#createOrder").click(function(){
  var createOrderUrl = urlBase+"/createOrder";
  var formData = {
    user: $('#userID').val(),
    orderType: $('#orderType').val(),
    orderAmount: $('#argAmount').val(),
    orderPrice: $('#argPrice').val(),
    id: $('#argID').val(),
    typeID: $('#argTypeID').val(),
  }
  $.ajax({
    type: 'POST',
    url: createOrderUrl,
    data: formData,
    dataType:'text',
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully record order in order book");
     }
      showTab("createOrder");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});


// $("#monthlyBill").click(function(){
//   var createOrderUrl = urlBase+"/monthlyBill";
//   var formData = {
//     user: $('#billUser').val(),
//     userDNI: $('#userDNI').val(),
//     id: $('#tokenID').val(),
//     typeID: $('#typeID').val(),
//   }
//   $.ajax({
//     type: 'POST',
//     url: createOrderUrl,
//     data: formData,
//     success: function(data, status, jqXHR){
//       if(status==='success'){
//         alert("successfully record order in order book");
//      }
//       showTab("createOrder");
//     },
//     error: function(xhr, textStatus, error){
//         console.log(xhr.statusText);
//         console.log(textStatus);
//         console.log(error);
//         alert("Error: "+ xhr.responseText);
//     }
//   });
// });


function showTab(which) {
   for(let i in tabs) {
     if(tabs[i]===which) {
       $("#"+tabs[i] + "Tab").show();
     } else {
       $("#"+tabs[i] + "Tab").hide();
     }
   }
   reset();
}
function reset() {
   $("#queryResultEmpty").hide();
   $("#queryResult").hide();
   $("#queryBondResultEmpty").hide();
   $("#queryBondResult").hide();
   $("#queryCoinResultEmpty").hide();
   $("#queryCoinResult").hide();
   $("#queryBookResultEmpty").hide();
   $("#queryBookResult").hide();
   $("#queryPPAHistoryResultEmpty").hide();
   $("#queryPPAHistoryResult").hide();
}
});
$(document).ajaxStart(function(){
  $("#wait").css("display", "block");
});
$(document).ajaxComplete(function(){
  $("#wait").css("display", "none");
});
