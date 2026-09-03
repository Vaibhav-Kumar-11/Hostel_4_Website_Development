import type { MealWindow, WeeklyMenu } from '@/types/content'

/**
 * ── MESS DATA ───────────────────────────────────────────────────────────────
 * PLACEHOLDER — timings and menu below are illustrative and must be replaced
 * with the figures published by the Hostel 4 mess council before launch.
 *
 * To update:
 *   1. `mealWindows` sets the timings and drives the live "now serving" logic.
 *   2. `weeklyMenu` is indexed by JavaScript weekday (0 = Sunday … 6 = Saturday).
 *   3. Set `MESS_DATA_VERIFIED = true` once real data is in — that removes the
 *      "sample menu" note shown to residents.
 */

export const MESS_DATA_VERIFIED = false

export const mealWindows: MealWindow[] = [
  { key: 'breakfast', label: 'Breakfast', start: '07:30', end: '09:30', icon: '☕' },
  { key: 'lunch', label: 'Lunch', start: '12:00', end: '14:30', icon: '🍛' },
  { key: 'snacks', label: 'Snacks', start: '16:30', end: '18:00', icon: '🫖' },
  { key: 'dinner', label: 'Dinner', start: '19:30', end: '21:30', icon: '🍲' },
]

/** Index 0 = Sunday, 1 = Monday, … 6 = Saturday. */
export const weeklyMenu: WeeklyMenu = [
  {
    // Sunday
    breakfast: ['Aloo Paratha', 'Curd', 'Pickle', 'Tea / Coffee'],
    lunch: ['Chole', 'Jeera Rice', 'Roti', 'Boondi Raita', 'Salad'],
    snacks: ['Samosa', 'Green Chutney', 'Tea'],
    dinner: ['Paneer Butter Masala', 'Dal Fry', 'Rice', 'Roti', 'Gulab Jamun'],
  },
  {
    // Monday
    breakfast: ['Idli', 'Sambar', 'Coconut Chutney', 'Banana', 'Milk'],
    lunch: ['Rajma', 'Rice', 'Roti', 'Aloo Bhujia', 'Salad'],
    snacks: ['Poha', 'Sev', 'Tea'],
    dinner: ['Mix Veg', 'Dal Tadka', 'Rice', 'Roti', 'Curd'],
  },
  {
    // Tuesday
    breakfast: ['Poha', 'Boiled Eggs', 'Bread & Jam', 'Tea / Coffee'],
    lunch: ['Kadhi Pakoda', 'Rice', 'Roti', 'Bhindi Masala', 'Salad'],
    snacks: ['Vada Pav', 'Fried Chilli', 'Tea'],
    dinner: ['Chana Masala', 'Dal', 'Rice', 'Roti', 'Papad'],
  },
  {
    // Wednesday
    breakfast: ['Upma', 'Chutney', 'Sprouts', 'Milk'],
    lunch: ['Aloo Gobi', 'Dal', 'Rice', 'Roti', 'Salad'],
    snacks: ['Pasta', 'Ketchup', 'Tea'],
    dinner: ['Veg Biryani', 'Raita', 'Roti', 'Sewaiyan'],
  },
  {
    // Thursday
    breakfast: ['Dosa', 'Sambar', 'Chutney', 'Tea / Coffee'],
    lunch: ['Soya Chunk Curry', 'Rice', 'Roti', 'Cabbage Sabzi', 'Salad'],
    snacks: ['Bread Pakoda', 'Chutney', 'Tea'],
    dinner: ['Malai Kofta', 'Dal', 'Rice', 'Roti', 'Curd'],
  },
  {
    // Friday
    breakfast: ['Puri Bhaji', 'Banana', 'Milk'],
    lunch: ['Sambar', 'Rice', 'Roti', 'Beans Poriyal', 'Salad'],
    snacks: ['Maggi', 'Tea'],
    dinner: ['Egg Curry / Paneer Tikka Masala', 'Dal', 'Rice', 'Roti', 'Ice Cream'],
  },
  {
    // Saturday
    breakfast: ['Sandwich', 'Cornflakes', 'Milk', 'Tea / Coffee'],
    lunch: ['Dal Makhani', 'Rice', 'Roti', 'Aloo Matar', 'Salad'],
    snacks: ['Chowmein', 'Manchurian', 'Tea'],
    dinner: ['Chicken Curry / Veg Kofta', 'Dal', 'Rice', 'Roti', 'Halwa'],
  },
]

export const weekdayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

/**
 * ── MESS REBATE ─────────────────────────────────────────────────────────────
 * Residents claim a rebate on mess charges for days they are away. The
 * calculator on the Resources page uses the two values below.
 *
 * Both are `null` because neither has been confirmed, and neither may be
 * guessed — a wrong rebate figure is the kind of error someone budgets around.
 * While `ratePerDay` is null the calculator asks the resident for the daily
 * charge from their own mess bill and remembers it on their device, so it
 * works today and simply gets easier once the official figure is filled in.
 *
 *   ratePerDay:   the daily mess charge in rupees, e.g. 150
 *   minimumDays:  the shortest absence that qualifies, e.g. 3
 *   noticeDays:   how far ahead the application must be filed, e.g. 2
 */
export const messRebate: {
  ratePerDay: number | null
  minimumDays: number | null
  noticeDays: number | null
} = {
  ratePerDay: null,
  minimumDays: null,
  noticeDays: null,
}
