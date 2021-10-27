const socket = io(URL);
let Token;
socket.on('connect',()=>{
    // console.log(socket.id)
    UpdateToken();
})

function checkForRoom(code,name) 
{
    socket.emit('check-for-room',code,free => {
        // console.log('Done')
        if(!free)
        {
            alert('Invalid room code or room is full')
            return;
        }
        else 
        {
            socket.emit('join-room',name,code,Token,roomInfo=>{
                sessionStorage.setItem('roomCode',JSON.stringify(roomInfo));
                window.location.href='InRoom.html';
            })
        }
    });
}

function createRoom()
{
    let name=document.getElementById('Name').value;
    if(name=='')
    {
        alert('Enter a name')
        return;
    }
    socket.emit('create-room',name,Token,info => {
        sessionStorage.setItem('roomCode',JSON.stringify(info));
        window.location.href='InRoom.html';
        
    });
    
}

function joinRoom()
{
    let name=document.getElementById('Name').value;
    let code=document.getElementById('RoomCode').value;
    if(name=='')
    {
        alert('Enter a name')
        return;
    }
    checkForRoom(code,name);
}

window.onload=async function()
{
}

function UpdateToken()
{
    Token=sessionStorage.getItem('id');
    if(Token==null)
    {
        Token=ID();
        sessionStorage.setItem('id',Token);
    }
    socket.emit('update',Token,socket.id);

}

function ID() {
    return Math.random().toString(36).substr(2, 4);
}