export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))

export const formatMonth = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(date))

export const currentMonth = () => new Date().toISOString().slice(0, 7)
