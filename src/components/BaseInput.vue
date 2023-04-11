<template>
  <label v-show="showLabel" class="block text-sm font-medium text-gray-700">{{ label }}</label>
  <div class="mt-1 relative rounded-md shadow-sm">
    <slot name="prefix" />
    <input
        v-bind="$attrs"
        v-bind:disabled="isDisabled || disabledIf"
        :id="id"
        :name="id"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :required="isRequired"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="focus:ring-amerinode-blue-500 focus:border-amerinode-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        :class="[ isDisabled || disabledIf ? 'disabled:opacity-75':'']"
    />
    <slot name="suffix" />
  </div>
</template>
<script setup>

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  autocomplete: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  disabledIf: {
    type: Boolean,
    default: false
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
})
</script>
