import { z } from 'zod';

const baseSchema = z.object({
  //booleans
  botiquin: z.boolean().default(false),
  extintor: z.boolean().default(false),
  gato_hidraulico: z.boolean().default(false),
  cruceta: z.boolean().default(false),
  lampara_mano: z.boolean().default(false),
  cables_pasacorriente: z.boolean().default(false),
  llanta_refaccion: z.boolean().default(false),
  luces_reflejantes: z.boolean().default(false),

  //dates
  hora_inicio: z
    .string({ required_error: 'La hora de inicio es obligatoria' })
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'La hora de inicio debe estar en formato HH:mm:ss'),
    hora_finalizacion: z
    .string({ required_error: 'La hora de finalización es obligatoria' })
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'La hora de finalización debe estar en formato HH:mm:ss'),
  fecha: z.date({ required_error: 'La fecha es obligatoria' }),
});

// Extiende según tus necesidades
const statusEnum = z.enum(['bien', 'mal']).default('bien');

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
  observaciones: z.string().default("Ninguna"),
  litros_gasolina_gastada: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined; // Si está vacío, devolver undefined
      const num = Number(val);
      if (isNaN(num)) {
        throw new Error('Debe ingresar un número válido');
      }
      return num;
    }),
});

export type ReportFormData = z.infer<typeof reportSchema>;