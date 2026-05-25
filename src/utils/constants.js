export const STATUSES = {
  lead:        { label: 'ליד',         color: 'blue',   bg: 'bg-blue-100',   text: 'text-blue-700'   },
  negotiation: { label: 'משא ומתן',    color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700' },
  active:      { label: 'פעיל',        color: 'green',  bg: 'bg-green-100',  text: 'text-green-700'  },
  cancelled:   { label: 'בוטל',        color: 'red',    bg: 'bg-red-100',    text: 'text-red-700'    },
}

export const STATUS_MAP_COLORS = {
  lead:        '#3B82F6',
  negotiation: '#F97316',
  active:      '#22C55E',
  cancelled:   '#EF4444',
}

export const NEIGHBORHOODS = [
  'מרכז', 'צפון', 'דרום', 'נווה זאב', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳',
  'עיר עתיקה', 'לב ים', 'אפרידר', 'כרמי', 'יג׳', 'יד׳', 'אחר',
]

export const NEIGHBORHOOD_COORDS = {
  'מרכז':       [31.812, 34.660],
  'צפון':       [31.845, 34.655],
  'דרום':       [31.778, 34.653],
  'נווה זאב':   [31.800, 34.638],
  'ג׳':         [31.808, 34.665],
  'ד׳':         [31.818, 34.668],
  'ה׳':         [31.828, 34.665],
  'ו׳':         [31.825, 34.655],
  'ז׳':         [31.835, 34.650],
  'עיר עתיקה':  [31.796, 34.643],
  'לב ים':      [31.803, 34.633],
  'אפרידר':     [31.815, 34.638],
  'כרמי':       [31.790, 34.640],
  'יג׳':        [31.840, 34.660],
  'יד׳':        [31.843, 34.656],
  'אחר':        [31.812, 34.655],
}

export const MONTHS_HE = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
]

export const DAYS_HE = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']
