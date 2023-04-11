<template>
  <label :for="labelInput" class="block text-sm font-medium text-gray-700">{{ labelInput }}</label>
  <div class="mt-1 relative rounded-md shadow-sm">
    <div v-if="prefix.length" class="absolute inset-y-0 left-0 flex items-center pointer-events-none" :class="[ prefix.length ? 'pl-3':'pl-7']">
      <span class="text-gray-500 sm:text-sm"> {{ prefix }} </span>
    </div>
    <input
        v-bind="$attrs"
        v-bind:disabled="disabled || disabledIf"
        :id="idInput"
        :name="idInput"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        :class="[ disabled ? 'disabled:opacity-75':'', prefix.length ? 'pl-7':'pl-3', required && !modelValue ? 'bg-red-100' : '']"
    />
    <div class="absolute inset-y-0 right-0 flex items-center">
      <label for="currency" class="sr-only">{{ labelSelect }}</label>
      <select
          :id="idSelect"
          :name="idSelect"
          v-bind:disabled="disabled"
          :value="selectedOption"
          :required="required"
          @change="updateSelect($event)"
          class="focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md transition ease-in-out">
        <option
            v-for="option in options"
            :key="option[keyValue]"
            :value="onlyValue ? option[keyValue] : option"
        >
          {{ option[keyLabel]  }}
        </option>
      </select>
    </div>
  </div>

</template>
<script setup>
import {onUpdated, toRefs} from "vue";

const emit = defineEmits(['change','reset','updateSelect','update:updatedItem','update:modelValue'])
const props = defineProps({
  idInput: {
    type: String,
    required: true
  },
  labelInput: {
    type: String,
    default: ''
  },
  idSelect: {
    type: String,
    required: true
  },
  labelSelect: {
    type: String,
    default: ''
  },
  prefix: {
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
  onlyValue: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
  },
  selectedOption: {
    type: [String, Number, Object]
  },
  options: {
    type: [Object, Array],
  },
  disabledIf: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  resetInputValue: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})
const data = toRefs(props)
const updateSelect = (event) => {
  emit('update:updatedItem', event.target.value)
}

onUpdated( () => {
  if (data.resetInputValue.value) {
    emit('update:modelValue', '')
    //we invoke a reset in the parent form, to apply a reset to the fields that we need
    emit('reset')
  }
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
