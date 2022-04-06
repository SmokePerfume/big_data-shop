const boardList=document.getElementById("boardList"); // 출력할 장소인 ul
const board_clone=boardList.querySelector(".board_clone") // li 복사본
const board_regist_Btn=document.getElementById("board_regist_Btn"); //등록하기 C
const board_print_Btn=document.getElementById("board_print_Btn"); //출력하기 R
const board_update_Btn=document.getElementById("board_update_Btn"); //수정하기 U
const board_delete_Btn=document.getElementsByClassName("board_delete_Btn")//삭제하기 D
const board_choice_Btn=document.getElementsByClassName("board_choice_Btn")//선택하기

board_print_Btn.addEventListener("click",boardListPrint);
board_regist_Btn.addEventListener("click",boardListRegist);
board_update_Btn.addEventListener("click",boardListUpdate)

const BOARD_CREATE_URL="/board/create.do";
const BOARD_DELETE_URL="/board/delete.do";
const BOARD_UPDATE_URL="/board/update.do";

const FormData=function(member_id,title,contents){
    this.member_id=member_id;
    this.title=title;
    this.contents=contents;
} 
boardListPrint();
cateListPrint();
//글 확인 (완료)
function boardListPrint(){
    boardList.innerHTML="";
    BOARD_LIST.forEach((item)=>{
        const item_node=board_clone.cloneNode(true);
        item_node.className="";
        for(let key in item){
            const node=item_node.querySelector("."+key)
            if(node) node.innerText=item[key];
            //글 삭제 생성마다 이벤트를 넣어준다
            const item_del=item_node.querySelector(".board_delete_Btn"); 
            const item_choice=item_node.querySelector(".board_choice_Btn"); 
            item_del.addEventListener("click",boardListDelete);
            item_choice.addEventListener("click",boardListChioce);
            boardList.append(item_node);
        }
    });
}   
//글 등록
async function boardListRegist(){        
    const formData=new Object();
    for(let key of boardForm){
        if ((key.name && key.value)&&(key!="NUM")) { //NUM정보 제외
            console.log(key);
            formData[key.name]=key.value;
        }
    }
    const result=await BoardCreateAjax(formData);
    //성공하면 이페이지 새로 고침 window.loacation.reload();
    //0이면 (변경 없음)
    //실패 -1 "빈 데이터를 확인하거나 통신장애입니다."
    console.log("html의 result결과",result);
    alert(result.msg);
    if(result.affectedRows>0){
        window.location.reload();
    }else if(result.affectedRows==0){
        window.location.href="/board/list.do";
    }else{ //-1일때
        //데이터 베이스에 오류내역 저장!
    }

};
//업데이트하는 버튼 (완료)
function boardListUpdate(){ 
    let url=`/admin/board/update/${boardForm.NUM.value}`;
    console.log(url);
    fetch(url,
        {   method:"PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                MEMBER_ID: boardForm.MEMBER_ID.value,
                TITLE: boardForm.TITLE.value,
                CONTENTS: boardForm.CONTENTS.value,
            })
        }
    )
    .then((res)=>{return res.json()})
    .then((update_obj)=>{
        alert("상태 번호"+update_obj["update"]+" : "+update_obj["msg"]); 
        window.location.href='/admin/board/list/1';
    })

}
//아이디 목록 추가 (완료)
function cateListPrint(){
    MEMBER_LIST.forEach((member)=>{
        const option=document.createElement("option");
        option.value=member["ID"];
        option.innerText=member["ID"];
        boardForm.MEMBER_ID.append(option);
    })
}
//글 삭제 (완료)
function boardListDelete(){
    const board_num = this.parentNode.querySelector(".NUM").innerText;
    let url=`/admin/board/delete/${board_num}`;
    fetch(url,{method:"DELETE"})
    .then((res)=>{return res.json()})
    .then((delete_obj)=>{
        alert("상태 번호"+delete_obj["delete"]+" : "+delete_obj["msg"]); 
        window.location.href='/admin/board/list/1';
    })
}
//글 선택 (완료)
function boardListChioce(){
    boardForm.MEMBER_ID.value=this.parentNode.querySelector(".MEMBER_ID").innerText;
    boardForm.TITLE.value=this.parentNode.querySelector(".TITLE").innerText;
    boardForm.CONTENTS.value=this.parentNode.querySelector(".CONTENTS").innerText;
    boardForm.NUM.value=this.parentNode.querySelector(".NUM").innerText;
    boardForm.CONTENTS.focus();
}




