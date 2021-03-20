require("dotenv").config();
import request from "request";

let postWebhook = (req, res) =>{
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);

            }

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);

      } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
      }
  }
};

//odpovědi na klasické zrpávy
function handleMessage(sender_psid, received_message) {
  let response;
// text
  if (received_message.text) {

//         // odpověď
     response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Thanks for your message!",
                        "image_url": "https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-9/162112368_108574541310308_5616968838528108852_o.jpg?_nc_cat=103&ccb=1-3&_nc_sid=e3f864&_nc_ohc=M6njscdlO8MAX8YKM-j&_nc_ht=scontent-frt3-2.xx&oh=3b2dfdd531857d979639750d00c87b2e&oe=6076413E",
                        "subtitle": "Do you want to start new conversation or just check page for tourists?",
                        "buttons": [
                            {

                                "type": "postback",
                              "title": "Get started!",
                              "payload": "GET_STARTED",
                          },
                                
                            
                            {
                                "type": "web_url",
                                "url": "https://www.praguecitytourism.cz/cs",
                                "title": "Page for tourists",
                                
                            }
                            
                        ]
                    }
                ]
            }
        }
    }
    
    
   } else if (received_message.attachments) {

// Co se staneoutage
let attachment_url = received_message.attachments[0].payload.url;
     response = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "I like you too. Do you want to know more ?",
                    "image_url": "https://www.corinthia.com/media/6456/prague-castle-wwwistockphoto.gif?center=0.24528301886792453,0.34177215189873417&mode=crop&width=1600&height=644&rnd=132182889640000000",
                    "subtitle": "You can find informations here:",
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": "https://www.praguecitytourism.cz/cs",
                            "title": "Page for tourists",
                            
                        }
                        
                    ]
                }
            ]
        }
    }
}

};


// Sends the response message
    callSendAPI(sender_psid, response);
 }

