import { createAsyncSlice } from "@/utils/store"
import { PayloadAction } from "@reduxjs/toolkit"
import { z } from "zod"

const CounterState = z.object({
  count: z.number().default(0),
  status: z.enum(["idle", "loading", "failed"]).default('idle')
})
type CounterState = z.infer<typeof CounterState>

const DefaultCounterState: CounterState = {
  count: 0,
  status: 'idle'
}

export const CounterSlice = createAsyncSlice({
  name: 'counter',
  initialState: DefaultCounterState,
  reducers: create => ({
    increment: create.reducer(
      (state, action: PayloadAction<number> = { payload: 1, type: 'increment' }) => {
        state.count += action.payload
      },
    ),
    decrement: create.reducer(
      (state, action: PayloadAction<number> = { payload: 1, type: 'decrement' }) => {
        state.count -= action.payload
      },
    ),
  }),
  selectors: {
    state: state => state,
    selectCount: counter => counter.count,
    selectStatus: counter => counter.status,
  },
})

export const CounterActions = CounterSlice.actions
export const CounterSelectors = CounterSlice.selectors

