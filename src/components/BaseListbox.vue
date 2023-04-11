<template>
  <Listbox as="div"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    :multiple="multiple"
    aria-required="true"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="onChangeEmit"
    @click="onClickEmit"
  >
    <ListboxLabel class="block text-sm font-medium text-gray-700">{{ label }}</ListboxLabel>
    <div class="relative mt-1">
      <ListboxButton
        class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 sm:text-sm"
        :class="[disabled ? 'disabled:opacity-75':'']"
      >
        <div>
          <span class="block truncate" v-if="isValue">{{ showValue }}</span>
          <span class="block truncate" v-else>{{ labelSelect || label || ' ' }}</span>
        </div>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>
      <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in options"
              :key="option[keyValue]"
              :value="onlyValue ? option[keyValue] : option"
              as="template"
          >
              <li
                :class="[
                  active ?
                  'bg-amerinode-blue-100 text-amerinode-blue-900'
                  : 'text-gray-900','relative cursor-default select-none py-2 pl-10 pr-4'
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal','block truncate']">
                  {{ emitValue ? option[keyValue] : option[keyLabel] }}
                </span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-amerinode-blue-600">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed, toRefs } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  modelValue:{
    type: [String, Number, Array, Object, Boolean]
  },
  label: {
    type: String,
    default: ''
  },
  labelSelect: {
    type: String,
    default: ''
  },
  keyLabel: {
    type: String,
    default: 'label'
  },
  keyValue: {
    type: String,
    default: 'value'
  },
  options: {
    type: Array,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  onlyValue: {
    type: Boolean,
    default: false
  },
  emitValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'change', 'update:modelValue'])

const isValue = computed(() => {
  return ['string', 'number'].indexOf(typeof props.modelValue) !== -1 ? props.modelValue : (
    props.multiple ? props.modelValue.length : props.modelValue[props.keyValue]
  )
})

const showValue = computed(() => {
  const v = props.multiple ? props.modelValue[0] : props.modelValue
  return props.emitValue ? (v[props.keyValue] || v) : (v[props.keyLabel] || v)
})

const onChangeEmit = ($event) => {
  return emit('change', $event, props.modelValue)
}
const onClickEmit = ($event) => {
  return emit('click', $event, props.modelValue)
}

</script>
