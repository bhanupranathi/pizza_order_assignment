'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  	databaseURL : 'ws://pizza-order-gnof.firebaseio.com/'
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function getOrder(agent) {
    /*const order = agent.parameters.order;
    return admin.database().ref('orders').set({
      type : order
    
    });*/
  }
  
  function getVegType(agent){
    const order = agent.conte;
    return admin.database().ref('orders').set({
      type : order
    
    });
    /*const veg_type = agent.parameters.type;
    return admin.database().ref('orders').set({
      type : order*/
  }
  
  function getNonvegType(agent) {
    const nonVeg_type = agent.parameters.type;
  }
  function getVegItem(agent){
    const item_veg = agent.parameters.vegflavours;
  }
  function getNonvegItem(agent) {
    const item_nonveg = agent.parameters.nonvegflavours;
  }
  function getVegSize(agent) { 
    const size_veg = agent.prameters.size;
  }
  function getNonvegSize(agent) {
    const size_nonveg = agent.parameters.size;
  }
  function getVegNumber(agent) {
    const number_veg = agent.parameters.number;
  }
  function getNonvegNumber(agent) {
    const number_nonveg = agent.parameters.number;
  }
  function getVegUserdetails(agent) {
    
    console.log("coming in veg details");
    const quantity = agent.getContext("get-number-veg").parameters.number;
    const type = agent.getContext("get-order").parameters.type;
    const item = agent.getContext("get-item-veg").parameters.vegflavours;
    const size = agent.getContext("get-size-veg").parameters.size;
    let name_veg = agent.parameters.name;
 	if(typeof name_veg === "object" && name_veg!=null){
      name_veg= name_veg.name;
    } 
    const phoneno_veg = agent.parameters.phoneno;
    const address_veg = agent.parameters.location;
    console.log("order details");
    const orderId = new Date().getTime();
    console.log(orderId);
    agent.add(`Thank you for ordering. You orderId is ${orderId}. You have ordered ${quantity} ${size} size ${item} pizza's`);
    let dbObj = {
      "name":name_veg,
      "mobile":phoneno_veg,
       "address":address_veg.city,
      "type":type[0],
      "item":item,
      "size":size,
      "quantity":quantity,
      "status":"order confirmed"
    };
    //dbObj = JSON.parse(dbObj);
    console.log(dbObj);
    return admin.database().ref('orders').child(orderId).set(dbObj);
  }
  function getNonvegUserdetails(agent) {
    console.log("coming in non veg details");
    const quantity = agent.getContext("get-number-nonveg").parameters.number;
    const type = agent.getContext("get-order").parameters.type;
    const item = agent.getContext("get-item-nonveg").parameters.nonvegflavours;
    const size = agent.getContext("get-size-nonveg").parameters.size;
    
    let name_nonveg = agent.parameters.name;
 	if(typeof name_nonveg === "object" && name_nonveg!=null){
      name_nonveg= name_nonveg.name;
    } 
    const phoneno_nonveg = agent.parameters["phone-number"];
    const address_nonveg = agent.parameters.location;
    console.log("order details");
    console.log(type);
    const orderId = new Date().getTime();
    console.log(orderId);
    agent.add(`Thank you for ordering. You orderId is #${orderId}. You have ordered ${quantity} ${size} size ${item} pizza's`);
    let dbObj = {
      "name":name_nonveg,
      "mobile":phoneno_nonveg,
       "address":address_nonveg.city,
      "type":type[0],
      "item":item,
      "size":size,
      "quantity":quantity,
      "status":"order confirmed"
    };
    //dbObj = JSON.parse(dbObj);
    console.log(dbObj);
    return admin.database().ref('orders').child(orderId).set(dbObj);
  }
   
  function checkStatus(agent) {
    const orderID = agent.parameters.orderid;
    
    console.log("Order ID:", orderID);
    return admin.database().ref('orders').once('value').then(snapshot=>{
      try{
        let orderdetails = snapshot.child(orderID).val();
      let order_status = orderdetails.status;
        if(order_status){
          agent.add(`Hey! Your order #${orderID}.status is "${order_status}"`);
        } else{
          agent.add(`No data found. Please check the order id once or type order pizza to order a new one`);
        }
      
      } catch(error){
        agent.add(`No data found. Please check the order id once or type order pizza to order a new one`);
      }
      
    });
    
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('get-order', getOrder);
  intentMap.set('get-type-veg', getVegType);
  intentMap.set('get-type-nonveg', getNonvegType);
  intentMap.set('get-item-veg', getVegItem);
  intentMap.set('get-item-nonveg', getNonvegItem);
  intentMap.set('get-size-veg', getVegSize);
  intentMap.set('get-size-nonveg', getNonvegSize);
  intentMap.set('get-number-veg', getVegNumber);
  intentMap.set('get-number-nonveg', getNonvegNumber);
  intentMap.set('get-userdetails-veg', getVegUserdetails);
  intentMap.set('get-userdetails-nonveg', getNonvegUserdetails);
  intentMap.set('check-status', checkStatus);
  agent.handleRequest(intentMap);
});
