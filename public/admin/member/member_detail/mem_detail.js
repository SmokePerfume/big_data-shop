const cancelBtn = document.getElementById("cancelBtn")

cancelBtn.addEventListener("click",()=>{
    window.location.href='/admin/mem/list/1';
})

SELECT_ID_MEMBER.forEach((item)=>{
    for(let key in item){
        const inputMem=memForm[key];
        inputMem.value=item[key];
    }
})

