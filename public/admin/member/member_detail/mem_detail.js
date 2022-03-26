
SELECT_ID_MEMBER.forEach((item)=>{
    for(let key in item){
        const inputMem=memForm[key];
        inputMem.value=item[key]
    }
})
