import { z } from 'zod';

export const EID_REGEX = /^EID-\d{4,6}$/;

export const AnimalStatusEnum = z.enum(['Alive', 'Sick', 'Moved', 'Deceased']);
export type AnimalStatus = z.infer<typeof AnimalStatusEnum>;

export const GenderEnum = z.enum(['Male', 'Female', 'Unknown']);
export type Gender = z.infer<typeof GenderEnum>;

export const AnimalBaseSchema = z.object({
  eid_tag: z
    .string({ required_error: 'EID is required' })
    .regex(EID_REGEX, 'EID must match ^EID-0000..000000'),
  dob: z
    .string({ required_error: 'DOB is required' })
    .refine((v) => {
      const d = new Date(v);
      const now = new Date();
      return !isNaN(d.getTime()) && d < now;
    }, 'DOB must be a past date'),
  gender: GenderEnum,
  status: AnimalStatusEnum.default('Alive'),
  health_status: z.string().optional(),
  deceased_on: z
    .string()
    .optional()
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v);
      const now = new Date();
      return !isNaN(d.getTime()) && d <= now;
    }, 'Deceased date must be in the past'),
});

export type AnimalBase = z.infer<typeof AnimalBaseSchema>;

export const MovementEntrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  from: z.string().optional(),
  to: z.string().optional(),
  actor: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});
export type MovementEntry = z.infer<typeof MovementEntrySchema>;

export const LifecycleEventTypeEnum = z.enum([
  'Vaccination',
  'Illness',
  'Breeding',
  'Movement',
  'Death',
  'Misc',
]);
export type LifecycleEventType = z.infer<typeof LifecycleEventTypeEnum>;

export const LifecycleEventBaseSchema = z.object({
  eid_tag: z.string().regex(EID_REGEX),
  type: LifecycleEventTypeEnum,
  date: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const IllnessEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Illness'),
  health_status: z.string().min(1, 'Health notes are required when marking Sick'),
});

export const DeathEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Death'),
  health_status: z.string().min(1, 'Health notes are required when marking Deceased'),
  deceased_on: z
    .string()
    .refine((v) => {
      const d = new Date(v);
      const now = new Date();
      return !isNaN(d.getTime()) && d <= now;
    }, 'Deceased date must be in the past'),
});

export const MovementEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Movement'),
  to: z.string().min(1, 'Destination required'),
});

export const VaccinationEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Vaccination'),
  vaccine: z.string().min(1, 'Vaccine name required'),
  batch: z.string().optional(),
});

export const BreedingEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Breeding'),
  partner_eid: z.string().regex(EID_REGEX).optional(),
});

export const MiscEventSchema = LifecycleEventBaseSchema.extend({
  type: z.literal('Misc'),
});

export const LifecycleEventSchema = z.discriminatedUnion('type', [
  IllnessEventSchema,
  DeathEventSchema,
  MovementEventSchema,
  VaccinationEventSchema,
  BreedingEventSchema,
  MiscEventSchema,
]);
export type LifecycleEvent = z.infer<typeof LifecycleEventSchema>;

export function requireHealthNotesIfNeeded(values: AnimalBase) {
  if (values.status === 'Sick' || values.status === 'Deceased') {
    return !!values.health_status && values.health_status.trim().length > 0;
  }
  return true;
}

export const AgeGroupEnum = z.enum(['Calf', 'Yearling', 'Adult', 'Senior']);
export type AgeGroup = z.infer<typeof AgeGroupEnum>;

export const HerdFiltersSchema = z.object({
  keyword: z.string().optional(),
  ageGroup: AgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
  healthStatus: z.string().optional(),
  movementStatus: z.enum(['Stationary', 'Moved']).optional(),
  sortBy: z.enum(['EID', 'Last Event', 'Status']).default('EID'),
});
export type HerdFilters = z.infer<typeof HerdFiltersSchema>; 