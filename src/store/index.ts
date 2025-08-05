import { configureStore } from '@reduxjs/toolkit';
import bookmarksReducer from './slices/bookmarksSlice';
import tabsReducer from './slices/tabsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    bookmarks: bookmarksReducer,
    tabs: tabsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;