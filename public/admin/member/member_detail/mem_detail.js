const cancelBtn = document.getElementById("cancelBtn")
const updateBtn = document.getElementById("updateBtn")
cancelBtn.addEventListener("click",()=>{
    window.location.href='/admin/mem/list/1';
})

SELECT_ID_MEMBER.forEach((item)=>{
    for(let key in item){
        const inputMem=memForm[key];
        inputMem.value=item[key];
    }
})

updateBtn.addEventListener("click",(e)=>{
    e.preventDefault(true);
    let url=`/admin/mem/update/${memForm.ID.value}`;
    fetch(url,
        {   method:"PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                PHONE: memForm.PHONE.value,
                EMAIL: memForm.EMAIL.value,
                NAME: memForm.NAME.value,
                ADDRESS: memForm.ADDRESS.value,
                ADDRESS_DETAIL: memForm.ADDRESS_DETAIL.value,
                BIRTH: memForm.BIRTH.value,
            })
        }
    )
    .then((res)=>{return res.json()})
    .then((update_obj)=>{
        alert("상태 번호"+update_obj["update"]+" : "+update_obj["msg"]); 
        window.location.href='/admin/mem/list/1';
    })

})

