const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

mailchimp.setConfig({
  apiKey: "f2404789d18b07afec795ae5c1e66e33-us12",
  server: "us12",
});


const app = express();

app.use(express.static('public'));
app.use(express.urlencoded());

app.get("/", (req,res)=>{
    
    res.sendFile(__dirname + "/index.html");

})

app.post("/", (req,res)=>{

  const data = req.body;

  const listId = "20f2ce3b99";
  const subscribingUser = {
    firstName: data.fName,
    lastName: data.lName,
    email: data.email
  };
  const subscriberHash = md5(subscribingUser.email.toLowerCase());
// add member to mailchimp list
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
  
   }
run();

   // confirm if member was added to list


  async function run() {
    try {
      const response = await mailchimp.lists.getListMember(
        listId,
        subscriberHash
      );
      
      res.sendFile(__dirname+ "/success.html")
  
      console.log(`This user's subscription status is ${response.status}.`);
    } catch (e) {
      if (e.status === 404) {
        res.sendFile(__dirname + "/failed.html")
        console.error(`This email is not subscribed to this list`, e);
      }
    }
  }
  run();

  

    })


  app.post("/failure", (req,res)=>{
    res.redirect("/")
  })

app.listen(3000, ()=> console.log("server running on port 3k"))













// api Key
// f2404789d18b07afec795ae5c1e66e33-us12
// audience id
// 20f2ce3b99