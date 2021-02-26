import React from 'react';
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { setChat } from './features/chatSlice';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from './axios';
import Pusher from "pusher-js"

const pusher = new Pusher('d267707ca5f5b5553d08', {
    cluster: 'ap2'
  });

function SidebarChat({id,chatName,timestamp}) {
    const dispatch=useDispatch();
    const [lastMsg,setLastMsg]=useState("");
    const [lastPhoto,setLastPhoto]=useState("");
    const [lastTimestamp,setLastTimestamp]=useState("");
    const getSidebarElement = ()=>{
        axios.get(`/get/lastMessage?id=${id}`).then((res)=>{
            setLastMsg(res.data.message);
            setLastPhoto(res.data.user.photo);
            setLastTimestamp(res.data.timestamp);
        })
        
    }
    useEffect(()=>{
        getSidebarElement();
        const channel = pusher.subscribe('messages');
        channel.bind('newMessage', function(data) {
        getSidebarElement()
    });
       
    },[id])
    return (
        <div
            onClick={()=>{
                dispatch(
                    setChat({
                        chatId: id,
                        chatName: chatName
                    })
                )
            }}
        className="sidebarChat">
            <Avatar src={lastPhoto} />
            <div className="sidebarChat__info">
                <h3>{chatName}</h3>
                <p>{lastMsg}</p>
                <small>{new Date(parseInt(lastTimestamp)).toUTCString()}</small>
            </div>
        </div>
    )
}

export default SidebarChat