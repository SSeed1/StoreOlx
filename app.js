'use strict';
const express = require('express');
const app=express();
const mysql=require('mysql');
const Cryptr= require('cryptr');
const crypt= new Cryptr('12345678');
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'market'
});
con.connect(error=>{
    if(error){
        console.log(error.message)
    }else{
        console.log("MYSQL Connected")
    }
});
app.use(express.static('public'));
app.get('/',function(req,res){
    con.query(
        'SELECT * FROM users',
        function(err,res){
          if(err) throw err;
            console.log(res);
        }
    );
    console.log("WORK");
    res.send("Heloo from ROOOOT");
});
app.post('/login',function(req,res){
    let param=[
        req.body.username,
        req.body.password
    ]
    let sql="SELECT * FROM users WHERE username=? and password=?";
    con.query(sql,param,(error,result)=>{
        if(error){
            res.status(422)
            res.send("error"+error.message)
        };
        if(result.length>0){
            res.json({
                message:"Logged",
                token:crypt.encrypt(result[0].id_user),
                data:result
            });
        }
        else{
            res.json({
                message:"Invalid username/password"
            });
        }
    });
});
app.post('/register',function(req,res){
    let param=[
        req.body.phone,
        req.body.name,
        req.body.email,
        req.body.password
    ]
    let sql = "INSERT INTO users(phone,name,email,password) VALUES (?,?,?,?)"
    con.query(sql,param,(error,result)=>{
        if(error){
            res.status(422)
            res.send("error"+error.message)
            return;
        }
        if(result.length>0){
            res.json({
                message:"Registred",
                token:crypt.encrypt(result[0].id_user),
                data:result
            });
        }
        else{
            res.json({
                message:"Wrong cureent password"
            })
        }
    });
});


app.listen(3000,()=>{
    console.log('node express work on 3000')
});