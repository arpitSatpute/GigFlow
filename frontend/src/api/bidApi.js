import axios from './axios';

export const bidApi = {
  createBid: async (bidData) => {
    const response = await axios.post('/api/bids', bidData);
    return response.data;
  },

  getBidsForGig: async (gigId) => {
    const response = await axios.get(`/api/bids/${gigId}`);
    return response.data;
  },

  getMyBids: async () => {
    const response = await axios.get('/api/bids/my-bids');
    return response.data;
  },

  hireBid: async (bidId) => {
    const response = await axios.patch(`/api/bids/${bidId}/hire`);
    return response.data;
  },
};