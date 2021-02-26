import React, { useEffect, useState } from 'react';
import "./Sidebar.css";
import SearchIcon from "@material-ui/icons/Search";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import { Avatar, IconButton } from "@material-ui/core";
import SidebarChat from './SidebarChat';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { auth } from './firebase';
import axios from "./axios";
import Pusher from "pusher-js"

const pusher = new Pusher('d267707ca5f5b5553d08', {
    cluster: 'ap2'
  });
function Sidebar() {
    const user= useSelector(selectUser);
    const [chats,setChats]=useState([]);

    const getChat=()=>{
        axios.get("/get/conversationList")
        .then((res)=>{
            setChats(res.data)
        })
    }

    useEffect(()=>{
        getChat();
        const channel = pusher.subscribe('chats');
        channel.bind('newChat', function(data) {
      getChat();
    });
        
    },[]);

    const addChat =()=>{
        const chatName =prompt("Plz enter a chat name");
        const firstMsg = prompt("Plz send a welcome message")
        if(chatName && firstMsg){
            let chatId="";
            axios.post("/new/conversation",{
                chatName:chatName
            }).then((res)=>{
                chatId = res.data._id
            }).then(()=>{
                axios.post(`/new/message?id=${chatId}`,{
                    message:firstMsg,
                    timestamp:Date.now(),
                    user:user,
                })
            })            
        }
        }
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar
                    onClick={()=>auth.signOut()} 
                    src={user.photo} 
                    className="sidebar__avatar"/>
                <div className="sidebar__input">
                    <SearchIcon />
                    <input type="text" placeholder="Search"/>
                </div>
                <IconButton 
                    className="sidebar__inputButton" variant="outlined">
                    <RateReviewOutlinedIcon onClick={addChat} />
                </IconButton>
            </div>
            <div className="sidebar__chats">
                {chats.map(({id,name,timestamp}) =>(
                    <SidebarChat
                        key={id}
                        id={id}
                        chatName={name} 
                        timestamp={timestamp}  
                    />
                ))}
            </div>
        </div>
    )
}

export default Sidebar