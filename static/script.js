document.addEventListener('DOMContentLoaded', () => {
    
    //console.log('here2' + localStorage.getItem('ChannelIn'))
    document.querySelector('#an').innerHTML += localStorage.getItem('ChannelIn');
    const r = new XMLHttpRequest();
    r.open('POST', '/ChannelList');  
    r.onload = () => {
        const data = JSON.parse(r.responseText);
        const cl = data.newList;

    /*    for(let i=0; i<cl.length; i++){
            const li = document.createElement('li');
            li.innerHTML = `<a href="{{url_for('chat')}}"> ${cl[i]} </a> `;
            document.querySelector('#ChannelList').append(li);
        }

    /*    const links = document.getElementsByTagName('a');
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', (event) => {
                    // Extract innerHTML of clicked anchor tag
                const channelI = event.target.innerHTML;
                console.log('here' + channelI);
                        // Store channelName in localStorage
                if (channelI != 'logout'){
                    localStorage.setItem('ChannelIn', channelI);
                }
            });  
        } */
        if(data.ChatEntries != null){
            console.log('in data.chat' + data.ChatEntries);
            for(let i=0; i < data.ChatEntries.length; i++){
                text = data.ChatEntries[i].text; 
                user = data.ChatEntries[i].user;
                d = data.ChatEntries[i].date;
                const li = document.createElement('li');
                li.innerHTML = `text: ${text} user: ${user} date: ${d}`;
                document.querySelector('#AllTexts').append(li);                                  
            }   
        }          
    }
    var d = new FormData();
    d.append('c', localStorage.getItem('ChannelIn')); 
    r.send(d)   
        
    document.querySelector('#logout').addEventListener('click', (event) =>{
        localStorage.removeItem('user');
        localStorage.removeItem('ChannelIn');
    }) 

    document.querySelector('#back').addEventListener('click', (event) => {
        localStorage.removeItem('ChannelIn');
    })

    const socket = io();
    socket.on('connect', () => {
        console.log('hello');                    
        document.querySelector('#submitid').onclick = () => {
            const text = document.querySelector('#t').value;
            var dt = new Date();
            document.querySelector('#t').value = ''

            socket.emit('ChatEntry', {'text': text, 'user': localStorage.getItem('user'), 'channel': localStorage.getItem('ChannelIn'), 'date': dt});
        };

    });


    socket.on('DisplayText', data => {

        console.log('hello from display');
        console.log(data.dict);
        l = data.dict.length
        text = data.dict[l - 1].text; 
        user = data.dict[l - 1].user;
        d = data.dict[l - 1].date;
        const li = document.createElement('li');
        li.innerHTML = `text: ${text} user: ${user} timestamp: ${d}`;
        document.querySelector('#AllTexts').append(li);                                  
        

    })



    
}
);