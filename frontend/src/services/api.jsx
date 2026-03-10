//fontend/src/services/api.jsx
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ USE YOUR PC IP ADDRESS (NOT localhost)
const API_URL = 'http://10.15.231.162:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 600000
});

// Attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ================= AUTH APIs =================
export const authAPI = {
  sendOTP: (data) => api.post('/auth/send-otp', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
};

// ================= USER APIs =================
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePreferences: (data) => api.put('/user/preferences', data),
  enrollCourse: (courseId) => api.post(`/user/enroll/${courseId}`),
  getStats: () => api.get('/user/stats'),
};

// ================= COURSE APIs =================
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getCoursesByCategory: (category) =>
    api.get(`/courses/category/${category}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// ================= VIDEO APIs =================
export const videoAPI = {

  getCourseVideos: (courseId) =>
    api.get(`/videos/course/${courseId}`),

  createVideo: (data) =>
    api.post('/videos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  updateVideo: (id, data) =>
    api.put(`/videos/${id}`, data),

  deleteVideo: (id) =>
    api.delete(`/videos/${id}`),

};

// ================= PROGRESS APIs =================
export const progressAPI = {
  getProgress: (courseId) =>
    api.get(`/progress/${courseId}`),
  markVideoComplete: (data) =>
    api.post('/progress/video-complete', data),
  submitQuiz: (data) =>
    api.post('/progress/quiz-complete', data),
  getAllProgress: () =>
    api.get('/progress/user/all'),
};

// ================= NOTES APIs =================
export const noteAPI = {
  getAllNotes: () => api.get('/notes'),
  getCourseNotes: (courseId) =>
    api.get(`/notes/course/${courseId}`),
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, data) =>
    api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

// ================= CERTIFICATE APIs =================
export const certificateAPI = {
  getAllCertificates: () =>
    api.get('/certificates'),
  generateCertificate: (courseId) =>
    api.post(`/certificates/generate/${courseId}`),
  verifyCertificate: (certificateId) =>
    api.get(`/certificates/verify/${certificateId}`),
  downloadCertificate: (certificateId) =>
  api.get(`/certificates/download/${certificateId}`, {
    responseType: "blob",
  }),
};

// ================= CHATBOT APIs =================
export const chatbotAPI = {
  ask: (data) => api.post('/chatbot/ask', data),
  codeHelp: (data) =>
    api.post('/chatbot/code-help', data),
};

// ================= UPLOADER APIs =================
export const uploaderAPI = {
  getCourses: () => api.get('/uploader/courses'),
  getStats: () => api.get('/uploader/stats'),
  getEarnings: () => api.get('/uploader/earnings'),
  togglePublish: (id) =>
    api.put(`/uploader/course/${id}/publish`),
};

// ================= CODING PRACTICE APIs =================

export const problemAPI = {

  getLanguages: () => api.get("/problems/languages"),

  getProblems: (language) =>
    api.get(`/problems?language=${language}`),

  getProblem: (id) =>
    api.get(`/problems/${id}`),

};

export const codeAPI = {

  runCode: (data) =>
    api.post("/code/run", data),

};

export const leaderboardAPI = {

  getLeaderboard: () =>
    api.get("/leaderboard"),

};
export default api;