// odpovědi na buttony
function handlePostback(sender_psid, received_postback) {
    let response;

    let payload = received_postback.payload;

    // Konkretni dotazy
if (payload === 'yes') {
  response =  response = { "text": "Thank you" }
}else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
} else if (payload === "GET_STARTED") {
      response = { "attachment": {
          "type": "template",
           "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Welcome in Prague. I am exited to by your guide. ",
                "subtitle": "I will guide our conversation by questions. Ready?",
               "image_url": "http://databazeturkova.unas.cz/Untitled_Artwork-2.png",
   "buttons": [
                   {
                      "type": "postback",
                    "title": "Let's do it",
                   "payload": "start",
                        },
                      
                    ],
                }]
            } }
          }

         } else if (payload === 'GET_STARTED') {
            response = { "attachment": {
                "type": "template",
                 "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "Welcome in Prague. I am exited to by your guide. ",
                      "subtitle": "I will guide our conversation by questions. Ready?",
                     "image_url": "https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-9/162112368_108574541310308_5616968838528108852_o.jpg?_nc_cat=103&ccb=1-3&_nc_sid=e3f864&_nc_ohc=M6njscdlO8MAX8YKM-j&_nc_ht=scontent-frt3-2.xx&oh=3b2dfdd531857d979639750d00c87b2e&oe=6076413E",
         "buttons": [
                         {
                            "type": "postback",
                          "title": "Let's do it",
                         "payload": "start",
                              },
                            
                          ],
                      }]
                  } }
                }
} else if (payload === "start") {
          response = { "attachment": {
              "type": "template",
               "payload": {
                  "template_type": "generic",
                  "elements": [{
                    "title": "What do you want to help with?",
                    "subtitle": "What do you want to help with?", 
       "buttons": [
                       {
                          "type": "postback",
                        "title": "Transport",
                       "payload": "trans",
                            },
                          {
                                "type": "postback",
                                "title": "Restaurants",
                                "payload": "meal",
                            },
                            {
                              "type": "postback",
                              "title": "More options",
                              "payload": "startdva",
                          }
                        ],
                    }]
                } }
              }
} else if (payload === "exhl") {
              response = { "attachment": {
                  "type": "template",
                   "payload": {
                      "template_type": "generic",
                      "elements": [{
                        "title": "Do want to show Czech money examples?",
                        "subtitle": "What do you want to help with?", 
           "buttons": [
                           {
                              "type": "postback",
                            "title": "Examples",
                           "payload": "example",
                                },
                              {
                                    "type": "postback",
                                    "title": "Exchange",
                                    "payload": "exchange",
                                },
                              
                            ],
                        }]
                    } }
                  }
} else if (payload === "startdva") {
              response = { "attachment": {
                  "type": "template",
                   "payload": {
                      "template_type": "generic",
                      "elements": [{
                        "title": "What do you want to help with?",
                        "subtitle": "What do you want to help with?", 
           "buttons": [
                           {
                            "type": "postback",
                            "title": "Trips",
                            "payload": "iact",
                                },
                              {
                                    "type": "postback",
                                    "title": "Money exchange",
                                    "payload": "exhl",
                                },
                                {
                                  "type": "postback",
                                  "title": "Culture",
                                  "payload": "culture",
                              }
                            ],
                        }]
                    } }
                  }

            //doprava
} else if (payload === 'trans') {
        response = { "attachment": {
            "type": "template",
             "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Here are some transfer options. Which one do you prefer?",
                  "subtitle": "Please choose one option.", 
     "buttons": [
                     {
                      "type": "web_url",
                      "url": "https://pid.cz/en/",
                      "title": "Public transport",

                          },
                        {
                              "type": "postback",
                              "title": "Car/Bike rent",
                              "payload": "rent",
                          },
                          {
                           
                         "type": "web_url",
                         "url": " http://www.myczechrepublic.com/prague/prague_taxi.html",
                        "title": "Taxi",
                        
                        }
                      ],
                  }]
              } }
            } 
         

            //jidlo
} else if (payload === 'meal') {
    response = { "attachment": {
        "type": "template",
         "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "What do you want to eat today?",
              "subtitle": "Please choose one option.",  
 "buttons": [
  {
    "type": "web_url",
    "url": "https://www.tasteofprague.com/pragueblog/traditional-czech-food-in-prague-what-to-have-and-where-to-have-it",
    "title": "Czech cousine",
    
},
                 
                      
                    {
                          "type": "postback",
                          "title": "Fast food",
                          "payload": "mealff",
                      },
                      {
                        "type": "postback",
                        "title": "Asian food",
                        "payload": "mealaf",
                    },
        
                  ], 
                  
              }]
          } }
        }
        //aktivity
} else if (payload === 'iact') {
    response = { "attachment": {
        "type": "template",
         "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Do you want do do someting in Prague or see something else in Czech Republic?",
              "subtitle": "All destinations are suppose to be one day trips.", 
 "buttons": [
                 {
                    "type": "postback",
                  "title": "Prague",
                 "payload": "iactp",
                      },
                    {
                          "type": "postback",
                          "title": "Somewhere else",
                          "payload": "iacts",
                      },
                      {
                        "type": "web_url",
                        "url": "https://theculturetrip.com/europe/czech-republic/articles/the-12-most-beautiful-spots-in-czech-republic/",
                        "title": "Longer trips",
                        
                    },
                
                  ],
              }]
          } }
        }

