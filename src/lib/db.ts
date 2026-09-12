import { supabase } from './supabase';
import {
  profileFromDB, profileToDB,
  stageFromDB, stageToDB,
  visiteFromDB, visiteToDB,
  auditFromDB, auditToDB,
  ficheM01FromDB, ficheM01ToDB,
  docFromDB, docToDB,
  affectationFromDB, affectationToDB,
  planningFromDB, planningToDB,
  messageFromDB, messageToDB,
  indemnisationFromDB, indemnisationToDB,
} from './mappers';
import type {
  UserProfile, Stage, Visite, AuditRecord, FicheM01Uploaded,
  RegulatoryDoc, AffectationFPA, PlanningAnnuel, MessageDiscussion,
} from '../types';

export const db = {
  profiles: {
    async getAll(): Promise<UserProfile[]> {
      const { data } = await supabase.from('profiles').select('*');
      return (data || []).map(profileFromDB);
    },
    async getByEmail(email: string): Promise<UserProfile | null> {
      const { data } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
      return data ? profileFromDB(data) : null;
    },
    async upsert(user: UserProfile): Promise<void> {
      await supabase.from('profiles').upsert(profileToDB(user));
    },
    async update(id: string, patch: Partial<UserProfile>): Promise<void> {
      const { data: current } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (current) {
        const updated = { ...profileFromDB(current), ...patch };
        await supabase.from('profiles').update(profileToDB(updated)).eq('id', id);
      }
    },
    async bulkUpsert(users: UserProfile[]): Promise<void> {
      await supabase.from('profiles').upsert(users.map(profileToDB), { onConflict: 'email' });
    },
  },

  stages: {
    async getAll(): Promise<Stage[]> {
      const { data } = await supabase.from('stages').select('*').order('date_creation', { ascending: false });
      return (data || []).map(stageFromDB);
    },
    async insert(stage: Stage): Promise<void> {
      await supabase.from('stages').insert(stageToDB(stage));
    },
    async upsert(stage: Stage): Promise<void> {
      await supabase.from('stages').upsert(stageToDB(stage));
    },
    async updateFields(id: string, fields: Record<string, unknown>): Promise<void> {
      await supabase.from('stages').update(fields).eq('id', id);
    },
    async delete(id: string): Promise<void> {
      await supabase.from('stages').delete().eq('id', id);
    },
  },

  visites: {
    async getAll(): Promise<Visite[]> {
      const { data } = await supabase.from('visites').select('*');
      return (data || []).map(visiteFromDB);
    },
    async insert(visite: Visite): Promise<void> {
      await supabase.from('visites').insert(visiteToDB(visite));
    },
    async upsert(visite: Visite): Promise<void> {
      await supabase.from('visites').upsert(visiteToDB(visite));
    },
    async update(visite: Visite): Promise<void> {
      await supabase.from('visites').update(visiteToDB(visite)).eq('id', visite.id);
    },
    async delete(id: string): Promise<void> {
      await supabase.from('visites').delete().eq('id', id);
    },
  },

  auditRecords: {
    async getAll(): Promise<AuditRecord[]> {
      const { data } = await supabase.from('audit_records').select('*').order('date_audit', { ascending: false });
      return (data || []).map(auditFromDB);
    },
    async insert(audit: AuditRecord): Promise<void> {
      await supabase.from('audit_records').insert(auditToDB(audit));
    },
    async upsert(audit: AuditRecord): Promise<void> {
      await supabase.from('audit_records').upsert(auditToDB(audit));
    },
    async delete(id: string): Promise<void> {
      await supabase.from('audit_records').delete().eq('id', id);
    },
  },

  fichesM01: {
    async getAll(): Promise<FicheM01Uploaded[]> {
      const { data } = await supabase.from('fiches_m01').select('*').order('date_televersement', { ascending: false });
      return (data || []).map(ficheM01FromDB);
    },
    async insert(fiche: FicheM01Uploaded): Promise<void> {
      await supabase.from('fiches_m01').insert(ficheM01ToDB(fiche));
    },
    async upsert(fiche: FicheM01Uploaded): Promise<void> {
      await supabase.from('fiches_m01').upsert(ficheM01ToDB(fiche));
    },
  },

  regulatoryDocs: {
    async getAll(): Promise<RegulatoryDoc[]> {
      const { data } = await supabase.from('regulatory_docs').select('*');
      return (data || []).map(docFromDB);
    },
    async upsertMany(docs: RegulatoryDoc[]): Promise<void> {
      await supabase.from('regulatory_docs').upsert(docs.map(docToDB));
    },
  },

  affectations: {
    async getAll(): Promise<AffectationFPA[]> {
      const { data } = await supabase.from('affectations_fpa').select('*');
      return (data || []).map(affectationFromDB);
    },
    async insert(aff: AffectationFPA): Promise<void> {
      await supabase.from('affectations_fpa').insert(affectationToDB(aff));
    },
    async upsert(aff: AffectationFPA): Promise<void> {
      await supabase.from('affectations_fpa').upsert(affectationToDB(aff));
    },
    async update(id: string, aff: AffectationFPA): Promise<void> {
      await supabase.from('affectations_fpa').update(affectationToDB(aff)).eq('id', id);
    },
    async delete(id: string): Promise<void> {
      await supabase.from('affectations_fpa').delete().eq('id', id);
    },
  },

  plannings: {
    async getAll(): Promise<PlanningAnnuel[]> {
      const { data } = await supabase.from('plannings_annuels').select('*');
      return (data || []).map(planningFromDB);
    },
    async insert(plan: PlanningAnnuel): Promise<void> {
      await supabase.from('plannings_annuels').insert(planningToDB(plan));
    },
    async upsert(plan: PlanningAnnuel): Promise<void> {
      await supabase.from('plannings_annuels').upsert(planningToDB(plan));
    },
    async update(id: string, plan: PlanningAnnuel): Promise<void> {
      await supabase.from('plannings_annuels').update(planningToDB(plan)).eq('id', id);
    },
    async delete(id: string): Promise<void> {
      await supabase.from('plannings_annuels').delete().eq('id', id);
    },
  },

  messages: {
    async getAll(): Promise<MessageDiscussion[]> {
      const { data } = await supabase.from('messages_discussion').select('*').order('date_envoi', { ascending: true });
      return (data || []).map(messageFromDB);
    },
    async insert(msg: MessageDiscussion): Promise<void> {
      await supabase.from('messages_discussion').insert(messageToDB(msg));
    },
  },

  indemnisations: {
    async getAll() {
      const { data } = await supabase.from('indemnisations_efp').select('*');
      return (data || []).map(indemnisationFromDB);
    },
    async upsertMany(items: any[]): Promise<void> {
      await supabase.from('indemnisations_efp').upsert(items.map(indemnisationToDB));
    },
  },
};
