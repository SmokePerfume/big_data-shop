const fs=require("fs");
const mysql=require("mysql");
const con_info={
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "EXPRESS_SHOP"
}

const express=require("express");
const { log } = require("console");
const { resolve } = require("path");
const app=express(); 
app.use(express.static("public"))
//app.use() 미들웨어 : 요청이 먼저 검사를 실시하고 요청으로 보내는 것 [검문소] 
//모든 정적리소스(css,img,js 등)가 요청이 들어오면 public 폴더에서 찾아서 응답해준다.
app.get("/admin/",(req,res)=>{
    res.sendFile(__dirname+"/admin/index.html");
})
app.get("/admin/mem/list/:page",(req,res)=>{
    const conn=mysql.createConnection(con_info);
    conn.connect((e)=>{
        if(e)throw new Error(e.message);
        conn.query("SELECT * FROM MEMBER",(e,result)=>{
            fs.readFile("./public/admin/member/mem_list.html",(e,data)=>{
                if(e){console.log(e);}
                res.write(`
                        <script>
                            const MEMBER_LIST=${JSON.stringify(result)};
                            console.log(MEMBER_LIST)
                        </script>`);              
                res.write(data);              
                conn.end(()=>{})
                res.send();
            })
        })
    })
})
app.get("/admin/product/list/:page",async (req,res)=>{
    let sql="SELECT * FROM PRODUCT";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql);
    let data = fsData("./public/admin/product/product_list.html");
    result = await result; //동시에 데이터를 각각 가져오고 이 때 await한다. (동기화)
    data = await data; 
    res.write(
        `<script>
            const ITEM_LIST=${JSON.stringify(result)};
            console.log(ITEM_LIST);
        </script>`
    )
    res.write(data)
    res.send()
    conn.end((e)=>{});

})

app.get("/admin/mem/read/:id/form",(req,res)=>{
    console.log(req.params["id"]);
    res.send(`<h1>${req.params.id}확인</h1>`)
})



app.listen(1234);


function fsData(path){
    return new Promise((resolve)=>{
        fs.readFile(path,(e,data)=>{
            if(e){console.log(e.message); data="<h1>파일없음</h1>";}
            resolve(data)
        })
    })
}

function mysqlConn(){
    return new Promise((resolve)=>{
        const conn=mysql.createConnection(con_info);
        conn.connect((e)=>{
            if(e){conn.end((e)=>{}); throw new Error("mysql 접속 에러 :"+e.message)}
            resolve(conn);
        })
    })
}

function queryResult(conn,sql,params=[]){
    return new Promise((resolve)=>{
        conn.query(sql,params,(e,result)=>{
            if(e){conn.end((e)=>{}); throw new Error("Query 에러 :"+e.message)}
            resolve(result);
        })
    })
}


