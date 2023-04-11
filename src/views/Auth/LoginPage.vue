<template>
  <div>
    <form type="post" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
        <div class="mt-1">
          <input id="email" name="email" type="email" autocomplete="email" required="" v-model="credentials.email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      <div class="space-y-1">
        <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
        <div class="mt-1">
          <input id="password" name="password" type="password" autocomplete="current-password" required="" v-model="credentials.password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" v-model="credentials.rememberMe" class="h-4 w-4 text-amerinode-blue-600 focus:ring-amerinode-blue-500 border-gray-300 rounded" />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-blue-600 hover:text-amerinode-blue-500"> Forgot your password? </a>
        </div>
      </div>

      <div>
        <LoadingButton
            :is-loading="isLoading"
            background-color="bg-amerinode-blue-600"
            :action-click="login"
        >
          Sign in
        </LoadingButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import service from "@/services/auth.service.js"
import {encryptStorage} from "@/services/http.service";
import {notifyError} from "@/utils/notify_error";
import LoadingButton from "@/components/LoadingButton.vue";

const isLoading = ref(false)
const router = useRouter()
const credentials = ref({
  email: import.meta.env.MODE === 'development' ? 'superadmin@domain.com' : '',
  password: import.meta.env.MODE === 'development' ? '123456' : '',
  rememberMe: false
})

const login = (event) => {

  if (event) {
    event.preventDefault()
  }

  if (credentials.value.email !== '' && credentials.value.password !== '') {
    isLoading.value = true;
    encryptStorage.clear();

    service.login(credentials.value).then(x => {
      if (!x.data.defaultPage) {
        notifyError('The role assigned to this user does not have an assigned menu')
      } else {
        encryptStorage.setItem('jwt', x.data.token);
        encryptStorage.setItem('user', JSON.stringify(x.data.user))
        encryptStorage.setItem('navigation', JSON.stringify(x.data.navigation));
        if (x.data.defaultPage) {
          localStorage.setItem('DefaultPage', x.data.defaultPage);
        }
        let fromNav = encryptStorage.getItem('url')
        if (fromNav) {
          encryptStorage.removeItem('url')
          window.location.href = fromNav
        } else {
          if (x.data.defaultPage) {
            router.push({ path: x.data.navigation.find(n => n.name === x.data.defaultPage).href  })
          } else {
            router.push({ path: '404' })
          }
        }
      }
    }).catch(err => {
      credentials.value.password = ''
      notifyError((err.code === "ERR_NETWORK") ? err.message : err.response?.data?.message)
    }).finally(() => { isLoading.value = false })
  } else {
    notifyError('Email address and password are required')
  }
}

</script>
