
import { notify } from "notiwind";

const runNotifySuccess = (title, text: string, time?: number) => {
  notify({
    group: "top",
    title,
    text,
    type: "success"
  }, time || 5000)
}

const notifySuccess = (title: string, text: string, time?: number) => { runNotifySuccess(title, text, time) }

export { notifySuccess }
