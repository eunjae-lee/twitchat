import type { definitions } from './supabase';

export type Lang = 'ko' | 'en';

export type Room = definitions['rooms'];
export type Message = definitions['messages'];
export type Participation = definitions['participations'];
export type ParticipationWithSlug = definitions['participations_with_slug'];

export type ParticipationRole = 'admin' | 'user';
