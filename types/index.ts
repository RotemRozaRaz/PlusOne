export interface User {
  id: string
  device_id: string
  name: string
  instagram: string | null
  photo_url: string
  created_at: string
  is_active: boolean
}

export interface Like {
  id: string
  liker_id: string
  liked_id: string
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
}
