interface Inspection {
    id: number;
    user_id: string;
    signature_id: number | string; // Ajusta según el tipo de signature_id (bigint o uuid)
    fecha: string;
    placas_vehiculo: string;
    viseras: string;
    espejo_interior: string;
    espejo_lateral: string;
    cristales_puerta: string;
    parabrisas: string;
    elevadores_cristales: string;
    cerraduras: string;
    cinturon_seguridad: string;
    volante: string;
    luces_delanteras: string;
    limpieza_vehiculo: string;
    cuartos: string;
    luces_frenos: string;
    luces_direccionales: string;
    luces_intermitentes: string;
    freno_pie: string;
    freno_mano: string;
    nivel_aceite_motor: string;
    nivel_aceite_trans: string;
    liquido_frenos: string;
    llantas: string;
    litros_gasolina_gastada?: number;
    botiquin: boolean;
    extintor: boolean;
    gato_hidraulico: boolean;
    cruceta: boolean;
    lampara_mano: boolean;
    cables_pasacorriente: boolean;
    llanta_refaccion: boolean;
    luces_reflejantes: boolean;
    hora_inicio: string;
    hora_finalizacion: string;
    observaciones?: string;
    kilometraje_inicio?: number;
    kilometraje_final?: number;
  }

export default Inspection;