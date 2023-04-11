import userService from "@/services/user.service";
import {encryptStorage} from "@/services/http.service";
import {notifyError} from "@/utils/notify_error";
import {ref} from "vue";

const projects = ref([])
const project = ref({})

function loadProjects() {
    projects.value = encryptStorage.getItem('projects') ? encryptStorage.getItem('projects') : []
    project.value = encryptStorage.getItem('project') ? encryptStorage.getItem('project') : {}
}

function setProjectDefault() {
    encryptStorage.setItem('project', JSON.stringify(projects.value[0]))
    project.value = encryptStorage.getItem('project')
}

export function projectsDefined() {
    loadProjects()
    return { projects, project }
}

export function setProjectWithReload(item)  {
    setProject(item)
    window.location.reload()
}

export function setProject(item) {

    if (!item || !item.id) {
        item = { id: 0};
    }

    if (!projects.value.length)
    {
        project.value = {}
        return
    }

    if (!item || !item.id || !project.value) {
        setProjectDefault()
        return
    }

    if (projects.value.filter(p => p.id === project.value.id).length) {
        encryptStorage.setItem('project', JSON.stringify(item));
        project.value = item
    } else {
        setProjectDefault()
    }
}

export function updateProjects() {

    loadProjects()
    userService.getProjects().then(x => {
        encryptStorage.setItem('projects', JSON.stringify(x.data.projects))
        projects.value = encryptStorage.getItem('projects') ? encryptStorage.getItem('projects') : []
        let projectChanged = (encryptStorage.getItem('project')) ? encryptStorage.getItem('project') : {}
        setProject(projectChanged)
    }).catch(err => { notifyError((err.code === "ERR_BAD_REQUEST") ? err.response.data.message : err.message) })
}
