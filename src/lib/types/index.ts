import type { definitions } from './supabase';

export type Lang = 'ko' | 'en';

export type Room = definitions['rooms'];
export type CheckParticipation = definitions['check_participation'];

export type ParticipationRole = 'admin' | 'user';
