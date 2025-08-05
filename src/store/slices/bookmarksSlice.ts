import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async (_, thunkAPI) => {
    const res = await fetch("/api/favorites");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }
);

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookmarksSlice.reducer;
