import { z } from 'zod';

const baseSchema = z.object({
  //booleans
  botiquin: z.boolean().optional(),
  extintor: z.boolean().optional(),
  gato_hidraulico: z.boolean().optional(),
  cruceta: z.boolean().optional(),
  lampara_mano: z.boolean().optional(),
  cables_pasacorriente: z.boolean().optional(),
  llanta_refaccion: z.boolean().optional(),
  luces_reflejantes: z.boolean().optional(),

  //dates
  hora_inicio: z.string({
    message: 'La hora de inicio es requerida',
    required_error: 'La hora de inicio es requerida',
  }).time(),
  hora_finalizacion: z.string({
    message: 'La hora de finalización es requerida',
    required_error: 'La hora de finalización es requerida',
  }).time(),
  fecha: z.string({
    message: 'La fecha es requerida',
    required_error: 'La fecha es requerida',
  }).date(),
});

// Extiende según tus necesidades
const statusEnum = z.enum(['bien', 'mal']).default('mal');

export const reportSchema = baseSchema.extend({
  // Campos adicionales
  placas_vehiculo: z.string({
    message: 'Las placas del vehículo son requeridas',
    required_error: 'Las placas del vehículo son requeridas',
  }),
  viseras: statusEnum,
  espejo_interior: statusEnum,
  espejo_lateral: statusEnum,
  cristales_puerta: statusEnum,
  parabrisas: statusEnum,
  elevadores_cristales: statusEnum,
  cerraduras: statusEnum,
  cinturon_seguridad: statusEnum,
  volante: statusEnum,
  luces_delanteras: statusEnum,
  limpieza_vehiculo: statusEnum,
  cuartos: statusEnum,
  luces_frenos: statusEnum,
  luces_direccionales: statusEnum,
  luces_intermitentes: statusEnum,
  freno_pie: statusEnum,
  freno_mano: statusEnum,
  nivel_aceite_motor: statusEnum,
  nivel_aceite_trans: statusEnum,
  liquido_frenos: statusEnum,
  llantas: statusEnum,
  observaciones: z.string().optional(),

  user_signature_id: z.string({
    message: 'La firma del usuario es requerida',
  }),
});

export type ReportFormData = z.infer<typeof reportSchema>;