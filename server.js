var port = "8124";

var http = require('http'),
    url = require('url'),
    gp  = require('google-prediction'),
    fs  = require('fs'),
    Hash = require('hashish')

var predict = gp({
  'iss': '56665688270@developer.gserviceaccount.com',
  'key': fs.readFileSync('key.pem', 'utf-8')
})

console.log(" ");
console.log("SERVER STARTED");
console.log("Listening on port: " + port);
console.log(" ");

http.createServer(function (req, res) {
    //request
		var path = url.parse(req.url).pathname;
		console.log(getDate() + " - REQUEST:   '" + path + "'");

    var payload = {
      'id': 'reg1',
      'input': {
        'csvInstance': [
          'Friday'
        ]
      }
    }

    predict.predict.predict('reg1', payload, function(result) {
      //do stuff

      var data = Hash({}).mergeAll([getAccounts(),
        getIdentity(),
        //getAmount(),
        getFrom(),
        getTo()]).items

        data.amount = result.outputValue

      var x = { 'result': data }
      
      //response
      console.log(JSON.stringify(x))
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('jsonCallback('+ JSON.stringify(x) + ')')
      console.log(getDate() + " - RESPONSE:  sent")
    })

}).listen(port);

function getDate(){
	var date = new Date();
	return (date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}

//db
function getAccounts(){
	return {"accounts":[{"id":"Account 1"},{"id":"Account 2"},{"id":"Account 3"},{"id":"Account 4"}]}
}

//db
function getIdentity(){
	return {"netbankId":"12345678","friendlyName":"Mr John Smith"}
}

//google
function getAmount(){
	return {"amount":"2"}
}

//google?
function getFrom(){
	return {"fromAccountID":"Account 1"}
}

//random from list of accounts?
function getTo(){
	return {"toAccountID":"Account 2"};
}

//old excessive json, - reference purposes only.
//{"result":{"accounts": [{"id": "Account 1"},{"id": "Account 2"},{"id": "Account 3"},{"id": "Account 4"}],"identity":{"netbankId": "12345678","friendlyName": "Mr John Smith","lastSuccessfulLogin": "2002-09-24"},"proposedTransaction": {"id": "TC1","description": {"cleaned": "Fee (STG ATM)","raw": "Fee (STG ATM)"},"amount": {"currency": "AUD","signed": "2","unsigned": "2","sign": "DR"},"accounts": {"fromAccount": {"id": "Account 1" },"toAccount": {"id": "Account 2" }}}}}
