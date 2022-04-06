const fs=require("fs");
const mysql=require("mysql");
const con_info={
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "MY_SHOP",
    dateStrings: "date"
}
const express=require("express");
const { log } = require("console");
const { resolve } = require("path");
const app=express(); 
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use() 미들웨어 : 요청이 먼저 검사를 실시하고 요청으로 보내는 것 [검문소] 
//모든 정적리소스(css,img,js 등)가 요청이 들어오면 public 폴더에서 찾아서 응답해준다.
app.get("/admin/",(req,res)=>{
    res.sendFile(__dirname+"/admin/index.html");
})
app.get("/customer/",(req,res)=>{
    res.sendFile(__dirname+"/customer/index.html");
})
app.get("/",(req,res)=>{
    console.log(__dirname);
    res.sendFile(__dirname+"/public/customer/index.html");
})
//////////////멤버///////////////
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
app.get("/admin/mem/read/:id/form",async (req,res)=>{
    let sql=`SELECT * FROM MEMBER WHERE ID=?`;
    let conn= await mysqlConn();
    let result=queryResult(conn,sql,req.params.id);
    let data= fsData("./public/admin/member/member_detail/mem_detail.html");
    result= await result;
    data = await data;
    res.write(
        `<script> 
            const SELECT_ID_MEMBER = ${JSON.stringify(result)};
            console.log(SELECT_ID_MEMBER)
        </script>`
    );
    res.write(data)
    res.send()
    conn.end((e)=>{});
})
app.put("/admin/mem/update/:id",async (req,res)=>{
    let conn = await mysqlConn();
    let sqlUpdateMem=`UPDATE MEMBER SET PHONE=?, EMAIL=?, NAME=?, ADDRESS=?,ADDRESS_DETAIL=?,BIRTH=? WHERE ID=?`;
    const rb=req.body;
    const params=[rb.PHONE,rb.EMAIL,rb.NAME,rb.ADDRESS,rb.ADDRESS_DETAIL,rb.BIRTH,req.params["id"]];
    let resultUpd = queryResult(conn,sqlUpdateMem,params);
    resultUpd = await resultUpd; 
    conn.end((e)=>{});
    res.send({update:1,msg:"수정성공"})
})
app.delete("/admin/mem/delete/:id",async (req,res)=>{
    let conn = await mysqlConn();
    let sqldeleteMem=`DELETE FROM MEMBER WHERE ID=?`;
    let resultDel = queryResult(conn,sqldeleteMem,req.params.id);
    resultDel = await resultDel;
    res.send({delete:1,msg:"삭제성공"})
    conn.end((e)=>{})
})

//////////////상품///////////////
app.get("/admin/product/list/:page",async (req,res)=>{
    let sql="SELECT * FROM PRODUCT";
    let conn = await mysqlConn();
    let result = queryResult(conn,sql);
    let data = fsData("./public/admin/product/product_list.html");
    result = await result;
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

//////////////보드///////////////
app.get("/admin/board/list/:page", async(req,res)=>{
    let boa_sql="SELECT * FROM BOARD"
    let mem_sql="SELECT * FROM MEMBER";
    let conn = await mysqlConn();
    let boa_reslt=queryResult(conn,boa_sql);
    let mem_reslt=queryResult(conn,mem_sql);
    let data = fsData("./public/admin/board/board_list.html");
    boa_reslt= await boa_reslt;
    mem_reslt= await mem_reslt;
    data = await data;
    res.write(`
            <script>
            const BOARD_LIST=${JSON.stringify(boa_reslt)}; 
            const MEMBER_LIST=${JSON.stringify(mem_reslt)};
            console.log("MYSQL쿼리 결과 BOARD_LIST : ",BOARD_LIST);
            console.log("MYSQL쿼리 결과 MEMBER_LIST : ",MEMBER_LIST);
            </script>`);
    res.write(data)
    res.send()
    conn.end((e)=>{});
})
app.delete("/admin/board/delete/:id",async (req,res)=>{
    let conn = await mysqlConn();
    let sqldeleteMem=`DELETE FROM BOARD WHERE NUM=?`;
    let resultDel = queryResult(conn,sqldeleteMem,req.params.id);
    resultDel = await resultDel;
    res.send({delete:1,msg:"삭제성공"})
    conn.end((e)=>{})
})
app.put("/admin/board/update/:num",async (req,res)=>{
    let conn = await mysqlConn();
    let sqlUpdateMem=`UPDATE BOARD SET MEMBER_ID=?, TITLE=?, CONTENTS=? WHERE NUM=?`;
    const rb=req.body;
    const params=[rb.MEMBER_ID,rb.TITLE,rb.CONTENTS,req.params["num"]];
    console.log(params);
    let resultUpd = queryResult(conn,sqlUpdateMem,params);
    resultUpd = await resultUpd; 
    conn.end((e)=>{});
    res.send({update:1,msg:"수정성공"})
})


app.listen(1234,()=>{
    console.log("http://127.0.0.1:1234 대기중");
});

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


