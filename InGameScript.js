const socket = io(URL);
let RoomInfo;
let OtherPlayer
let Token;
let MyNumber;
let submitButton;
let TitleTurn;
let MyTurn;

socket.on('connect',()=>{
    // console.log(socket.id)
    UpdateToken();
})

socket.on('startGuessing',()=>{
    document.getElementById('canvas1').style.display='none';
    document.getElementById('GameCanvas').style.display='flex';
})

socket.on('MyTurn',()=>{
    TitleTurn.innerHTML='Your turn';
    MyTurn=true;
    submitButton.disabled =false;
})

socket.on('EndOfTurn',()=>{
    MyTurn=false;
    TitleTurn.innerHTML=`${OtherPlayer.name}\'s turn`
    submitButton.disabled =true;

})

socket.on('guessResult',(res)=>{
    let el
    if(MyTurn)el='Table1';
    else el='Table2';
    let table=document.getElementById(el);
    let temp=`                    
    <div class='Record'>
        <p class='guessNum'>
            ${res.guess}
        </p>
        <img src="bull.png" alt="">
        <p class='bullCount'>
            ${res.bikove}
        </p>
        <img src="cow.png" alt="">
        <p class='cowCount'>
            ${res.kravi}
        </p>
    </div>`
    table.innerHTML+=temp;
    // console.log('OK')
})

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

window.onload=function(){
    RoomInfo=JSON.parse(sessionStorage.getItem('RoomInfo'));
    if(RoomInfo==null)window.location.href='./index.html';
    OtherPlayer=RoomInfo.players.find(p=>{return p.token!=Token;});
    document.getElementById('Title2').innerHTML=OtherPlayer.name+'\'s guesses';
    submitButton=document.getElementById('SubmitButton');
    TitleTurn=document.getElementById('TurnTitle');
    sessionStorage.removeItem('RoomInfo');
}

function SelectNum()
{
    let num=document.getElementById('NumInput').value.trim();
    if(!CheckNumber(num))return;
    MyNumber=num;
    document.getElementById('numCont').children[0].innerHTML=`Your number: ${num}`
    socket.emit('SelectNumber',RoomInfo,Token,num);
}

function CheckNumber(num)
{
    if(num==''){alert('Enter a number');return false;}
    else if(!num.split('').every((digit)=>{return digit>='0'&&digit<='9'})){alert('Number must contain only digits');return false;}
    else if(num.length!=4){alert('Number must be 4 digits long');return false ;}
    else
    {
        num=num.split('');
        for(let i=0;i<4;i++)
            for(let j=i+1;j<4;j++)
                if(num[i]==num[j])
                    {console.log(num);alert('Number can\'t have duplicates');return false;}
        if(num[0]=='0'){alert('Number can\t start with 0');return false;}        
    }
    return true;
}

function SubmitGuess()
{
    let guess=document.getElementById('SubmitInput').value;
    if(!CheckNumber(guess))return;
    socket.emit('GuessNumber',RoomInfo.code,Token,guess);
    console.log('Working');
}