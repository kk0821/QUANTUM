
export function useTrace(trace) {
  return [
    { description: 'Home', pathName: 'HomePage', isLink: true, current: false },
    { description: 'Tickets', pathName: 'TicketsList', isLink: !!trace, current: !trace },
    ( trace ? { ...trace, isLink: false, current: true  } : {})
  ].filter(t => t.description)
}