//v praze
      
} else if (payload === 'iactp') {
      response = { "attachment": {
          "type": "template",
           "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "How it it the weather supposed to be...",
                    "subtitle": "Do you want to be outside or inside?", 
   "buttons": [
    {
      "type": "postback",
    "title": "Inside",
   "payload": "iactpi",
        },
      {
            "type": "postback",
            "title": "Outside",
            "payload": "iactso",
        },
                  
                    ],
                }]
            } }
          } 
          //uvnitr
} else if (payload === 'iactpi') {
        response = { "attachment": {
          "type": "template",
           "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Here are some interesting places in Prague to do outside...",
                    "subtitle": "Enjoy your trip.", 
   "buttons": [
      {
        "type": "web_url",
        "url": "https://www.nm.cz/en",
        "title": "National Museum",
        
    },
    {
      "type": "web_url",
      "url": "https://www.tiqets.com/en/prague-castle-tickets-l144211/?&utm_source=google&utm_medium=cpc&utm_campaign=1506421156&utm_content=62289918618&gclid=Cj0KCQjw0caCBhCIARIsAGAfuMz8kepgn1DyAcgvmW_bcr3PXftNDyxs3PBvhYz_CUdNI2EBiG5-6F8aAvhrEALw_wcB&gclsrc=aw.ds",
      "title": "Prague Castle",
      
  },
                          {
                            "type": "web_url",
                            "url": "https://www.travelgeekery.com/prague-rain-indoor-things-to-do-in-prague",
                            "title": "Other tips",
                            
                        },
                    
                      ],
                  }]
              } }
            }

            //venku
} else if (payload === 'iactso') {
            response = { "attachment": {
                "type": "template",
                 "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "Here are some interesting places in Prague to do outside...",
                          "subtitle": "Enjoy your trip.", 
         "buttons": [
          {
            "type": "web_url",
            "url": "https://www.praha-vysehrad.cz/?l=9",
            "title": "Vyšehrad",
            
        },
        {
          "type": "web_url",
          "url": "https://www.prague.eu/cs/objekt/mista/116/petrinska-rozhledna",
          "title": "Petřín",
          
      },
                              {
                                "type": "web_url",
                                "url": "https://www.thecrazytourist.com/top-25-things-to-do-in-prague/",
                                "title": "Other places",
                                
                            },
                        
                          ],
                      }]
                  } }
                }
               //aktivity mimo Prahu
} else if (payload === 'iacts') {
            response = { "attachment": {
                "type": "template",
                 "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "Here are some interesting places close to Prague.",
                      "subtitle": "Enjoy your trip.", 
         "buttons": [
          {
            "type": "web_url",
            "url": "https://www.ckrumlov.info/en/welcome/",
            "title": "Český krumlov",
            
        },
        {
          "type": "web_url",
          "url": "https://www.hrad-karlstejn.cz/en",
          "title": "Karlštějn",
          
      },
                            
      {
        "type": "web_url",
        "url": "https://www.planetware.com/tourist-attractions-/prague-cz-pr-p.htm",
        "title": "Other places",
        
    },
                          ],
                      }]
                  } }
                }

        
        //transfer

} else if (payload === 'rent') {
          response = { "attachment": {
            "type": "template",
             "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "What ddo you want to rent?",
                  "subtitle": "Please choose one option.",  
     "buttons": [
      {
        "type": "web_url",
          "url": "https://www.rentalcars.com/en/city/cz/prague/?affiliateCode=google&preflang=en&label=prague-_yVZFyq2kshDHJM*qtWQ0QS88996040089&ws=&ppc_placement=&ppc_target=&ppc_param1=&ppc_param2=&aceid=&adposition=&ppc_network=g&feeditemid=&ppc_targetid=kwd-92498435&loc_physical_ms=1003742&loc_interest_ms=&ppc_device=c&ppc_devicemodel=&gclid=Cj0KCQjw0caCBhCIARIsAGAfuMy8uSW2K52szyYKWq_Txd-vOLPN5HLc6gc34wfIFGPvLm44BJcV8doaAm0_EALw_wcB",
          "title": "Car",
        },
                        {
                          "type": "web_url",
                            "url": "https://www.be-rider.com/en/home",
                            "title": "Scooter",
                          },
                          {
                            "type": "web_url",
                            "url": "https://en.nextbikeczech.com/praha/",
                            "title": "Bike",
                        },
            
                      ], 
                      
                  }]
              } }
            }
       
          //restaurace
} else if (payload === 'mealaf') {
          response = { "attachment": {
            "type": "template",
             "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "What exact type of Asia food do you want ?",
                  "subtitle": "Please choose one option..", 
     "buttons": [
                     {
                      "type": "web_url",
                      "url": "https://www.tripadvisor.com/Restaurants-g274707-c11-Prague_Bohemia.html",
                      "title": "Chinese cuisine",

                          },
                        {
                          "type": "web_url",
                          "url": " https://www.tripadvisor.com/Restaurants-g274707-c27-Prague_Bohemia.html",
                              "title": "Japanese cuisine",
                          },
                          {
                           
                            "type": "web_url",
                      "url": " https://www.tripadvisor.com/Restaurants-g274707-c10661-Prague_Bohemia.html",
                      "title": "Korean cuisine",
                        }
                      ],
                  }]
              } }
            } 
} else if (payload === 'mealff') {
          response = { "attachment": {
            "type": "template",
             "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "What exact type of fast food do you want ?",
                  "subtitle": "Please choose one option..", 
     "buttons": [
                     {
                      "type": "web_url",
                      "url": "https://www.tripadvisor.com/Restaurants-g274707-c31-Prague_Bohemia.html",
                      "title": "Pizza",

                          },
                        {
                          "type": "web_url",
                          "url": "https://www.bb.cz",
                              "title": "Bageterie",
                          },
                          {
                           
                            "type": "web_url",
                      "url": " https://www.tripadvisor.com/Restaurants-g274707-c10646-Prague_Bohemia.html",
                      "title": "Fast food",
                        }
                      ],
                  }]
              } }
            } 
        
} else if (payload === 'petrin') {
          response = { "attachment": {
            "type": "template",
             "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "What exact type of Czech food do you want ?",
                  "subtitle": "Please choose one option..", 
     "buttons": [
                     {
                      "type": "web_url",
                      "url": "https://www.tripadvisor.com/Restaurants-g274707-c11-Prague_Bohemia.html",
                      "title": "Chinese cuisine",

                          },
                        {
                          "type": "web_url",
                          "url": " https://www.tripadvisor.com/Restaurants-g274707-c27-Prague_Bohemia.html",
                              "title": "Japanese cuisine",
                          },
                          {
                           
                            "type": "web_url",
                      "url": " https://www.tripadvisor.com/Restaurants-g274707-c10661-Prague_Bohemia.html",
                      "title": "Korean cuisine",
                        }
                      ],
                  }]
              } }
            } 
          //navic
} else if (payload === 'imageformat') {
          response =   {  "attachment": {
            "type": "template",
            "payload": {
               "template_type": "media",
               "elements": [
                  {
                     "media_type": "image",
                     "url": "https://www.facebook.com/110870364408593/photos/a.112894037539559/112893964206233",
                     "buttons": [
                      {
                        "type": "web_url",
                        "url": " https://www.tripadvisor.com/Restaurants-g274707-c10661-Prague_Bohemia.html",
                        "title": "Korean cuisine",
                      }
                   ]
                  },
                  
               ]
            }
          }    
        }
//navic

    //money
} else if (payload === 'example') {
        response =   {   "attachment":{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements":[
               {
                "title":"Czech money examples.",
                "image_url":"https://www.sberatel.com/diskuse/imagesExtension/img/33754/499949/20779_9B6QeX.png",
                "subtitle":"500 Kč",
                "default_action": {
                  "type": "web_url",
                  "url": "https://www.cnb.cz/en/",
                  "webview_height_ratio": "tall",
                },
                "buttons":[
                  {
                      "type": "postback",
                      "title": "Exchange tips",
                      "payload": "exchange",
                
                  }             
                ]      
              },
              {
                "title":"Czech money examples.",
                "image_url":"https://www.unimagnet.cz/data/photos/old/articles/UM7027-Ceske-mince-a-feromagnetismus-Unimagnet.jpg",
                "subtitle":"1,2,5,10,20,50 Kč",
                "default_action": {
                  "type": "web_url",
                  "url": "https://www.cnb.cz/en/",
                  "webview_height_ratio": "tall",
                },
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://www.cnb.cz/en/?fbclid=IwAR04HeObjaGWeofmAjZ5PrnRqUlZmwbw4zNjCq8uVDYLTEq366RY_5Sa4Jc",
                    "title":"Czech National Bank "
                  }             
                ]      
              },
              {
                "title":"Czech money examples.",
                "image_url":"https://f.aukro.cz/images/sk6952609370/730x548/100kc-2018-serie-j12-unc-62933173.jpeg",
                "subtitle":"100 Kč",
                "default_action": {
                  "type": "web_url",
                  "url": "https://www.cnb.cz/en/",
                  "webview_height_ratio": "tall",
                },
                "buttons":[
                  {
                    "type":"web_url",
                    "url":"https://www.cnb.cz/en/?fbclid=IwAR04HeObjaGWeofmAjZ5PrnRqUlZmwbw4zNjCq8uVDYLTEq366RY_5Sa4Jc",
                    "title":"Czech National Bank "
                  }             
                ]      
              }
            ]
          }
        }
      }
      
}else if (payload === 'culture') {
      response =   {   "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Theatre.",
              "image_url":"https://live.staticflickr.com/7024/27040274101_c19d99489f_b.jpg",
              "subtitle":"National Theatre",
              "default_action": {
                "type": "web_url",
                "url": "https://www.narodni-divadlo.cz/en/stages/the-national-theatre",
                "webview_height_ratio": "tall",
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.tripadvisor.com/Attractions-g274707-Activities-c58-t116-Prague_Bohemia.html",
                  "title":"More theatres "
              
                }             
              ]      
            },
            {
              "title":"Music.",
              "image_url":"https://cdn-vsh.prague.eu/object/215/1578337582-sootevreni15.jpg",
              "subtitle":"State opera",
              "default_action": {
                "type": "web_url",
                "url": "https://www.czechopera.cz",
                "webview_height_ratio": "tall",
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.songkick.com/metro-areas/28425-czech-republic-prague",
                  "title":"More music performances "
                }             
              ]      
            },
            {
              "title":"Festivals.",
              "image_url":"https://www.colours.cz/cmspages/getfile.aspx?guid=dc010579-c84f-4f83-a81d-7edd766a66c3&width=370&height=-1&maxsidesize=-1",
              "subtitle":"Colours of Ostrava",
              "default_action": {
                "type": "web_url",
                "url": "https://www.colours.cz/o-festivalu/colourspedia/2019/zahajeni-festivalu",
                "webview_height_ratio": "tall",
              },
              "buttons":[
                {
                  "type":"web_url",
                  "url":"https://www.prague.com/v/festivals/",
                  "title":"More festivals "
                }             
              ]      
            }
          ]
        }
      }
    }
    
} else if (payload === 'exchange') {
      response = { "attachment": {
        "type": "template",
         "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Here is Czech Natinal Bank official page with all infromations.",
              "subtitle": "Please choose one option..", 
 "buttons": [
                 {
                  "type": "web_url",
                  "url": "https://www.cnb.cz/en/",
                  "title": "National Bank",

                      },
                    {
                      "type": "web_url",
                      "url": "https://www.youtube.com/watch?v=gd77Fs7UEic",
                          "title": "Safe money change",
                      },
                      
                  
                  ],
              }]
          } }
        } 
      }
                      
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Napojeni API
function callSendAPI(sender_psid, response) {
   
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message":  response
    };

    // poslat do messengeru 
    request({
        "uri": "https://graph.facebook.com/v10.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
            console.log(`My message: ${response}`);
        } else {
            console.error("Unable to send message:" + err);
        }
    });
  }



module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook
};