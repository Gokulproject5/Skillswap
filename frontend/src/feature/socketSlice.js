import { createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import {io} from 'socket.io-client'

const  socket = useMemo(()=>io('localhost:8608'),[]);
const initialState = socket
export const socketSlice = createSlice({
    name:"socket",
    initialState,
    reducers:{
        setRoomId: (state,{payload})=>state.value = payload
    }
})