import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers:{
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})



const APIAuthenticatedClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    }
})


APIAuthenticatedClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
(error) => {
    return Promise.reject(error);
});

// Payment gateway helper — call this to initiate payment, then redirect to the returned URL
const initiatePayment = async ({ amount, productId, productName, paymentGateway, customerName, customerEmail, customerPhone }) => {
    const response = await APIAuthenticatedClient.post('/payments/initiate-payment', {
        amount,
        productId,
        productName,
        paymentGateway,    // "esewa" or "khalti"
        customerName,
        customerEmail,
        customerPhone,
    });
    // response.data.url contains the gateway redirect URL
    if (response.data?.url) {
        window.location.href = response.data.url;
    }
    return response.data;
};

export { apiClient, APIAuthenticatedClient, initiatePayment };
