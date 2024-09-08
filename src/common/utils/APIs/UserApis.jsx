import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8080"
// axios.defaults.baseURL = "https://cravehub.online"
axios.defaults.baseURL = "http://139.59.13.146:8080"


export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
}  

export const setAuthToken = (token) => {
    return window.localStorage.setItem("auth_token",token);
}


const request = (method, url, data) => {
    let headers = {};
    const formData = new FormData();

    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};

        if (data.file) {
            console.log('file exists', data.file);
            // headers['Content-Type'] = 'multipart/form-data';

            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            return axios({
                method: method,
                url: url,
                headers: headers,
                data: formData,
            });
        }
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
    });
};


export const createPost = (method, url, data) => {
    let headers = {};
    const formData = new FormData();

    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
        
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        return axios({
            method: method,
            url: url,
            headers: headers,
            data: formData,
        });
    }

    return axios({
                method: method,
                url: url,
                headers: headers,
                data: formData,
            });

}




export default request;