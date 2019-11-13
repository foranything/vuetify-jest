import { mount } from '@vue/test-utils'
import Logo from '@/components/Logo.vue'
import index from '@/pages/index.vue'

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(index)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})