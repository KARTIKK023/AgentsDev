import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    Messages:[],
    selectedMessage:null
  },
  reducers: {
    setMessages: (state, action) => {
      state.Messages = action.payload;
    },
    // addMessages: (state, action) => {
    //   state.Messages.unshift(action.payload);
    // },
    setSelectedMessage: (state,action) => {
      state.selectedMessage = action.payload;
    },
  },
});

export const {
  setMessages,
//   addMessages,
  setSelectedMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
