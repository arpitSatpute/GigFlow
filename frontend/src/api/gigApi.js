import axios from './axios';

export const gigApi = {
  getAllGigs: async (searchQuery = '') => {
    const response = await axios.get(`/api/gigs?search=${searchQuery}`);
    return response.data;
  },

  getGigById: async (id) => {
    const response = await axios.get(`/api/gigs/${id}`);
    return response.data;
  },

  createGig: async (gigData) => {
    const response = await axios.post('/api/gigs', gigData);
    return response.data;
  },

  updateGig: async (id, gigData) => {
    const response = await axios.put(`/api/gigs/${id}`, gigData);
    return response.data;
  },

  deleteGig: async (id) => {
    const response = await axios.delete(`/api/gigs/${id}`);
    return response.data;
  },

  getMyGigs: async () => {
    const response = await axios.get('/api/gigs/my-gigs');
    return response.data;
  },
};