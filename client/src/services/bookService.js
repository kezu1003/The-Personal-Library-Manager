import axiosInstance from '../api/axiosConfig';

export const searchBooks = async (query, page = 1, filters = {}) => {
  const { freeEbooks, printType } = filters;
  
  let url = `/books/search?query=${query}&page=${page}`;
  
  if (freeEbooks) {
    url += '&filter=free-ebooks';
  }
  
  if (printType && printType !== 'all') {
    url += `&printType=${printType}`;
  }
  
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getMyBooks = async () => {
  const response = await axiosInstance.get('/books');
  return response.data;
};

export const saveBook = async (bookData) => {
  const response = await axiosInstance.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, updateData) => {
  const response = await axiosInstance.put(`/books/${id}`, updateData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await axiosInstance.delete(`/books/${id}`);
  return response.data;
};

