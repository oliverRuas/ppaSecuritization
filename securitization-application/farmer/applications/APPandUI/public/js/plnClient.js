/**
** O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
** farma ledger supply chain network
**  Author: Brian Wu
** JS for manufacturer web appication
**/
$(document).ready(function(){
    //make sure change to your own machine ip or dmain url
    var urlBase = "http://localhost:30000";
     var tabs =["acceptPPA","enrollUser","maintenanceServiceRequest","poolAssets", "queryPPAHistory","querySecuritizationCoins","monthlyBill","requestPPA","queryMyPPA"];
     $("#queryResult").hide();
   $("#acceptPPALink").click(function(){
     showTab("acceptPPA");
   });
   $("#enrollUserLink").click(function(){
     showTab("enrollUser");
   });
   $("#querySecuritizationCoinsLink").click(function(){
       showTab("querySecuritizationCoins");
   });
   $("#queryPPAHistoryLink").click(function(){
       showTab("queryPPAHistory");
   });
  $("#monthlyBillLink").click(function(){
    showTab("monthlyBill");
  });
  $("#maintenanceServiceRequestLink").click(function(){
    showTab("maintenanceServiceRequest");
  });
  $("#requestPPALink").click(function(){
    showTab("requestPPA");
  });
  $("#poolAssetsLink").click(function(){
    showTab("poolAssets");
  });
  $("#queryMyPPA").click(function(){
    showTab("queryMyPPA");
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

 $("#acceptPPA").click(function(){
   var acceptUrl = urlBase+"/acceptPPA";
   var acceptUserID= $('#acceptUser').val();
   var ppaID= $('#acceptppaID').val();
   $.ajax({
     type: 'POST',
     url: acceptUrl,
     data: {
       acceptUserID: acceptUserID,
       ppaID: ppaID
     },
     dataType: 'text',
     success: function(data, status, jqXHR){
       if(status==='success'){
         alert("PPA with ID "+acceptUserID.toString()+" has been successfully accepted ");
       }
       showTab("acceptPPA");
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

$("#monthlyBill").click(function(){
  var createOrderUrl = urlBase+"/monthlyBill";
  var formData = {
    user: $('#billUser').val(),
    ppaID: $('#ppaID').val(),
    id: $('#tokenID').val(),
    typeID: $('#monthlybilltypeID').val(),
  }
  $.ajax({
    type: 'POST',
    url: createOrderUrl,
    data: formData,
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully record order in order book");
     }
      showTab("monthlyBill");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});

$("#requestPPA").click(function(){
  var requestPPAUrl = urlBase+"/requestPPA";
  var formData = {
    user: $('#requestUser').val(),
    landID: $('#landID').val(),
    crops: $('#crops').val(),
  }
  $.ajax({
    type: 'POST',
    url: requestPPAUrl,
    data: formData,
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully PPA requested");
     }
      showTab("requestPPA");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});

$("#queryMyPPA").click(function(){
  var queryMyPPAUrl = urlBase+"/queryMyPPA";
  var formData = {
    user: $('#queryUser').val(),
  }
  $.ajax({
    type: 'POST',
    url: queryMyPPAUrl,
    data: formData,
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully PPA queried");
     }
      showTab("queryMyPPA");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});

$("#maintenanceServiceRequest").click(function(){
  var maintenanceServiceRequestUrl = urlBase+"/maintenanceServiceRequest";
  var formData = {
    user: $('#maintenanceServiceRequestUser').val(),
    ppaID: $('#maintenanceServiceRequestPPAID').val(),
    service: $('#maintenanceServiceRequestType').val(),
  }
  $.ajax({
    type: 'POST',
    url: maintenanceServiceRequestUrl,
    data: formData,
    success: function(data, status, jqXHR){
      if(status==='success'){
        alert("successfully maintenance updated");
     }
      showTab("maintenanceServiceRequest");
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});



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
