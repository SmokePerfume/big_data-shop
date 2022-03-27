//MEMBER_LIST db에서 받아온 내역
console.log("/public/admin/member/mem_list.js 파일 추가됨(defer 로 지정되어 화면이 다 로드되고 시작됨)");
const memList=document.getElementById("memList");
let html="";
let updateUrl="";
let deleteUrl="";
MEMBER_LIST.forEach(mem => {
    html+="<tr>";
    for(let key in mem){
        html+=`<td>${mem[key]}</td>`;
    }
    html+=`<td><button type="button" class="table_Btn" onclick="window.location.href='/admin/mem/read/${mem.ID}/form'">수정</button></td>`;
    html+=`<td><button type="button" class="del_Btn table_Btn" onclick="deleteMem('${mem.ID}')">삭제</button></td>`;
    html+="</tr>";
});

function deleteMem(del_id){
    console.log(del_id);
    let url=`/admin/mem/delete/${del_id}`;
    fetch(url,{method:"DELETE"})
    .then((res)=>{return res.json()})
    .then((delete_obj)=>{alert(delete_obj["delete"]+":"+delete_obj["msg"])})
}

// mem_del.onsubmit=(e)=>{
//     e.preventDefault();
//     let id=mem_del.id;
//     let url=`/mem/${id.value}/ajax/del`;
//     fetch(url,{method:"DELETE"})
//     .then((res)=>{return res.json()})
//     .then((delete_obj)=>{alert(delete_obj["delete"]+":"+delete_obj["msg"])})
// }

memList.innerHTML=html;
