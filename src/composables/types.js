import {ref} from "vue";
import {
    CheckBadgeIcon,
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    PlusIcon,
    ShieldCheckIcon,
    TrashIcon,
    UsersIcon
} from "@heroicons/vue/24/outline";

export function useStatus() {
    const statuses = ref([
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' }
    ])

    return { statuses }
}

export function useStatusTicket() {

    const statuses = ref([
        { name: 'new', icon: PlusIcon },
        { name: 'inprogress', icon: PlayIcon },
        { name: 'restored', icon: ForwardIcon },
        { name: 'resolved', icon: CheckBadgeIcon },
        { name: 'closed', icon: ShieldCheckIcon },
        { name: 'pending', icon: PauseIcon },
        { name: 'pause_restored', icon: PauseIcon },
        { name: 'pause_resolved', icon: PauseIcon },
        { name: 'cancelled', icon: TrashIcon },
        { name: 'assigned', icon: UsersIcon }
    ])

    return { statuses }
}
