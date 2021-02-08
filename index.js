const express = require("express");//reuired for node js initialisation
const app = express();
const bodyParser = require("body-parser");//for using middleware
const mongoose = require('mongoose');//act as a mediator b/w db & server
var nodemailer = require('nodemailer');
const axios = require('axios'); // to fetch third party api's
const Friend = require('./friend');//model import

//mongodb+srv://gaurav_typ:Gaurav@123@cluster0.3fngu.mongodb.net/Friends?retryWrites=true&w=majority
//for using middleware
app.use(bodyParser.json());
const port = process.env.PORT || 7000;

const connect = async ()=>{ //async function
    try {
        const connection = await mongoose
        .connect(
            'mongodb+srv://gaurav_typ:Gaurav@123@cluster0.3fngu.mongodb.net/Friends?retryWrites=true&w=majority', 
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        console.log("Connected");
    } catch (err) {
        console.log("Not Connected");
    }
} 
connect();



//Object Array
const Friends = [
    {id:"1", name:"Gaurav", age:"22"},
    {id:"2", name:"Rahul", age:"20"},
    {id:"3", name:"Rohit", age:"18"},
    {id:"4", name:"XYZ", age:"25"},
]

//get request
app.get('/getFriendByIdAndName/:id:name',(req,res)=>{
    const id = req.params.id;
    const name = req.params.name;

    const getFriend = Friends.filter((item)=>(item.id===id)&&(item.name===name));
    res.send(getFriend);
    //res.send("Hello World");
})


app.get('/getFriend',(req,res)=>{
    console.log("Enter");
    res.json(Friends);
})
/*app.post('/addFriend',(req,res)=>{
    console.log(req.body);
    const body = req.body;
    Friends.push(body);
    res.status(200).json(Friends);
})*/
// using get api method
app.get('/getFriendsFromDb',async (req,res)=>{
    try {
        const friend = await Friend.find();
        if(friend.length===0){
            return res.status(400).json("No User Found");
        }
        res.status(200).json(friend);
    } catch (err) {
        console.log("error", err);
    }
})

/*app.get('/getFriendByIdFromDb/:id', async(req,res)=>{
    let id = req.params.id;
    const getFriend = await Friend.findById(id);
    res.status(200).json(getFriend);
    console.log(getFriend);
})

app.get('/getFriendByNameFromDb', async(req,res)=>{
    //let name = req.params.name;
    var query = { name: "Gaurav Singh" };
    const getFriendbyName = await Friend.find(query);
    res.status(200).json(getFriendbyName);
    console.log(getFriendbyName);
})

app.get('/getFriendByAgeBelow20FromDb', async(req,res)=>{
    Friend.find((err , friends)=> {
        const query = friends.filter((item)=>(item.age<=20));
        res.status(200).json(query);
        console.log(query);
    })
})*/

//middleware => works b/w req and res
const checkAge = (req,res,next)=>{
    const age = req.body.age;
    if(age>18){
        next();
    }else{
        res.json("Age must br greater than 18");
    }
};
  // creating new data in DB by Post Req
app.post('/addFriend',checkAge, async (req,res)=>{
    try {
        
        const data = req.body;
        const isExist = await Friend.findOne({email:data.email})
        if(isExist){
            res.status(400).json("User Already Exists"); //404 bad request
        }else{
            const newFriend = new Friend(data);
            await newFriend.save(); //for saving in Db
            res.status(201).json(newFriend);
        }
        
    } catch (error) {
        console.log("error",error);
    }
})


// using put/update by using id for any updation
app .put('/update/:id',async (req,res)=>{
    const _id = req.params.id;
    const data = req.body;
    try {
        const user = await Friend.findByIdAndUpdate(
            {_id},
            {$set:data}, 
            {new:true}
        );
        if(!user){
            res.status(404).json("user not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("error", error);
    }
});


//delete by id 
app.delete('/deleteBYId/:id', async(req,res)=>{
    const _id = req.params.id;
    try {
        const user = await Friend.findByIdAndDelete(_id);
        if(!user){
            res.status(404).json("user not exist");
        }
        res.status(200).json("User Deleted");
    } catch (error) {
        console.log("error",error);
    }
});

/*app.delete('/deleteFriend',(req,res)=>{
    Friend.find((err,friends)=>{
        if(err){
            console.log(err);
        }else{
            console.log(friends);
            friends.pop();
            res.send(friends);
        }
    })
})*/

//sending mail via nodemailer using get req
app.get('/sendmail', async(req,res)=>{
    var transporter = await nodemailer.createTransport({
        host: "outmail.abc.co.th",
        secure: false,

        service: 'gmail',
        auth: {
          user: 'singhgaurav1998gs@gmail.com',
          pass: 'megauravbanna'
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      
      var mailOptions = {
        from: 'singhgaurav1998gs@gmail.com',
        to: 'singhbanna1998gs@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
})

//78f7f79609b700854ad81e0ea2550662  Access Key api weatherstack 

//axios.post('',{data},{headers:{
//    
//}})

//weather api
app.get('/getWeather/:place',async (req,res) => {
    const place = req.params.place;
    try {
        const result = await axios.get(
            `http://api.weatherstack.com/current?access_key=78f7f79609b700854ad81e0ea2550662&query=${place}`
        );
        res.status(200).json(result.data);
    } catch (error) {
        console.log("error",error);
    }
})   





//port Litsen
app.listen(port,()=>{
    console.log(`Port is Accessible on ${port}`);
})