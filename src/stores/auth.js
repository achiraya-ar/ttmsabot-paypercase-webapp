import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated') === 'true')

  async function login(password) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_name', 'login_password')
      .limit(1)

    if (error) {
      console.error('Supabase login error:', error)

      if (error.code === 'PGRST205') {
        throw new Error(
          'ไม่พบตาราง app_settings ในฐานข้อมูลที่เชื่อมต่อ กรุณาตรวจสอบค่า VITE_SUPABASE_URL ในไฟล์ .env',
        )
      }
      if (error.code === '401' || error.code === '42501') {
        throw new Error(
          'ไม่มีสิทธิ์อ่านตาราง app_settings กรุณาตรวจสอบ RLS Policy ของ Supabase',
        )
      }
      throw new Error('ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาตรวจสอบการเชื่อมต่อ')
    }

    const setting = data?.[0]
    if (!setting) {
      throw new Error('ไม่พบการตั้งค่ารหัสผ่านในระบบ')
    }

    const storedPassword = String(setting.setting_value ?? '').trim()
    const enteredPassword = String(password ?? '').trim()

    if (storedPassword !== enteredPassword) {
      throw new Error('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
    }

    isAuthenticated.value = true
    sessionStorage.setItem('isAuthenticated', 'true')
  }

  function logout() {
    isAuthenticated.value = false
    sessionStorage.removeItem('isAuthenticated')
  }

  return { isAuthenticated, login, logout }
})
