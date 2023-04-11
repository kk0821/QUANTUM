
import { reactive } from "vue";

export const loading = reactive({
    state: false,
    show () {
        this.state = true
    },
    hide () {
        this.state = false
    }
})
