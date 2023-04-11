
import { reactive } from "vue";

export const loadingButton = reactive({
    state: false,
    show () {
        this.state = true
    },
    hide () {
        this.state = false
    }
})
