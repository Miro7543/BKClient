const socket = io("https://bikove-kravi.herokuapp.com/");
let RoomInfo;
let Token;

socket.on('connect',()=>{
    // console.log(socket.id)
    UpdateToken();
})

socket.on('updatePlayers',(roomInfo)=>{
    FillPlayers(roomInfo);
})

window.onload=function()
{
    loadInfo();
}

function UpdateToken()
{
    Token=sessionStorage.getItem('id');
    if(Token==null)
    {
        Token=ID();
        sessionStorage.setItem('id',token);
    }
    socket.emit('update',Token,socket.id);
}

function loadInfo()
{
    let title=document.getElementById('Title');
    let obj=JSON.parse(sessionStorage.getItem('roomCode'))
    if(obj==null)window.location.href='./index.html'
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
        table.appendChild(newDiv);
    })
}

function LeaveRoom()
{
    socket.emit('leave-room',Token,RoomInfo.code)
    window.location.href='./index.html';
}

function Ready()
{

    socket.emit('Ready',Token,)
}