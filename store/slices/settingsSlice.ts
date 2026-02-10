
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    isCustomPrintingEnabled: boolean;
    adminTheme: string;
}

const initialState: SettingsState = {
    isCustomPrintingEnabled: localStorage.getItem('rwooga_custom_printing') !== 'false',
    adminTheme: localStorage.getItem('admin_theme') || 'light',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setPrintingEnabled: (state, action: PayloadAction<boolean>) => {
            state.isCustomPrintingEnabled = action.payload;
            localStorage.setItem('rwooga_custom_printing', action.payload.toString());
        },
        setAdminTheme: (state, action: PayloadAction<string>) => {
            state.adminTheme = action.payload;
            localStorage.setItem('admin_theme', action.payload);
        }
    }
});

export const { setPrintingEnabled, setAdminTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
