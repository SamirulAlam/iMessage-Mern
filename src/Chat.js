import React, { useState} from 'react';
import "./Chat.css";
import { IconButton } from "@material-ui/core";
import MicNoneIcon from "@material-ui/icons/MicNone";
import Message from './Message';
import { useSelector } from 'react-redux';
import { selectChatId, selectChatName } from './features/chatSlice';
import { useEffect } from 'react';
import { selectUser } from './features/userSlice';
import FlipMove from "react-flip-move";
import axios from './axios';
import Pusher from "pusher-js"


const pusher = new Pusher('d267707ca5f5b5553d08', {
    cluster: 'ap2'
  })
function Chat() {

    const [input,setInput]=useState("");
    const [messages,setMessages]=useState([]);
    const user=useSelector(selectUser);
    const chatName=useSelector(selectChatName);
    const chatId=useSelector(selectChatId);

    const getConversation=(chatId)=>{
        if(chatId){
            axios.get(`/get/conversation?id=${chatId}`).then((res)=>{
                setMessages(res.data[0].conversation)
            })
        }
    }
    useEffect(()=>{
        pusher.unsubscribe("messages")
        
       getConversation(chatId);

       const channel = pusher.subscribe('messages');
    channel.bind('newMessage', function(data) {
      getConversation(chatId)
    });
    },[chatId])
    const sendMessage=(e)=>{
        e.preventDefault();
        axios.post(`/new/message?id=${chatId}`,{
            message:input,
            timestamp:Date.now(),
            user:user
        })
        setInput("");
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <h4>To:<span className="chat__name">{chatName}</span></h4>
                <strong>Details</strong>
            </div>

            <div className="chat__messages">
                <FlipMove>
                    {messages.map(({_id,user,message,timestamp})=>(
                        <Message
                            key={_id}
                            id={_id}
                            sender={user}
                            message={message}
                            timestamp={timestamp}
                        />
                    ))}
                </FlipMove>
            </div>

            <div className="chat__input">
                <form action="">
                    <input 
                        value={input}
                        onChange={(e)=>setInput(e.target.value)} 
                        placeholder="iMessage" 
                        type="text"/>
                    <button onClick={sendMessage}>Send</button>
                </form>
                <IconButton>
                    <MicNoneIcon  className="chat__mic"/>
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
