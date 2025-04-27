import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AccountPage from './../../components/common/Account';

const initialState = {
    isLoading: false,
    error: null,
    absentStudent: null
};

export const addAttendance = createAsyncThunk('attendance/add', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/attendance/add/', formData, {
            withCredentials: true
        });
        console.log('Add attendance response:', response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const getAttendanceNotification = createAsyncThunk(
    'attendance/getAbsent',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching absent students...');
            const response = await axios.get('http://localhost:9000/api/attendance/getAbsent/', {
                withCredentials: true
            });
            console.log('Absent students response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching absent students:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAttendanceNotification.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAttendanceNotification.fulfilled, (state, action) => {
                console.log('Attendance Slice - Fulfilled:', action.payload);
                state.isLoading = false;
                state.error = null;
                state.absentStudent = action.payload;
            })
            .addCase(getAttendanceNotification.rejected, (state, action) => {
                console.error('Attendance Slice - Rejected:', action.payload);
                state.isLoading = false;
                state.error = action.payload;
                state.absentStudent = null;
            });
    }
});

export default attendanceSlice.reducer;
