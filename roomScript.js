const socket = io(URL);
let RoomInfo;
let Token;

socket.on('connect',()=>{
    // console.log(socket.id)
    UpdateToken();
    loadInfo();    
    if(Token!=RoomInfo.creator.token)
    {
        document.getElementById('readyButton').style.display='none';
    }

})

socket.on('updatePlayers',(roomInfo)=>{
    FillPlayers(roomInfo);
})

socket.on('startGame',()=>
{
    sessionStorage.setItem('RoomInfo',JSON.stringify(RoomInfo));
    window.location.href='./InGame.html'
    console.log('game started')
})

window.onload=function()
{
}

function UpdateToken()
{
    Token=sessionStorage.getItem('id');
    socket.emit('update',Token,socket.id);
}

function loadInfo()
{
    let title=document.getElementById('Title');
    let obj=JSON.parse(sessionStorage.getItem('roomCode'))
    if(obj==null)window.location.href='./index.html'
    RoomInfo=obj;
    try {
        title.innerHTML+=obj.code;        
        FillPlayers(obj);
    } catch (error) {
        console.log(error)
    }
    sessionStorage.removeItem('roomCode');
}

function FillPlayers(obj)
{
    RoomInfo=obj;
    let table=document.getElementById('playersTable');
    while (table.firstChild) {
        table.removeChild(table.lastChild);
    }
    obj.players.forEach(p=>{
        let newDiv=document.createElement('div')
        newDiv.innerHTML=p.name;
        if(p.ready)newDiv.innerHTML+='[Ready]';
        table.appendChild(newDiv);
    })
}

function LeaveRoom()
{
    socket.emit('leave-room',Token,RoomInfo.code)
    window.location.href='./index.html';
}

function Start()
{
    socket.emit('Start',RoomInfo.code)
}