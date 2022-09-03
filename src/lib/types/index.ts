import type { definitions } from './supabase';

export type Lang = 'ko' | 'en';

export type Room = definitions['rooms'];
export type Message = definitions['messages'];
export type Participation = definitions['participations'];
export type ParticipationWithSlug = definitions['participations_with_slug'];

export type ParticipationRole = 'admin' | 'user';
export type ParticipationType = 'granted' | 'banned';

export type ChatItem =
	| {
			id: string;
			type: 'm';
			created_ts: string;
			message: Message;
	  }
	| {
			id: string;
			type: 'p';
			created_ts: string;
			participation: Participation;
	  };
