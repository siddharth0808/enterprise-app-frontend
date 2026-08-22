import { createAction } from '@reduxjs/toolkit';

// Dispatched once, from the sign-out flow, so every feature slice can reset
// its own state in one place instead of duplicating "clear my data" logic
// across components (spec section 10 - Sign Out).
export const resetApplicationState = createAction('app/resetApplicationState');
