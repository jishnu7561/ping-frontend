import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loggedUser: (() => {
        try {
          return JSON.parse(localStorage.getItem('logged_user') || '');
        } catch {
          return null;
        }
      })(),
      isLoading: false,
      error: null,
      isEnabled:false,
      savedPost:false
}


const authSlice = createSlice ({
    name : "auth",
    initialState,
    reducers : {
        setLoggedUser:(state,action)=>{
            state.loggedUser = action.payload;
            state.isLoading = false;
            state.error = null;   
            localStorage.setItem('logged_user', JSON.stringify(state.loggedUser));         
        },
        setError:(state,action)=>{
            state.error = action.payload;
            state.isLoading=false;
        },
        setIsLoading:(state,action)=>{
            state.error = null;
            state.isLoading = action.payload;
        },
        updateLoggedUser:(state,action)=>{
            state.loggedUser = {
                ...state.loggedUser,
                fullName: action.payload.fullName !== undefined ? action.payload.fullName : state.loggedUser.fullName,
                accountName: action.payload.accountName !== undefined ? action.payload.accountName : state.loggedUser.accountName,
                email: action.payload.email !== undefined ? action.payload.email : state.loggedUser.email,
                imageUrl:action.payload.imageUrl !== undefined ? action.payload.imageUrl : state.loggedUser.imageUrl,
              };
              state.isLoading = false;
              state.error = null;
              localStorage.setItem('logged_user', JSON.stringify(state.loggedUser));
        },
        setIsEnabled:(action,state)=>{
            state.isEnabled = action.payload;
        },
        setSavedPost: (action,state) => {
            state.savedPost = action.payload;
        }
    }
})

export const { setError ,setLoggedUser ,setIsLoading,updateLoggedUser,setIsEnabled,setSavedPost } = authSlice.actions;
export default authSlice.reducer;