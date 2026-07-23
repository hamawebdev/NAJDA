/** Response shapes of the backend API (see backend/crates/api/src/handlers). */

export interface Wilaya {
  code: number;
  name_ar: string;
  name_fr: string;
  name_en: string;
}

export interface Commune {
  id: number;
  wilaya_code: number;
  name_ar: string;
  name_fr: string;
}

export interface GroupSummary {
  id: number;
  name: string;
  leader_first_name: string;
  wilaya_code: number;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_id: number;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
  created_at: number;
  member_count: number;
}

export interface Member {
  first_name: string;
  last_name: string;
  phone: string;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
  joined_at: number;
}

export interface GroupDetail extends GroupSummary {
  viewer: "public" | "member" | "leader";
  leader_phone?: string;
  leader_last_name?: string;
  members?: Member[];
}

export interface OwnGroup {
  id: number;
  name: string;
  leader_first_name: string;
  leader_last_name: string;
  leader_phone: string;
  wilaya_code: number;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_id: number;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
  member_count: number;
}

export interface Me {
  group: OwnGroup;
  unread_notifications: number;
}

export interface LeaderNotification {
  id: number;
  read: boolean;
  created_at: number;
  first_name: string;
  last_name: string;
  phone: string;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
}

export interface ResourceOffer {
  id: number;
  full_name: string;
  phone: string;
  wilaya_code: number;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
  categories: string[];
  details: string;
  created_at: number;
}

export interface HelpRequest {
  id: number;
  full_name: string;
  phone: string;
  wilaya_code: number;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_name_ar: string;
  commune_name_fr: string;
  neighborhood: string;
  needs: string;
  created_at: number;
}

export interface MissingPerson {
  id: number;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  wilaya_code: number;
  wilaya_name_ar: string;
  wilaya_name_fr: string;
  commune_name_ar: string;
  commune_name_fr: string;
  last_seen_details: string;
  description: string;
  contact_phone: string;
  created_at: number;
}

export const RESOURCE_CATEGORIES = [
  "water",
  "food",
  "medicine",
  "blankets",
  "clothing",
  "fuel",
  "generators",
  "transportation",
  "firefighting_equipment",
  "first_aid",
  "other",
] as const;

export const HELP_CHIPS = [
  "water",
  "food",
  "medicine",
  "evacuation",
  "shelter",
  "clothing",
  "baby_supplies",
  "other",
] as const;
