var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var logger = require('./logger');


app.use(logger);
app.use(bodyParser.json());


var companySchema = mongoose.Schema({
    name: String,
    symbolURL: String,
    openPrice: String,
    currentPrice: Number,
    changeVolume: Number,
    changeIcon: String,
    changePercentage: Number,
    changeDirection: Number,
    shareVolume: Number
});

var orderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: String
});

var Companies = mongoose.model('Companies', companySchema);
var BuyOrders = mongoose.model('BuyOrders', orderSchema);
var SaleOrders = mongoose.model('SaleOrders', orderSchema);
var Transactions = mongoose.model('Transactions', orderSchema);


mongoose.connect('mongodb://node:node@ds055680.mongolab.com:55680/finalcompanydb');

var dbb = mongoose.connection;
dbb.on('error', console.error.bind(console, 'connection error:'));
dbb.once('open', function callback () {
    console.log("connected");
});

app.get('/companies', function(request, response){
    Companies.find(function(error, companies){
        if(error) response.send(error);
        response.status(201).json({company: companies});
        console.log(companies);
    });
});

app.get('/buyOrders', function(request, response){
    BuyOrders.find(function(error, buyOrders){
        if(error) response.send(error);
        response.status(201).json({buyOrders: buyOrders});
        console.log(buyOrders);
    });
});

app.get('/saleOrders', function(request, response){
    SaleOrders.find(function(error, saleOrders){
        if(error) response.send(error);
        response.status(201).json({saleOrders: saleOrders});
        console.log(saleOrders);
    });
});

app.post('/companies', function(request, response){
    var company = new Companies({
        name: request.body.company.name,
        symbolURL: request.body.company.symbolURL,
        openPrice: request.body.company.openPrice,
        currentPrice: request.body.company.currentPrice,
        changeVolume: request.body.company.changeVolume,
        changeIcon: request.body.company.changeIcon,
        changePercentage: request.body.company.changePercentage,
        changeDirection: request.body.company.changeDirection,
        shareVolume: request.body.company.shareVolume
    });
    company.save(function(error){
        if(error) response.send(error);
        response.status(201).json({company: company});
    });
});

app.post('/buyOrders', function(request, response){
    var buyOrder = new BuyOrders({
        timeStamp: request.body.buyOrder.timeStamp,
        size: request.body.buyOrder.size,
        price: request.body.buyOrder.price,
        company: request.body.buyOrder.company
    });
    buyOrder.save(function(error){
        if(error) response.send(error);
        response.status(201).json({buyOrder: buyOrder});
    });
});

app.post('/saleOrders', function(request, response){
    var saleOrder = new SaleOrders({
        timeStamp: request.body.saleOrder.timeStamp,
        size: request.body.saleOrder.size,
        price: request.body.saleOrder.price,
        company: request.body.saleOrder.company
    });
    saleOrder.save(function(error){
        if(error) response.send(error);
        response.status(201).json({saleOrder: saleOrder});
    });
});

app.post('/transactions', function(request, response){
    var transaction = new Transactions({
        timeStamp: request.body.transaction.timeStamp,
        size: request.body.transaction.size,
        price: request.body.transaction.price,
        company: request.body.transaction.company
    });
    transaction.save(function(error){
        if(error) response.send(error);
        response.status(201).json({transaction: transaction});
    });
});

app.put('/companies/:company_id', function(request, response){
    Companies.findById(request.params.company_id, function(error, company){
        if(error) response.send(error);
        company.name = request.body.company.name,
            company.symbolURL = request.body.company.symbolURL,
            company.openPrice = request.body.company.openPrice,
            company.currentPrice = request.body.company.currentPrice,
            company.changeVolume = request.body.company.changeVolume,
            company.changeIcon = request.body.company.changeIcon,
            company.changePercentage = request.body.company.changePercentage,
            company.changeDirection = request.body.company.changeDirection,
            company.shareVolume = request.body.company.shareVolume

        company.save(function(error){
            if(error) response.send(error);
            response.status(201).json({companies: company});
        });
    });
});

app.put('/buyOrders/:buyOrder_id', function(request, response){
    BuyOrders.findById(request.params.buyOrder_id, function(error, buyOrder){
        if(error) response.send(error);
        buyOrder.timeStamp = request.body.buyOrder.timeStamp,
            buyOrder.size = request.body.buyOrder.size,
            buyOrder.price = request.body.buyOrder.price,
            buyOrder.company = request.body.buyOrder.company

        buyOrder.save(function(error){
            if(error) response.send(error);
            response.status(201).json({buyOrders: buyOrder});
        });
    });
});

app.put('/saleOrders/:saleOrder_id', function(request, response){
    SaleOrders.findById(request.params.saleOrder_id, function(error, saleOrder){
        if(error) response.send(error);
        saleOrder.timeStamp = request.body.saleOrder.timeStamp,
            saleOrder.size = request.body.saleOrder.size,
            saleOrder.price = request.body.saleOrder.price,
            saleOrder.company = request.body.saleOrder.company

        saleOrder.save(function(error){
            if(error) response.send(error);
            response.status(201).json({saleOrders: saleOrder});
        });
    });
});

app.delete('/buyOrders/:buyOrder_id', function(request, response){
    BuyOrders.remove({
        _id: request.params.buyOrder_id
    }, function(error, buyOrder){
        if(error) response.send(error);
        response.status(201).json({buyOrders: buyOrder});
    });
});

app.delete('/saleOrders/:saleOrder_id', function(request, response){
    SaleOrders.remove({
        _id: request.params.saleOrder_id
    }, function(error, saleOrder){
        if(error) response.send(error);
        response.status(201).json({saleOrders: saleOrder});
    });

});

app.use(express.static('public'));

app.listen(3333, function(){
    console.log('Server running');
});