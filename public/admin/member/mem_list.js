//MEMBER_LIST db에서 받아온 내역
console.log("/public/admin/member/mem_list.js 파일 추가됨(defer 로 지정되어 화면이 다 로드되고 시작됨)");
const memList=document.getElementById("memList");
let html=""
MEMBER_LIST.forEach(mem => {
    html+="<tr>";
    for(let key in mem){
        if(key=="ID"){
            html+=`<td><a href="/admin/mem/read/${mem[key]}/form">${mem[key]}</a></td>`;
        }else{
            html+=`<td>${mem[key]}</td>`;
        }
    }
    html+="</tr>";    
});
memList.innerHTML=html;
