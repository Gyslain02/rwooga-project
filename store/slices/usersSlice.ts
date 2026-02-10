import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';

interface User {
    id: string; // UUID from backend
    email: string;
    full_name: string;
    phone_number: string;
    user_type: 'ADMIN' | 'STAFF' | 'CUSTOMER';
    is_active: boolean;
    date_joined: string;
    updated_at: string;
}

interface UsersState {
    users: User[];
    count: number;
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    count: 0,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ page, search }: { page?: number, search?: string } = {}) => {
    const response = await userService.getUsers(page, search);
    return response.data; // { count, next, previous, results }
});

export const addUser = createAsyncThunk('users/addUser', async (userData: any) => {
    const response = await userService.createUser(userData);
    return response.data;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, userData }: { id: string | number, userData: any }) => {
    const response = await userService.updateUser(id, userData);
    return response.data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (id: string | number) => {
    await userService.deleteUser(id);
    return id;
});

export const toggleUserStatus = createAsyncThunk('users/toggleUserStatus', async ({ id, is_active }: { id: string | number, is_active: boolean }) => {
    const response = is_active
        ? await userService.deactivateUser(id)
        : await userService.activateUser(id);
    return response.data;
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ results: User[], count: number }>) => {
                state.loading = false;
                state.users = action.payload.results;
                state.count = action.payload.count;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            // Create User
            .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.users.unshift(action.payload);
                state.count += 1;
            })
            // Update User
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete User
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<string | number>) => {
                state.users = state.users.filter(u => u.id !== action.payload);
                state.count -= 1;
            })
            // Toggle User Status
            .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<User>) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });
    },
});

export const { clearUserError } = usersSlice.actions;
export default usersSlice.reducer;
