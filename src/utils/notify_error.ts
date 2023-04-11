
import { notify } from "notiwind";

const runNotifyError = (text: string, time?: number) => {
  notify({
    group: "top",
    title: "Error",
    text,
    type: "error"
  }, time || 5000)
}

const notifyError = (text: string, time?: number) => { runNotifyError(text, time) }

export { notifyError }
