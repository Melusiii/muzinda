export type Role = 'student' | 'landlord' | 'provider' | 'none';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Transaction {
  id: string
  date: string
  student_name: string
  house_ref: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

export interface LandlordFinance {
  total_earnings: number
  pending_payments: number
  recent_transactions: Transaction[]
  monthly_trends: { month: string; amount: number }[]
  occupancy_rate: number
}

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  avatar_url?: string
  bio?: string
  phone?: string
  university?: string
  verification_status?: VerificationStatus;
  notification_settings?: {
    push: boolean
    email: boolean
    messages: boolean
    updates: boolean
  }
}

export interface TransportRoute {
  id: string
  name: string
  type: string
  price_morning: number
  price_afternoon: number
  pickup_points: string[]
}

export interface Property {
  id: string
  title: string
  type: 'Single' | 'Shared' | 'Apartment' | 'Hostel' | string
  price: number
  location: string
  distance: string
  image_url: string
  verified: boolean
  description?: string
  amenities?: string[]
  available_rooms?: number
  total_rooms?: number
  rating?: number
  reviews_count?: number
  images?: string[]
  landlord_id?: string
  landlord?: {
    full_name: string
    verification_status: VerificationStatus
  }
  name?: string
  status?: string
  gender_preference?: 'Boys Only' | 'Girls Only' | 'Mixed' | string
  nearby_university?: string
  walk_minutes_to_campus?: number
  likes_count?: number
}

export interface Application {
  id: string
  student_id: string
  property_id: string
  status: 'pending' | 'approved' | 'rejected' | 'secured'
  message?: string
  created_at: string
  property?: Property
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  name: string
  avatar_url: string
  lastMessage: string
  time: string
}

export interface ShuttleTicket {
  id: string
  student_id: string
  trip_id: string
  pickup_point: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  trips?: {
    departure_time: string
    trip_date: string
    routes?: {
      name: string
    }
    profiles?: {
      full_name: string
    }
  }
}

export interface MaintenanceTicket {
  id: string
  student_id: string
  property_id: string
  category: string
  description: string
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  images?: string[]
  created_at: string
  property?: {
    title: string
    location: string
    landlord_id?: string
  }
}

export interface MaintenanceRequest {
  id: string
  property_id: string
  landlord_id: string
  student_id: string
  ticket_id?: string // Link to the original student report
  issue_type: string
  description: string
  starting_price: number
  is_emergency: boolean
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  property?: Property
}

export interface MaintenanceBid {
  id: string
  request_id: string
  provider_id: string
  amount: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  request?: MaintenanceRequest
}
