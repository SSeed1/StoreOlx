'use strict';
const express = require('express');
const app=express();
const mysql=require('mysql');
const Cryptr= require('cryptr');
const session=require('express-session');
const crypt= new Cryptr('12345678');
app.use(session({secret:'random generated key',}));
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'market'
});
con.connect(error=>{
    if(error){
        console.log(error.message);
    }else{
        console.log("MYSQL Connected");
    }
});
app.use(express.static('public'));

function setCurrentUser (req,res,next){
	if (req.session.loggedIn){
		var sql = "SELECT * FROM users WHERE uid=?"
		var params = [req.session.userId]
		con.query(sql,params,(err,row)=>{
			if(row !== undefined){
				res.locals.currentUser=row
			}
			return next()
		});
	} else {
		return next()
	}
}
function checkAuth(req,res,next){
	if(req.session.loggedIn){
		return next()
	}else {
		res.redirect("/api/login")
	}
}
app.use(setCurrentUser());
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
app.post('/api/login',function(req,res){
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
        req.session.userId = row["id"];
		req.session.loggedIn = true;
    });
});
app.post('/api/register',function(req,res){
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
app.get('/api/items',function(req,res){
    con.query("SELECT * FROM items",function(error,result,fields){
        if(error)throw error;
        return res.json({error:false,data:result,message:'itmes list'});
    });
});
app.get('/api/items/:id',function(req,res){
    let items_id=req.params.id;
    if(!items_id){
        return  res.status(400).send({error:true,message:'Please provide items id'});
    }
    con.query("SELECT * FROM items WHERE id=?",items_id,function(error,result,fields){
        if(error)throw error;
        return res.json({error:false,data:result[0],message:'items list id'});
    });
});
app.put('/api/items/:id',function(req,res){
    let items_id=req.body.id;
    let
    if(!items_id){
        return res.status(400).send({error:true,message:'Title should contain at least 3 characters'});

    }
    con.query("UPDATE items SET ")
})
app.listen(3000,()=>{
    console.log('node express work on 3000')
});