
import { ref } from 'vue'

import { encryptStorage } from '@/services/http.service'

export function useCan() {
  const user = ref(encryptStorage.getItem('user') ? encryptStorage.getItem('user') : {})
  const roles = user.value.roles || []
  const auxTM = {}
  auxTM['Ticket Manager'] =  true

  const can = {
    create: {
      status: [],
      roles: ['All', 'Amerinode', 'Reports', 'Ticket Manager']
    },
    edit: {
      status: ['New','In Progress','Restored','Pending','Assigned','Resolved'],
      roles: {
        Reports: (ticket) => ticket.creator_id === user.value.id && (ticket.status.description === 'New' || ticket.status.description === 'Assigned'),
        All: true,
        Amerinode: true,
        ...auxTM
      }
    },
    cancel: {
      status: ['New','Assigned','In Progress','Restored','Pending','Resolved'],
      roles: {
        Reports: (ticket) => ticket.creator_id === user.value.id && ticket.status.description === 'New',
        All: true,
        Amerinode: true,
        ...auxTM
      }
    },
    assign: {
      status: ['New', 'Assigned'],
      roles: ['Ticket Manager']
    },
    accept: {
      status: ['Assigned'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => u.user_id === user.value.id)
      }
    },
    acceptM: {
      status: ['Assigned'],
      roles: ['Ticket Manager']
    },
    pending: {
      status: ['In Progress'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        }),
        ...auxTM
      }
    },
    pauseRestored: {
      status: ['Restored'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        }),
        ...auxTM
      }
    },
    pauseResolved: {
      status: ['Resolved'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        }),
        ...auxTM
      }
    },
    inProgress: {
      status: ['Pending'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        }),
        ...auxTM
      }
    },
    restored: {
      status: ['In Progress','Pause Restored'],
      roles: {
        All: true,
        Amerinode: true,
        ...auxTM,
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        })
      }
    },
    resolved: {
      status: ['Restored','Pause Resolved'],
      roles: {
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        }),
        ...auxTM
      }
    },
    close: {
      status: ['Resolved'],
      roles: {
        All: true,
        Amerinode: true,
        ...auxTM,
        Operations: (ticket) => ticket.technicals.find(u => {
          return u.user_id === user.value.id && u.status === 'active'
        })
      }
    }
  }

  const canAction = (action, ticket) => {
    if (!can[action]) { return false }

    const byStatus = ticket === true || can[action].status.indexOf(ticket.status.description) !== -1
    let byRole = false
    if (byStatus) {
      if (Array.isArray(can[action].roles)) {
        roles.forEach(r => { byRole = byRole || can[action].roles.indexOf(r.name) !== -1 })
      } else if (ticket !== true) {
        roles.forEach(r => {
          byRole = byRole || ( typeof can[action].roles[r.name] === 'function'
            ? Boolean(can[action].roles[r.name](ticket)) : Boolean(can[action].roles[r.name])
          )
        })
      }
    }

    return byStatus && byRole
  }

  return { canAction }
}
