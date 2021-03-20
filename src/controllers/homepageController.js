import request from "request";
require("dotenv").config();
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;


let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};
let getFacebookUserProfile = (req, res) => {

    return res.render("profile.ejs");
};
let getInfo = (req, res) => {

    return res.render("info.ejs");
};
let getNavod = (req, res) => {

    return res.render("navod.ejs");
};
let setUpUserFacebookProfile = (req, res) => {
    let data = {
            "get_started":{
              "payload":"GET_STARTED"},
              "persistent_menu": [
                {
                    "locale": "default",
                    "composer_input_disabled": false,
                    "call_to_actions": [
                        {
                            
                            "type": "postback",
                            "title": "Talk to an agent",
                            "payload": "CARE_HELP"
                        },
                       
                    ]
                }
            ],
            "whitelisted_domains":[ process.env.SERVER_URL ]
    };
       
    request({
        "uri": `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${FB_PAGE_TOKEN}`,
        "method": "POST",
        "json": data
        
    }, (err, res, body) => {
        console.log(`-----body---`)
        console.log(body)
        console.log(FB_PAGE_TOKEN)
        console.log(`-----body---`)
        if (!err) {
            return res.status(200).json({
                message: "setup done"
            })
        } else {
            console.res.status(500).json({
                "message": "Error from the node server"
            })
        }
    });
    return res.status(200).json({
        message:"OK"
    });
};
module.exports = {
    getHomepage: getHomepage,
    getInfo: getInfo,
    getNavod: getNavod,
    getFacebookUserProfile: getFacebookUserProfile,
    setUpUserFacebookProfile: setUpUserFacebookProfile
};



